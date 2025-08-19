// 603室增强版 - 继承BedManager，添加加床功能
class Room603Manager extends BedManager {
    constructor() {
        super('room603', room603Config);
        
        // 处理现有的"加床"，将其转换为additionalBeds
        this.migrateExistingAdditionalBeds();
    }
    
    // 迁移现有的加床数据
    migrateExistingAdditionalBeds() {
        const existingAdditionalBeds = this.config.beds.filter(bed => bed.id === "加床");
        if (existingAdditionalBeds.length > 0) {
            // 从原配置中移除加床
            this.config.beds = this.config.beds.filter(bed => bed.id !== "加床");
            
            // 重新编号并添加到additionalBeds中
            existingAdditionalBeds.forEach((bed, index) => {
                const newBedId = `${this.roomId}-ADD${index + 1}`;
                const newBed = {
                    ...bed,
                    id: newBedId,
                    isAdditional: true
                };
                this.additionalBeds.push(newBed);
                
                // 迁移床位数据
                if (this.bedData["加床"]) {
                    this.bedData[newBedId] = this.bedData["加床"];
                    delete this.bedData["加床"];
                }
            });
            
            this.saveData();
        }
    }
    
    // 重写渲染方法
    render() {
        const container = document.getElementById('room603-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        // 渲染设施
        this.config.facilities.forEach(facility => {
            const facilityEl = document.createElement('div');
            facilityEl.className = `facility ${facility.type}`;
            facilityEl.style.left = `${facility.position.x}px`;
            facilityEl.style.top = `${facility.position.y}px`;
            
            // 特殊处理需要设置宽度/高度的设施类型
            if (facility.type === 'warehouse' || facility.type === 'structure') {
                facilityEl.style.width = `${facility.width}px`;
                facilityEl.style.height = `${facility.height}px`;
            }
            
            // 特殊处理库房
            if (facility.type === 'warehouse') {
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
                facilityEl.style.width = `${facility.width}px`;
                facilityEl.style.height = `${facility.height}px`;
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
        
        // 渲染氧源标识
        this.config.oxygenSources.forEach(oxygen => {
            const oxygenEl = document.createElement('div');
            oxygenEl.className = 'oxygen-source';
            oxygenEl.style.left = `${oxygen.position.x}px`;
            oxygenEl.style.top = `${oxygen.position.y}px`;
            oxygenEl.textContent = oxygen.symbol;
            container.appendChild(oxygenEl);
        });
        
        // 渲染机械吊塔
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
        
        // 渲染所有床位（原有床位 + 加床）
        const allBeds = this.getAllBeds();
        allBeds.forEach(bed => {
            const bedEl = document.createElement('div');
            bedEl.className = 'bed';
            if (bed.isAdditional) {
                bedEl.classList.add('additional');
            }
            bedEl.id = `bed-${bed.id}`;
            bedEl.style.left = `${bed.position.x}px`;
            bedEl.style.top = `${bed.position.y}px`;
            
            // 床位尺寸和旋转
            bedEl.style.width = '40px';
            bedEl.style.height = '80px';
            bedEl.style.transform = `rotate(${bed.rotation}deg)`;
            bedEl.style.transformOrigin = 'center center';
            
            // 床位内容
            const bedData = this.bedData[bed.id] || {};
            const hasPatient = bedData.patientName && bedData.patientName.trim() !== '';
            
            // 使用保存的状态
            let currentStatus = bedData.status || 'empty';
            
            // 只有在数据不一致时才进行自动纠正
            if (hasPatient && currentStatus === 'empty') {
                currentStatus = 'occupied';
                this.bedData[bed.id].status = 'occupied';
            } else if (!hasPatient && (currentStatus === 'occupied' || currentStatus === 'discharge_planned')) {
                currentStatus = 'empty';
                this.bedData[bed.id].status = 'empty';
            }
            
            bedEl.classList.add(currentStatus);
            
            bedEl.innerHTML = `
                <div class="bed-label">${bed.id}</div>
                <div class="patient-area">${hasPatient ? bedData.patientName : ''}</div>
            `;
            
            // 点击事件
            bedEl.addEventListener('click', () => this.openBedModal(bed.id));
            
            container.appendChild(bedEl);
        });
        
        // 启用拖拽模式（仅对加床）
        this.enableDragMode();
        
        // 更新标题信息
        this.updateTitleInfo();
    }
    
    // 更新标题信息
    updateTitleInfo() {
        const titleEl = document.querySelector('.room-title');
        if (!titleEl) return;
        
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        
        // 保存用户输入的值
        const patientCountInput = document.getElementById('patient-count');
        const dischargeCountInput = document.getElementById('discharge-count');
        const patientCountValue = patientCountInput ? patientCountInput.value : '';
        const dischargeCountValue = dischargeCountInput ? dischargeCountInput.value : '';
        
        // 计算实际病人总数
        const actualPatientCount = this.getOccupiedBedCount();
        const totalBeds = this.getTotalBedCount();
        
        // 显示加床信息
        const additionalBedCount = this.additionalBeds.length;
        const additionalBedInfo = additionalBedCount > 0 ? ` (含${additionalBedCount}张加床)` : '';
        
        titleEl.innerHTML = `
            <span id="current-date">${year}年${month}月${day}日</span>603室床位分布图${additionalBedInfo}, 
            总床位${totalBeds}张,
            病人总数<input type="number" id="patient-count" min="0" style="width:40px" value="${patientCountValue}">人,
            预出院<input type="number" id="discharge-count" min="0" style="width:40px; height: 25px;" value="${dischargeCountValue}">人
        `;
        
        // 重新绑定事件监听器
        ['patient-count', 'discharge-count'].forEach(id => {
            const inputElement = document.getElementById(id);
            if (inputElement) {
                inputElement.addEventListener('change', function() {
                    const counts = {
                        patientCount: document.getElementById('patient-count').value,
                        dischargeCount: document.getElementById('discharge-count').value
                    };
                    localStorage.setItem('room603Counts', JSON.stringify(counts));
                });
            }
        });
        
        // 加载保存的计数值
        try {
            const savedCounts = localStorage.getItem('room603Counts');
            if (savedCounts) {
                const counts = JSON.parse(savedCounts);
                if (counts.patientCount !== undefined && patientCountInput) {
                    patientCountInput.value = counts.patientCount;
                }
                if (counts.dischargeCount !== undefined && dischargeCountInput) {
                    dischargeCountInput.value = counts.dischargeCount;
                }
            }
        } catch (error) {
            console.error('加载计数数据失败:', error);
        }
    }
}

// 创建全局实例
let room603Manager = null;

// 初始化函数
function initRoom603Enhanced() {
    room603Manager = new Room603Manager();
    room603Manager.render();
}

// 兼容性函数 - 保持与原有代码的兼容
function renderRoom603() {
    if (room603Manager) {
        room603Manager.render();
    } else {
        initRoom603Enhanced();
    }
}

function openBedModal(bedId) {
    if (room603Manager) {
        room603Manager.openBedModal(bedId);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initRoom603Enhanced();
});
