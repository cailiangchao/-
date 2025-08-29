# -*- coding: utf-8 -*-
import requests
import time
import threading
import queue
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from typing import Optional, List, Tuple, Dict
from collections import deque
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import matplotlib
from matplotlib.colors import LinearSegmentedColormap
import matplotlib.patches as patches
from matplotlib.patches import Circle, FancyBboxPatch
import matplotlib.animation as animation
import logging
from mpl_toolkits.axes_grid1 import make_axes_locatable

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class PhoneConfig:
    """手机配置"""
    url: str
    position: Tuple[float, float]
    name: str
    color: str
    marker: str

@dataclass
class NoiseReading:
    """噪音读数"""
    timestamp: float
    phone_name: str
    value: Optional[float]

class FastNoiseCollector:
    """高性能数据采集器"""
    
    def __init__(self, phone_configs: List[PhoneConfig], max_history: int = 500):
        self.phone_configs = phone_configs
        self.max_history = max_history
        
        # 使用线程安全的数据结构
        self.current_values = {}
        self.history_data = {config.name: deque(maxlen=max_history) for config in phone_configs}
        self.data_lock = threading.RLock()
        
        # 数据更新队列
        self.update_queue = queue.Queue(maxsize=100)
        
        # 控制变量
        self.running = False
        self.collection_executor = ThreadPoolExecutor(max_workers=len(phone_configs))
        
        # 会话复用，提高网络性能
        self.session = requests.Session()
        self.session.headers.update({'Connection': 'keep-alive'})
        
        # 统计信息
        self.stats = {
            'total_requests': 0,
            'failed_requests': 0,
            'avg_response_time': 0
        }
    
    def fetch_single_phone_data(self, config: PhoneConfig) -> Tuple[str, Optional[float], float]:
        """获取单个手机数据（线程安全）"""
        start_time = time.time()
        try:
            response = self.session.get(
                f"{config.url}/get?dB",
                timeout=0.8,  # 减少超时时间
                proxies=None
            )
            response.raise_for_status()
            data = response.json()
            db_values = data.get("buffer", {}).get("dB", {}).get("buffer", [])
            # 快速获取最新值
            for value in reversed(db_values):
                if value is not None:
                    elapsed = time.time() - start_time
                    return config.name, float(value), elapsed
            elapsed = time.time() - start_time
            return config.name, None, elapsed
        except Exception as e:
            elapsed = time.time() - start_time
            if elapsed > 0.5:  # 只记录慢请求的错误
                logger.debug(f"数据获取失败 {config.name}: {type(e).__name__}")
            return config.name, None, elapsed
    
    def collect_all_data_async(self) -> Dict[str, Optional[float]]:
        """并行采集所有手机数据"""
        collection_start = time.time()
        
        # 并行请求所有手机
        future_to_config = {
            self.collection_executor.submit(self.fetch_single_phone_data, config): config 
            for config in self.phone_configs
        }
        
        results = {}
        response_times = []
        
        # 收集结果，设置总超时
        for future in as_completed(future_to_config, timeout=1.2):
            try:
                phone_name, value, response_time = future.result()
                results[phone_name] = value
                response_times.append(response_time)
                
                self.stats['total_requests'] += 1
                if value is None:
                    self.stats['failed_requests'] += 1
                    
            except Exception as e:
                config = future_to_config[future]
                results[config.name] = None
                self.stats['failed_requests'] += 1
        
        # 更新统计
        if response_times:
            self.stats['avg_response_time'] = np.mean(response_times)
        
        collection_time = time.time() - collection_start
        if collection_time > 0.9:  # 采集时间过长时警告
            logger.warning(f"数据采集耗时: {collection_time:.2f}s")
        
        return results
    
    def start_collection(self, interval: float = 1.0):
        """启动数据采集"""
        self.running = True
        
        def collection_loop():
            next_collection = time.time()
            
            while self.running:
                current_time = time.time()
                
                # 精确控制采集间隔
                if current_time >= next_collection:
                    try:
                        # 并行采集数据
                        new_data = self.collect_all_data_async()
                        timestamp = time.time()
                        
                        # 快速更新数据
                        with self.data_lock:
                            self.current_values.update(new_data)
                            
                            # 更新历史数据
                            for phone_name, value in new_data.items():
                                reading = NoiseReading(timestamp, phone_name, value)
                                self.history_data[phone_name].append(reading)
                        
                        # 通知更新（非阻塞）
                        try:
                            self.update_queue.put_nowait(timestamp)
                        except queue.Full:
                            pass  # 队列满时跳过，避免阻塞
                        
                        next_collection = current_time + interval
                        
                    except Exception as e:
                        logger.error(f"采集循环错误: {e}")
                        next_collection = current_time + interval
                
                # 短暂休眠，避免CPU占用过高
                time.sleep(0.01)
        
        self.collection_thread = threading.Thread(target=collection_loop, daemon=True)
        self.collection_thread.start()
        logger.info("数据采集线程已启动")
    
    def get_current_data(self) -> Dict[str, Optional[float]]:
        """获取当前数据（线程安全）"""
        with self.data_lock:
            return self.current_values.copy()
    
    def get_history_data(self, phone_name: str, max_points: int = 100) -> List[NoiseReading]:
        """获取历史数据（限制点数以提高性能）"""
        with self.data_lock:
            history = list(self.history_data.get(phone_name, []))
            # 如果数据太多，进行抽样
            if len(history) > max_points:
                step = len(history) // max_points
                return history[::step]
            return history
    
    def stop_collection(self):
        """停止采集"""
        self.running = False
        if hasattr(self, 'collection_thread'):
            self.collection_thread.join(timeout=2)
        self.collection_executor.shutdown(wait=False)
        self.session.close()
    
    def get_stats(self) -> Dict:
        """获取统计信息"""
        success_rate = 1.0
        if self.stats['total_requests'] > 0:
            success_rate = 1 - (self.stats['failed_requests'] / self.stats['total_requests'])
        
        return {
            **self.stats,
            'success_rate': success_rate
        }

