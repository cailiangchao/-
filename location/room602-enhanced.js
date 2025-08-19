// 602室床位布局配置
const room602Config = {
    canvasSize: { width: 500, height: 400 },
    beds: [
        // 右侧横向排列的床位
        { id: "602-03", position: { x: 438, y: 40 }, rotation: 90, hasOxygen: true },
        { id: "602-02", position: { x: 438, y: 140 }, rotation: 90, hasOxygen: true },
        { id: "602-01", position: { x: 438, y: 235 }, rotation: 90, hasOxygen: false },
        
        // 左侧床位
        { id: "602-05", position: { x: 285, y: 0 }, rotation: 0, hasOxygen: true },
        { id: "602-06", position: { x: 170, y: 150 }, rotation: 0, hasOxygen: true },
        { id: "602-07", position: { x: 20, y: 250 }, rotation: 90, hasOxygen: true }
    ],
    facilities: [
        { type: "warehouse", label: "库房", position: { x: 375, y: 315 }, width: 125, height: 85 },
        { type: "computer", label: "电脑", position: { x: 360, y: 350 } },
        { type: "induction_door", label: "感应门", position: { x: 210, y: 360 }, width: 60, height: 40 },
        { type: "induction_door", label: "门", position: { x: 0, y: 100 }, width: 60, height: 40 },
        { type: "warehouse", label: "室外", position: { x: 0, y: 0 }, width: 255, height: 150 },
        { type: "washbasin", label: "洗手池", position: { x: 0, y: 370 } }
    ],
    // 氧源标识位置
    oxygenSources: [
        { position: { x: 258, y: 98 }, symbol: "◉" },  // 602-03 右侧
        { position: { x: 238, y: 152 }, symbol: "◉" },  // 602-02 右侧
        { position: { x: 93, y: 152 }, symbol: "◉" },  // 602-01 右侧
        { position: { x: 10, y: 240 }, symbol: "◉" },  // 602-05 左侧
        { position: { x: 493, y: 110 }, symbol: "◉" },  // 602-06 左侧
        { position: { x: 493, y: 200 }, symbol: "◉" },  // 602-06 右侧
        
    ],
    // 机械吊塔位置
    mechanicalTowers: [
        { position: { x: 435, y: 14 }, label: "机械吊塔" },  // 602-03 左侧
        { position: { x: 425, y: 116 }, label: "机械吊塔" }, // 602-02 左侧
        { position: { x: 425, y: 208 }, label: "机械吊塔" }, // 602-01 左侧
        { position: { x: 20, y: 180 }, label: "机械吊塔" }   // 602-07 左侧
    ]
};

// 602室床位管理器
class Room602Manager extends BedManager {
    constructor() {
        super('room602', room602Config);
    }
    
