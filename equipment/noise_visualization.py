import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# 生成20个随机点 (X,Y坐标)
np.random.seed(42)
points = np.random.rand(20, 2) * 10  # 在0-10范围内生成点

# 生成30个时间点的噪音数据 (20个点 × 30个时间点)
noise_data = np.random.normal(0, 1, (30, 20))  # 均值为0，标准差为1的正态分布噪音

# 创建图形
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))
fig.suptitle('噪音数据可视化')

# 静态可视化 - 初始噪音水平
scatter = ax1.scatter(points[:, 0], points[:, 1], c=noise_data[0], 
                     cmap='viridis', s=100)
ax1.set_title('初始噪音水平')
ax1.set_xlabel('X坐标')
ax1.set_ylabel('Y坐标')
plt.colorbar(scatter, ax=ax1, label='噪音水平')

# 动画初始化函数
def init():
    ax2.clear()
    ax2.set_title('噪音随时间变化')
    ax2.set_xlabel('时间点')
    ax2.set_ylabel('噪音水平')
    return []

# 动画更新函数
def update(frame):
    ax2.clear()
    for i in range(20):
        ax2.plot(noise_data[:frame+1, i], label=f'点{i+1}')
    ax2.set_title(f'时间点 {frame+1}/30')
    ax2.set_xlabel('时间点')
    ax2.set_ylabel('噪音水平')
    ax2.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
    return []

# 创建动画
ani = FuncAnimation(fig, update, frames=30, init_func=init, 
                   interval=500, blit=True)

plt.tight_layout()
plt.show()