class ModernVisualizer:
    """现代化可视化器"""
    
    def __init__(self, phone_configs: List[PhoneConfig], grid_size: int = 25):
        self.phone_configs = phone_configs
        self.grid_size = grid_size
        
        # 设置现代化的matplotlib样式
        plt.style.use('dark_background')
        matplotlib.rcParams.update({
            'font.sans-serif': ['Microsoft YaHei', 'Arial', 'DejaVu Sans'],
            'axes.unicode_minus': False,
            'figure.facecolor': '#1e1e1e',
            'axes.facecolor': '#2d2d2d',
            'axes.edgecolor': '#404040',
            'axes.labelcolor': '#ffffff',
            'text.color': '#ffffff',
            'xtick.color': '#ffffff',
            'ytick.color': '#ffffff',
            'grid.color': '#404040',
            'grid.alpha': 0.3,
            'figure.max_open_warning': 0
        })
        
        # 创建主窗口
        self.fig = plt.figure(figsize=(16, 10))
        self.fig.suptitle('NICU 实时噪音监测系统', fontsize=20, fontweight='bold', 
                         color='#00ff88', y=0.95)
        
        # 创建网格布局
        gs = self.fig.add_gridspec(3, 5, hspace=0.3, wspace=0.4, height_ratios=[2, 2, 0.8], width_ratios=[2, 2, 2, 2, 0.5])
        
        # 主要图表区域
        self.ax_line = self.fig.add_subplot(gs[0:2, 0:2])
        self.ax_heatmap = self.fig.add_subplot(gs[0:2, 2:4])
        
        # 底部状态区域
        self.ax_status = self.fig.add_subplot(gs[2, 0:4])
        
        # 初始化图表
        self.setup_line_chart()
        self.setup_heatmap()
        self.setup_status_panel()
        self.setup_interpolation_grid()
        
        plt.tight_layout()
        plt.ion()
        plt.show(block=False)
        
        # 性能优化变量
        self.last_update_time = 0
        self.min_update_interval = 0.05
        self.z_grid = np.full((self.grid_size, self.grid_size), np.nan)
        
        # 动画效果
        self.pulse_phase = 0
        
    def setup_line_chart(self):
        """设置现代化趋势图"""
        # 渐变背景
        gradient = np.linspace(0, 1, 256).reshape(1, -1)
        self.ax_line.imshow(gradient, extent=[0, 60, 20, 100], aspect='auto', 
                           cmap='viridis', alpha=0.1)
        
        # 初始化线条
        self.lines = {}
        self.line_shadows = {}
        
        for i, config in enumerate(self.phone_configs):
            # 主线条 - 更粗更亮
            line, = self.ax_line.plot([], [], color=config.color, 
                                    linewidth=2.5, alpha=0.9, 
                                    label=config.name,
                                    marker='o', markersize=4, markevery=5)
            self.lines[config.name] = line
            
            # 阴影线条 - 创建发光效果
            shadow, = self.ax_line.plot([], [], color=config.color, 
                                      linewidth=6, alpha=0.2)
            self.line_shadows[config.name] = shadow
        
        # 危险区域标识
        self.ax_line.axhspan(65, 100, alpha=0.2, color='red', label='危险区域 (>65dB)')
        self.ax_line.axhspan(45, 65, alpha=0.1, color='yellow', label='警告区域 (45-65dB)')
        self.ax_line.axhspan(20, 45, alpha=0.1, color='green', label='安全区域 (<45dB)')
        
        # 美化设置
        self.ax_line.set_title(' 实时噪音趋势', fontsize=14, fontweight='bold', 
                              color='#00ff88', pad=20)
        self.ax_line.set_xlabel('时间 (秒)', fontsize=12, color='#ffffff')
        self.ax_line.set_ylabel('噪音水平 (dB)', fontsize=12, color='#ffffff')
        self.ax_line.grid(True, alpha=0.3, linestyle='--')
        self.ax_line.set_xlim(0, 60)
        self.ax_line.set_ylim(20, 100)
        
        # 现代化图例
        legend = self.ax_line.legend(bbox_to_anchor=(0, 1), loc='upper right', frameon=True, 
                           fancybox=True, shadow=True,
                           framealpha=0.8, facecolor='#2d2d2d')
        
    def setup_heatmap(self):
        """设置现代化热力图"""
        # 自定义现代化色彩映射
        colors_modern = [
            '#0a0a23',  # 深蓝 (安静)
            '#1a472a',  # 深绿
            '#2d5a2d',  # 绿色
            '#d4af37',  # 金色 (中等)
            '#ff6b35',  # 橙色 (嘈杂)
            '#ff0000',  # 红色 (危险)
        ]
        self.cmap_modern = LinearSegmentedColormap.from_list('modern_noise', colors_modern, N=256)
        self.norm = matplotlib.colors.Normalize(vmin=20, vmax=85)
        
        self.ax_heatmap.set_title(' 空间噪音分布', fontsize=14, fontweight='bold', 
                                 color='#00ff88', pad=20)
        self.ax_heatmap.set_xlabel('X 坐标', fontsize=12, color='#ffffff')
        self.ax_heatmap.set_ylabel('Y 坐标', fontsize=12, color='#ffffff')
        
        # 预设网格
        x = np.linspace(0, 1, self.grid_size)
        y = np.linspace(0, 1, self.grid_size)
        self.grid_x, self.grid_y = np.meshgrid(x, y)
        
        # 初始化热力图
        self.heatmap_im = None
        self.sensor_markers = []
        
        # 添加色彩条
        divider = make_axes_locatable(self.ax_heatmap)
        cax = divider.append_axes("right", size="5%", pad=0.1)
        self.colorbar = plt.colorbar(plt.cm.ScalarMappable(cmap=self.cmap_modern, norm=self.norm), 
                                   cax=cax, label='噪音水平 (dB)')
        self.colorbar.ax.yaxis.label.set_color('#ffffff')
        
    def setup_status_panel(self):
        """设置现代化状态面板"""
        self.ax_status.set_xlim(0, 10)
        self.ax_status.set_ylim(0, 2)
        self.ax_status.axis('off')
        
        # 状态面板背景
        bg_rect = FancyBboxPatch((0.1, 0.1), 9.8, 1.8, 
                               boxstyle="round,pad=0.1", 
                               facecolor='#3d3d3d', 
                               edgecolor='#00ff88', 
                               linewidth=2, alpha=0.8)
        self.ax_status.add_patch(bg_rect)
        
        # 状态文本区域
        self.status_texts = []
        
        # 实时统计显示
        self.stats_text = self.ax_status.text(5, 1.5, '', ha='center', va='center', 
                                            fontsize=14, fontweight='bold', 
                                            color='#00ff88')
        
        # 传感器状态网格
        self.sensor_status_markers = {}
        
    def setup_interpolation_grid(self):
        """设置插值网格"""
        x = np.linspace(0, 1, self.grid_size)
        y = np.linspace(0, 1, self.grid_size)
        self.grid_x, self.grid_y = np.meshgrid(x, y)
        self.phone_positions = np.array([config.position for config in self.phone_configs])
        
    def fast_idw_interpolation(self, values: List[Optional[float]]) -> np.ndarray:
        """快速IDW插值（向量化计算）"""
        self.z_grid.fill(np.nan)
        
        # 过滤有效值
        valid_indices = [i for i, v in enumerate(values) if v is not None]
        if not valid_indices:
            return self.z_grid
        
        valid_positions = self.phone_positions[valid_indices]
        valid_values = np.array([values[i] for i in valid_indices])
        
        # 向量化距离计算
        for i in range(self.grid_size):
            for j in range(self.grid_size):
                grid_point = np.array([self.grid_x[i, j], self.grid_y[i, j]])
                distances = np.linalg.norm(valid_positions - grid_point, axis=1)
                
                min_dist_idx = np.argmin(distances)
                if distances[min_dist_idx] < 1e-6:
                    self.z_grid[i, j] = valid_values[min_dist_idx]
                else:
                    weights = 1 / (distances ** 2 + 1e-6)
                    self.z_grid[i, j] = np.sum(weights * valid_values) / np.sum(weights)
        
        return self.z_grid
    
    def update_line_chart(self, collector: FastNoiseCollector):
        """更新趋势图"""
        current_time = time.time()
        max_time = 0
        
        for config in self.phone_configs:
            history = collector.get_history_data(config.name, max_points=200)
            if len(history) > 1:
                base_time = history[0].timestamp
                times = [(h.timestamp - base_time) for h in history if h.value is not None]
                values = [h.value for h in history if h.value is not None]
                
                if times and values:
                    # 更新主线条
                    self.lines[config.name].set_data(times, values)
                    # 更新阴影（发光效果）
                    self.line_shadows[config.name].set_data(times, values)
                    
                    if times:
                        max_time = max(max_time, max(times))
        
        # 动态调整x轴
        if max_time > 0:
            self.ax_line.set_xlim(max(0, max_time - 60), max_time + 5)
    
    def update_heatmap(self, current_values: Dict[str, Optional[float]]):
        """更新热力图"""
        # 清除旧的热力图
        if self.heatmap_im is not None:
            self.heatmap_im.remove()
        
        # 清除旧的标记
        for marker in self.sensor_markers:
            marker.remove()
        self.sensor_markers.clear()
        
        # 获取当前值并插值
        values = [current_values.get(config.name) for config in self.phone_configs]
        z_interpolated = self.fast_idw_interpolation(values)
        
        # 绘制新的热力图
        if np.any(np.isfinite(z_interpolated)):
            self.heatmap_im = self.ax_heatmap.imshow(
                z_interpolated, extent=[0, 1, 0, 1], 
                cmap=self.cmap_modern, norm=self.norm,
                alpha=0.8, aspect=0.6, origin='lower',
                interpolation='bilinear'
            )
            
            # 添加传感器位置标记
            for config in self.phone_configs:
                value = current_values.get(config.name)
                if value is not None:
                    # 根据噪音水平选择颜色
                    if value < 45:
                        color = '#00ff00'  # 绿色 - 安全
                        marker_size = 100
                    elif value < 60:
                        color = '#ffff00'  # 黄色 - 警告
                        marker_size = 120
                    else:
                        color = '#ff0000'  # 红色 - 危险
                        marker_size = 150
                    
                    # 添加脉冲效果
                    pulse_size = marker_size + 30 * abs(np.sin(self.pulse_phase))
                    
                    # 外圈（脉冲效果）
                    outer = self.ax_heatmap.scatter(
                        config.position[0], config.position[1],
                        s=pulse_size, c=color, alpha=0.3,
                        marker='o', edgecolors='none'
                    )
                    self.sensor_markers.append(outer)
                    
                    # 内圈（主标记）
                    inner = self.ax_heatmap.scatter(
                        config.position[0], config.position[1],
                        s=marker_size, c='white', alpha=1.0,
                        marker='o', edgecolors=color, linewidth=3
                    )
                    self.sensor_markers.append(inner)
                    
                    # 数值标签
                    text = self.ax_heatmap.text(
                        config.position[0], config.position[1] + 0.08,
                        f'{value:.1f}dB', ha='center', va='center',
                        fontsize=9, fontweight='bold', color='white',
                        bbox=dict(boxstyle='round,pad=0.3', facecolor=color, alpha=0.7)
                    )
                    self.sensor_markers.append(text)
                else:
                    # 离线传感器标记
                    offline = self.ax_heatmap.scatter(
                        config.position[0], config.position[1],
                        s=80, c='gray', alpha=0.5,
                        marker='x', linewidth=3
                    )
                    self.sensor_markers.append(offline)
        
        self.pulse_phase += 0.2  # 更新脉冲相位
    
    def update_status_panel(self, collector: FastNoiseCollector):
        """更新状态面板"""
        current_values = collector.get_current_data()
        stats = collector.get_stats()
        
        # 清除旧文本
        for text in self.status_texts:
            text.remove()
        self.status_texts.clear()
        
        # 统计信息
        active_sensors = sum(1 for v in current_values.values() if v is not None)
        total_sensors = len(self.phone_configs)
        
        valid_values = [v for v in current_values.values() if v is not None]
        
        if valid_values:
            avg_noise = np.mean(valid_values)
            max_noise = max(valid_values)
            min_noise = min(valid_values)
            
            # 危险传感器数量
            danger_count = sum(1 for v in valid_values if v > 65)
            warning_count = sum(1 for v in valid_values if 45 <= v <= 65)
            safe_count = sum(1 for v in valid_values if v < 45)
            
            status_color = '#00ff00' if danger_count == 0 else '#ff6600' if danger_count < 3 else '#ff0000'
            
            # 主状态文本
            main_status = f" 在线: {active_sensors}/{total_sensors} |  平均: {avg_noise:.1f}dB |  范围: {min_noise:.1f}-{max_noise:.1f}dB"
            
            text1 = self.ax_status.text(5, 1.5, main_status, ha='center', va='center',
                                      fontsize=12, fontweight='bold', color='#00ff88')
            self.status_texts.append(text1)
            
            # 详细状态
            detail_status = f" 安全: {safe_count} |  警告: {warning_count} |  危险: {danger_count} |  成功率: {stats['success_rate']*100:.0f}%"
            
            text2 = self.ax_status.text(5, 0.8, detail_status, ha='center', va='center',
                                      fontsize=10, color='#ffffff')
            self.status_texts.append(text2)
            
            # 时间戳
            timestamp = time.strftime('%H:%M:%S')
            text3 = self.ax_status.text(5, 0.3, f" 更新时间: {timestamp}", 
                                      ha='center', va='center',
                                      fontsize=10, color='#888888')
            self.status_texts.append(text3)
        
        else:
            # 无数据状态
            text1 = self.ax_status.text(5, 1, "⚠️ 正在等待数据...", ha='center', va='center',
                                      fontsize=14, fontweight='bold', color='#ff6600')
            self.status_texts.append(text1)
    
    def update_display(self, collector: FastNoiseCollector):
        """更新显示"""
        current_time = time.time()
        
        if current_time - self.last_update_time < self.min_update_interval:
            return
        
        try:
            current_values = collector.get_current_data()
            
            # 更新各个组件
            self.update_line_chart(collector)
            self.update_heatmap(current_values)
            self.update_status_panel(collector)
            
            # 刷新显示
            plt.draw()
            self.fig.canvas.flush_events()
            
            self.last_update_time = current_time
            
        except Exception as e:
            logger.error(f"显示更新错误: {e}")
    
    def close(self):
        """关闭可视化"""
        plt.ioff()
        plt.close(self.fig)