    // 重写渲染方法
    render() {
        const container = document.getElementById('room602-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        // 渲染设施
        this.renderFacilities(container);
        
        // 渲染氧源标识
        this.renderOxygenSources(container);
        
        // 渲染机械吊塔
        this.renderMechanicalTowers(container);
        
        // 渲染所有床位（原有床位 + 加床）
        this.renderAllBeds(container);
        
        // 启用拖拽功能（仅对加床）
        this.enableDragMode();
        
        // 更新床位统计信息
        this.updateBedStatistics();
    }
    
    // 渲染设施
    renderFacilities(container) {
        this.config.facilities.forEach(facility => {
            const facilityEl = document.createElement('div');
            facilityEl.className = `facility ${facility.type}`;
            facilityEl.style.left = `${facility.position.x}px`;
            facilityEl.style.top = `${facility.position.y}px`;
            
            // 特殊处理库房
            if (facility.type === 'warehouse') {
                facilityEl.style.width = `${facility.width}px`;
                facilityEl.style.height = `${facility.height}px`;
                facilityEl.style.border = '2px solid #333';
                facilityEl.style.backgroundColor = '#f9f9f9';
                facilityEl.style.display = 'flex';
                facilityEl.style.justifyContent = 'center';
                facilityEl.style.alignItems = 'center';
                facilityEl.style.fontSize = '16px';
                facilityEl.style.fontWeight = 'bold';
            }
            
            // 特殊处理感应门
            if (facility.type === 'induction_door') {
                facilityEl.style.width = '60px';
                facilityEl.style.height = '40px';
                facilityEl.style.border = '2px solid #333';
                facilityEl.style.backgroundColor = '#fff';
                facilityEl.style.display = 'flex';
                facilityEl.style.justifyContent = 'center';
                facilityEl.style.alignItems = 'center';
                facilityEl.style.fontSize = '10px';
                facilityEl.style.fontWeight = 'bold';
                facilityEl.style.color = '#333';
            }
            
            // 特殊处理洗手池
            if (facility.type === 'washbasin') {
                facilityEl.style.width = '50px';
                facilityEl.style.height = '30px';
                facilityEl.style.border = '2px solid #333';
                facilityEl.style.backgroundColor = '#fff';
                facilityEl.style.display = 'flex';
                facilityEl.style.justifyContent = 'center';
                facilityEl.style.alignItems = 'center';
                facilityEl.style.fontSize = '10px';
                facilityEl.style.fontWeight = 'bold';
                facilityEl.style.color = '#333';
            }
            
            facilityEl.textContent = facility.label;
            container.appendChild(facilityEl);
        });
    }
    
    // 渲染氧源标识
    renderOxygenSources(container) {
        this.config.oxygenSources.forEach(oxygen => {
            const oxygenEl = document.createElement('div');
            oxygenEl.className = 'oxygen-source';
            oxygenEl.style.left = `${oxygen.position.x}px`;
            oxygenEl.style.top = `${oxygen.position.y}px`;
            oxygenEl.textContent = oxygen.symbol;
            container.appendChild(oxygenEl);
        });
    }
    
    // 渲染机械吊塔
    renderMechanicalTowers(container) {
        this.config.mechanicalTowers.forEach(tower => {
            const towerEl = document.createElement('div');
            towerEl.className = 'mechanical-tower';
            towerEl.style.left = `${tower.position.x}px`;
            towerEl.style.top = `${tower.position.y}px`;
            towerEl.style.width = '40px';
            towerEl.style.height = '20px';
            towerEl.style.backgroundColor = '#666';
            towerEl.style.color = 'white';
            towerEl.style.fontSize = '8px';
            towerEl.style.fontWeight = 'bold';
            towerEl.style.display = 'flex';
            towerEl.style.justifyContent = 'center';
            towerEl.style.alignItems = 'center';
            towerEl.style.border = '1px solid #333';
            towerEl.textContent = tower.label;
            container.appendChild(towerEl);
        });
    }
    
    // 渲染所有床位
    renderAllBeds(container) {
        const allBeds = this.getAllBeds();
        
        allBeds.forEach(bed => {
            const bedEl = document.createElement('div');
            bedEl.className = `bed ${bed.isAdditional ? 'additional' : ''}`;
            bedEl.id = `bed-${bed.id}`;
            bedEl.style.left = `${bed.position.x}px`;
            bedEl.style.top = `${bed.position.y}px`;
            bedEl.style.position = 'absolute';
            
            // 根据床位位置调整尺寸和旋转
            if (bed.rotation === 90) {
                // 横向床位
                bedEl.style.width = '40px';
                bedEl.style.height = '80px';
                bedEl.style.transform = `rotate(${bed.rotation}deg)`;
                bedEl.style.transformOrigin = 'center center';
            } else {
                // 竖向床位
                bedEl.style.width = '40px';
                bedEl.style.height = '80px';
                bedEl.style.transform = 'rotate(0deg)';
            }
            
            // 床位内容
            const bedData = this.bedData[bed.id] || {};
            const hasPatient = bedData.patientName && bedData.patientName.trim() !== '';
            
            let currentStatus = bedData.status || 'empty';
            
            // 数据一致性检查
            if (hasPatient && currentStatus === 'empty') {
                currentStatus = 'occupied';
                this.bedData[bed.id].status = 'occupied';
            } else if (!hasPatient && (currentStatus === 'occupied' || currentStatus === 'discharge_planned')) {
                currentStatus = 'empty';
                this.bedData[bed.id].status = 'empty';
            }
            
            bedEl.classList.add(currentStatus);
            
            // 如果是加床，添加特殊标识
            if (bed.isAdditional) {
                bedEl.classList.add('additional');
                bedEl.style.border = '2px dashed #52c41a';
                bedEl.style.backgroundColor = '#f6ffed';
            }
            
            bedEl.innerHTML = `
                <div class="bed-label">${bed.id}${bed.isAdditional ? ' (加床)' : ''}</div>
                <div class="patient-area">${hasPatient ? bedData.patientName : ''}</div>
            `;
            
            // 点击事件
            bedEl.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openBedModal(bed.id);
            });
            
            container.appendChild(bedEl);
        });
    }
    
    // 更新床位统计信息
    updateBedStatistics() {
        const totalBeds = this.getTotalBedCount();
        const occupiedBeds = this.getOccupiedBedCount();
        const emptyBeds = this.getEmptyBedCount();
        const additionalBeds = this.additionalBeds.length;
        
        // 更新页面显示
        const roomTitle = document.querySelector('.room-title');
        if (roomTitle) {
            const statisticsInfo = document.getElementById('bed-statistics') || document.createElement('div');
            statisticsInfo.id = 'bed-statistics';
            statisticsInfo.style.cssText = `
                margin-top: 10px;
                font-size: 14px;
                color: #666;
                text-align: center;
            `;
            
            statisticsInfo.innerHTML = `
                总床位: ${totalBeds}张 (原有: ${totalBeds - additionalBeds}张, 加床: ${additionalBeds}张) | 
                使用中: ${occupiedBeds}张 | 
                空床: ${emptyBeds}张
            `;
            
            if (!document.getElementById('bed-statistics')) {
                roomTitle.appendChild(statisticsInfo);
            }
        }
        
        // 更新首页显示（如果存在）
        this.updateMainPageBedCount();
    }
    
    // 更新首页床位数显示
    updateMainPageBedCount() {
        // 这个功能可以通过 postMessage 或者直接更新 localStorage 来实现
        const roomInfo = {
            roomId: 'room602',
            totalBeds: this.getTotalBedCount(),
            originalBeds: this.config.beds.length,
            additionalBeds: this.additionalBeds.length
        };
        
        localStorage.setItem('room602Info', JSON.stringify(roomInfo));
    }
}

