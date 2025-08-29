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
import logging

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

class OptimizedVisualizer:
    """优化的可视化器"""
    
    def __init__(self, phone_configs: List[PhoneConfig], grid_size: int = 20):
        self.phone_configs = phone_configs
        self.grid_size = grid_size
        
        # matplotlib优化设置
        matplotlib.use('TkAgg')  # 使用更快的后端
        matplotlib.rcParams['font.sans-serif'] = ['Microsoft YaHei', 'SimHei']
        matplotlib.rcParams['axes.unicode_minus'] = False
        matplotlib.rcParams['figure.max_open_warning'] = 0
        
        # 创建图形
        self.fig = plt.figure(figsize=(14, 6))
        self.ax_line = self.fig.add_subplot(1, 2, 1)
        self.ax_3d = self.fig.add_subplot(1, 2, 2, projection='3d')
        
        self.setup_static_elements()
        self.setup_interpolation_grid()
        
        plt.tight_layout()
        plt.ion()
        plt.show(block=False)
        
        # 性能优化变量
        self.last_update_time = 0
        self.min_update_interval = 0.05  # 最小更新间隔50ms
        
        # 预分配数组，避免重复创建
        self.z_grid = np.full((self.grid_size, self.grid_size), np.nan)
        
    def setup_static_elements(self):
        """设置静态元素（只需要设置一次）"""
        # 自定义颜色映射
        colors = [
            (0.0, (0.5, 0.0, 0.5)),   # 紫色（低）
            (0.5, (1.0, 0.5, 0.0)),   # 橙色（中）
            (1.0, (1.0, 1.0, 0.0))    # 黄色（高）
        ]
        self.cmap = LinearSegmentedColormap.from_list('noise_yellow_purple', colors, N=128)
        self.norm = matplotlib.colors.Normalize(vmin=20, vmax=100)
        
        # 初始化线条对象
        self.lines = {}
        for config in self.phone_configs:
            line, = self.ax_line.plot([], [], color=config.color, 
                                    label=config.name, linewidth=1.5, alpha=0.9)
            self.lines[config.name] = line
        
        # 设置图表样式
        self.ax_line.set_title('噪音监测 ', fontsize=12, fontweight='bold')
        self.ax_line.set_xlabel('时间 (秒)', fontsize=10)
        self.ax_line.set_ylabel('噪音水平 (dB)', fontsize=10)
        self.ax_line.legend(fontsize=9, loc='upper right')
        self.ax_line.grid(True, alpha=0.3)
        # 添加50dB参考线
        self.ax_line.axhline(50, color='gold', linestyle='--', linewidth=1.2, label='50dB参考线')
        
        self.ax_3d.set_title('空间分布图', fontsize=12, fontweight='bold')
        self.ax_3d.set_xlabel('X', fontsize=10)
        self.ax_3d.set_ylabel('Y', fontsize=10)
        self.ax_3d.set_zlabel('dB', fontsize=10)
        
        # 添加颜色条（colorbar）作为空间分布图图例
        mappable = matplotlib.cm.ScalarMappable(cmap=self.cmap, norm=self.norm)
        mappable.set_array([])
        self.colorbar = self.fig.colorbar(mappable, ax=self.ax_3d, pad=0.15, shrink=0.7, aspect=20, label='噪音水平 (dB)')
        
        # 3D图的固定元素
        self.surface = None
        self.scatter_points = []
        
    def setup_interpolation_grid(self):
        """设置插值网格"""
        x = np.linspace(0, 1, self.grid_size)
        y = np.linspace(0, 1, self.grid_size)
        self.grid_x, self.grid_y = np.meshgrid(x, y)
        
        # 预计算距离矩阵以提高插值速度
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
                
                # 处理重合点
                min_dist_idx = np.argmin(distances)
                if distances[min_dist_idx] < 1e-6:
                    self.z_grid[i, j] = valid_values[min_dist_idx]
                else:
                    # IDW计算
                    weights = 1 / (distances ** 2 + 1e-6)  # 添加小值避免除零
                    self.z_grid[i, j] = np.sum(weights * valid_values) / np.sum(weights)
        
        return self.z_grid
    
    def update_line_plot(self, collector: FastNoiseCollector):
        """更新线图（优化版本）"""
        current_time = time.time()
        max_time = 0
        for config in self.phone_configs:
            history = collector.get_history_data(config.name, max_points=1000)  # 允许更多历史
            if len(history) > 1:
                base_time = history[0].timestamp
                times = [(h.timestamp - base_time) for h in history if h.value is not None]
                values = [h.value for h in history if h.value is not None]
                if times and values:
                    self.lines[config.name].set_data(times, values)
                    if times:
                        max_time = max(max_time, max(times))
        # 动态调整坐标轴
        all_data = []
        for config in self.phone_configs:
            history = collector.get_history_data(config.name, max_points=20)
            all_data.extend([h.value for h in history if h.value is not None])
        if all_data:
            y_min, y_max = min(all_data) - 3, max(all_data) + 3
            self.ax_line.set_ylim(y_min, y_max)
            # x轴范围：小于60秒时显示0-60，大于60秒时自动扩展
            self.ax_line.set_xlim(0, max(60, max_time))
    
    def update_3d_plot(self, current_values: Dict[str, Optional[float]]):
        """更新3D图（高度优化）"""
        # 清除旧的surface和散点
        if self.surface is not None:
            try:
                self.surface.remove()
            except Exception as e:
                logger.warning(f"移除surface时出错: {e}")
        for point in self.scatter_points:
            try:
                point.remove()
            except Exception as e:
                logger.warning(f"移除scatter点时出错: {e}")
        self.scatter_points.clear()
        
        # 获取当前值
        values = [current_values.get(config.name) for config in self.phone_configs]
        
        # 快速插值
        z_interpolated = self.fast_idw_interpolation(values)
        
        # 绘制surface（只在有有效数据时）
        if np.any(np.isfinite(z_interpolated)):
            self.surface = self.ax_3d.plot_surface(
                self.grid_x, self.grid_y, z_interpolated,
                cmap=self.cmap, norm=self.norm,
                alpha=0.7, edgecolor='none', linewidth=0,
                rcount=self.grid_size//2, ccount=self.grid_size//2  # 减少渲染复杂度
            )
            
            # 添加手机位置点
            for config in self.phone_configs:
                value = current_values.get(config.name)
                if value is not None:
                    point = self.ax_3d.scatter(
                        config.position[0], config.position[1], value,
                        c='white', marker=config.marker, s=80,
                        edgecolors='black', linewidth=1.5,
                        alpha=1.0
                    )
                    self.scatter_points.append(point)
            
            self.ax_3d.set_zlim(20, 100)
    
    def update_display(self, collector: FastNoiseCollector):
        """更新显示（帧率控制）"""
        current_time = time.time()
        
        # 控制更新频率，避免过度渲染
        if current_time - self.last_update_time < self.min_update_interval:
            return
        
        try:
            current_values = collector.get_current_data()
            
            # 快速更新
            self.update_line_plot(collector)
            self.update_3d_plot(current_values)
            
            # 非阻塞渲染
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
            PhoneConfig("http://192.168.3.126:8000", (0.05, 0.1), "床位1", "#1f77b4", "o"),
            PhoneConfig("http://192.168.3.132:8080", (0.15, 0.2), "床位2", "#ff7f0e", "s"),
            PhoneConfig("http://192.168.3.134:8080", (0.25, 0.3), "床位3", "#2ca02c", "^"),
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
        self.visualizer = OptimizedVisualizer(self.phone_configs)
        
        # 性能监控
        self.performance_monitor = {
            'frame_times': deque(maxlen=100),
            'last_frame_time': time.time()
        }
    
    def run(self):
        """运行监测系统"""
        logger.info("启动高性能噪音监测系统...")
        logger.info("目标性能: 1秒/次数据采集, 20FPS显示刷新")
        
        # 显示配置
        for config in self.phone_configs:
            logger.info(f"{config.name}: {config.url}")
        
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
            logger.info("接收到停止信号...")
        except Exception as e:
            logger.error(f"系统错误: {e}")
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
            
            logger.info(f"性能状态 - 平均帧时间: {avg_frame_time:.1f}ms, "
                       f"最大帧时间: {max_frame_time:.1f}ms, "
                       f"FPS: {fps:.1f}, "
                       f"数据成功率: {stats['success_rate']*100:.1f}%, "
                       f"平均响应时间: {stats['avg_response_time']*1000:.1f}ms")
    
    def cleanup(self):
        """清理资源"""
        logger.info("正在清理系统资源...")
        self.collector.stop_collection()
        self.visualizer.close()
        logger.info("系统已安全关闭")

if __name__ == "__main__":
    # 设置更激进的matplotlib参数以提高性能
    matplotlib.rcParams['path.simplify'] = True
    matplotlib.rcParams['path.simplify_threshold'] = 0.1
    matplotlib.rcParams['agg.path.chunksize'] = 1000
    
    # 创建并运行系统
    monitor = HighPerformanceNoiseMonitor()
    monitor.run()