class HighPerformanceNoiseMonitor:
    """高性能噪音监测系统"""
    
    def __init__(self):
        # 默认配置 - 可以根据实际情况修改IP地址
        self.phone_configs = [
            PhoneConfig("http://192.168.3.126:8000", (0.1, 0.8), "床位1", "#1f77b4", "o"),
            PhoneConfig("http://192.168.3.78:8080", (0.3, 0.8), "床位2", "#ff7f0e", "s"),
            PhoneConfig("http://192.168.3.72:8080", (0.5, 0.8), "床位3", "#2ca02c", "^"),
            PhoneConfig("http://192.168.3.135:8080", (0.35, 0.4), "床位4", "#d62728", "D"),
            PhoneConfig("http://192.168.3.136:8080", (0.45, 0.5), "床位5", "#9467bd", "v"),
            PhoneConfig("http://192.168.3.137:8080", (0.55, 0.6), "床位6", "#8c564b", "<"),
            PhoneConfig("http://192.168.3.133:8080", (0.65, 0.7), "床位7", "#e377c2", ">"),
            PhoneConfig("http://192.168.3.138:8080", (0.75, 0.8), "床位8", "#7f7f7f", "p"),
            PhoneConfig("http://192.168.3.139:8080", (0.85, 0.9), "床位9", "#bcbd22", "h"),
            PhoneConfig("http://192.168.3.110:8000", (0.95, 0.1), "床位10", "#17becf", "8"),
            PhoneConfig("http://192.168.3.111:8000", (0.10, 0.9), "床位11", "#aec7e8", "o"),
            PhoneConfig("http://192.168.3.112:8000", (0.20, 0.8), "床位12", "#ffbb78", "s"),
            PhoneConfig("http://192.168.3.113:8000", (0.30, 0.7), "床位13", "#98df8a", "^"),
            PhoneConfig("http://192.168.3.114:8000", (0.40, 0.6), "床位14", "#ff9896", "D"),
            PhoneConfig("http://192.168.3.115:8000", (0.50, 0.5), "床位15", "#c5b0d5", "v"),
            PhoneConfig("http://192.168.3.116:8000", (0.60, 0.4), "床位16", "#c49c94", "<"),
            PhoneConfig("http://192.168.3.117:8000", (0.70, 0.3), "床位17", "#f7b6d2", ">"),
            PhoneConfig("http://192.168.3.118:8000", (0.80, 0.2), "床位18", "#c7c7c7", "p"),
            PhoneConfig("http://192.168.3.119:8000", (0.90, 0.1), "床位19", "#dbdb8d", "h"),
            PhoneConfig("http://192.168.3.120:8000", (0.50, 0.1), "床位20", "#9edae5", "8"),
        ]
        self.collector = FastNoiseCollector(self.phone_configs)
        self.visualizer = ModernVisualizer(self.phone_configs)
        
        # 性能监控
        self.performance_monitor = {
            'frame_times': deque(maxlen=100),
            'last_frame_time': time.time()
        }
    
    def run(self):
        """运行监测系统"""
        logger.info(" 启动现代化NICU噪音监测系统...")
        logger.info(" 目标性能: 1秒/次数据采集, 20FPS显示刷新")
        
        # 显示配置
        for config in self.phone_configs:
            logger.info(f"📱 {config.name}: {config.url}")
        
        try:
            # 启动数据采集
            self.collector.start_collection(interval=1.0)
            
            # 主显示循环
            last_stats_time = time.time()
            
            while True:
                loop_start = time.time()
                
                # 更新显示
                self.visualizer.update_display(self.collector)
                
                # 性能统计
                frame_time = time.time() - loop_start
                self.performance_monitor['frame_times'].append(frame_time)
                
                # 每10秒输出一次性能统计
                if time.time() - last_stats_time > 10:
                    self.print_performance_stats()
                    last_stats_time = time.time()
                
                # 控制刷新率（约20FPS）
                target_frame_time = 1.0 / 20
                sleep_time = max(0, target_frame_time - frame_time)
                if sleep_time > 0:
                    time.sleep(sleep_time)

        except KeyboardInterrupt:
            logger.info("⏹️ 接收到停止信号...")
        except Exception as e:
            logger.error(f"❌ 系统错误: {e}")
        finally:
            self.cleanup()
    
    def print_performance_stats(self):
        """打印性能统计"""
        frame_times = list(self.performance_monitor['frame_times'])
        if frame_times:
            avg_frame_time = np.mean(frame_times) * 1000  # 转换为毫秒
            max_frame_time = max(frame_times) * 1000
            fps = 1.0 / np.mean(frame_times) if np.mean(frame_times) > 0 else 0
            
            stats = self.collector.get_stats()
            
            logger.info(f" 性能状态 - 平均帧时间: {avg_frame_time:.1f}ms, "
                       f"最大帧时间: {max_frame_time:.1f}ms, "
                       f"FPS: {fps:.1f}, "
                       f"数据成功率: {stats['success_rate']*100:.1f}%, "
                       f"平均响应时间: {stats['avg_response_time']*1000:.1f}ms")
    
    def cleanup(self):
        """清理资源"""
        logger.info("🧹 正在清理系统资源...")
        self.collector.stop_collection()
        self.visualizer.close()
        logger.info("✅ 系统已安全关闭")

if __name__ == "__main__":
    # 设置更激进的matplotlib参数以提高性能
    matplotlib.rcParams['path.simplify'] = True
    matplotlib.rcParams['path.simplify_threshold'] = 0.1
    matplotlib.rcParams['agg.path.chunksize'] = 1000
    
    # 创建并运行系统
    monitor = HighPerformanceNoiseMonitor()
    monitor.run()