// 全局变量
let room602Manager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 创建602室管理器
    room602Manager = new Room602Manager();
    room602Manager.render();
    
    // 绑定原有功能
    bindExistingFunctionality();
});

// 绑定原有功能
function bindExistingFunctionality() {
    // 绑定模态框事件处理程序（如果存在）
    const confirmBtn = document.getElementById('confirm-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    if (confirmBtn) confirmBtn.addEventListener('click', () => room602Manager.saveBedData());
    if (cancelBtn) cancelBtn.addEventListener('click', () => room602Manager.closeModal());
    if (clearBtn) clearBtn.addEventListener('click', () => room602Manager.clearBedData());
    
    // 加载上次保存的数据按钮
    const loadLastBtn = document.getElementById('load-last-btn');
    if (loadLastBtn) {
        loadLastBtn.addEventListener('click', function() {
            const savedData = localStorage.getItem('room602BedData');
            if (savedData) {
                room602Manager.bedData = JSON.parse(savedData);
                room602Manager.render();
                alert('已加载上次保存的床位数据');
            } else {
                alert('没有找到上次保存的数据');
            }
        });
    }
}

// 为了兼容现有代码，保留一些全局函数
function openBedModal(bedId) {
    if (room602Manager) {
        room602Manager.openBedModal(bedId);
    }
}

function renderRoom602() {
    if (room602Manager) {
        room602Manager.render();
    }
}

// 兼容现有的床位数据变量
let room602BedData = {};

// 监听房间管理器数据变化，同步到全局变量
function syncGlobalData() {
    if (room602Manager) {
        room602BedData = room602Manager.bedData;
    }
}

// 定时同步数据
setInterval(() => {
    if (room602Manager) {
        room602Manager.syncAllBedData();
        syncGlobalData();
    }
}, 30000); // 每30秒同步一次

// 导出管理器实例（用于调试）
window.room602Manager = room602Manager;
