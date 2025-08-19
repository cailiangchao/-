// 601室增强版 - 继承BedManager，添加加床功能
class Room601Manager extends BedManager {
    constructor() {
        super('room601', room601Config);
    }
    
    // 重写渲染方法
    render() {
        const container = document.getElementById('room601-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        // 获取是否显示边界框
        const showBoundaries = window.showElementBoundaries || false;
        
        // 渲染设施
        this.config.facilities.forEach(facility => {
            const facilityEl = document.createElement('div');
            facilityEl.className = `facility ${facility.type}`;
            facilityEl.style.left = `${facility.position.x}px`;
            facilityEl.style.top = `${facility.position.y}px`;
            facilityEl.style.position = 'absolute';
            
            // 调试模式：添加位置标识
            if (showBoundaries) {
                facilityEl.style.boxShadow = '0 0 0 1px red';
                
                // 添加坐标显示
                const posText = document.createElement('div');
                posText.style.position = 'absolute';
                posText.style.top = '-15px';
                posText.style.left = '0';
                posText.style.fontSize = '9px';
                posText.style.color = 'red';
                posText.style.whiteSpace = 'nowrap';
                posText.textContent = `${facility.position.x},${facility.position.y}`;
                facilityEl.appendChild(posText);
            }
            
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
            
            // 特殊处理储物柜
            if (facility.type === 'cabinet') {
                facilityEl.style.width = `${facility.width}px`;
                facilityEl.style.height = `${facility.height}px`;
                facilityEl.style.border = '2px solid #666';
                facilityEl.style.backgroundColor = '#eaeaea';
                facilityEl.style.display = 'flex';
                facilityEl.style.justifyContent = 'center';
                facilityEl.style.alignItems = 'center';
                facilityEl.style.fontSize = '10px';
                facilityEl.style.fontWeight = 'bold';
                facilityEl.style.color = '#333';
                facilityEl.style.writingMode = 'vertical-rl';
                facilityEl.style.textOrientation = 'mixed';
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
            
            // 特殊处理洗手池
            if (facility.type === 'washbasin') {
                facilityEl.style.width = `${facility.width}px`;
                facilityEl.style.height = `${facility.height}px`;
                facilityEl.style.border = '2px solid #333';
                facilityEl.style.backgroundColor = '#ddf';
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
            
            // 调试模式：添加位置标识
            if (showBoundaries) {
                oxygenEl.style.outline = '1px solid blue';
                
                // 添加坐标显示
                const posText = document.createElement('div');
                posText.style.position = 'absolute';
                posText.style.bottom = '-15px';
                posText.style.left = '-5px';
                posText.style.fontSize = '9px';
                posText.style.color = 'blue';
                posText.style.whiteSpace = 'nowrap';
                posText.textContent = `${oxygen.position.x},${oxygen.position.y}`;
                oxygenEl.appendChild(posText);
            }
            
            container.appendChild(oxygenEl);
        });
        
        // 渲染机械吊塔
        this.config.mechanicalTowers.forEach(tower => {
            const towerEl = document.createElement('div');
            towerEl.className = 'mechanical-tower';
            towerEl.style.left = `${tower.position.x}px`;
            towerEl.style.top = `${tower.position.y}px`;
            towerEl.style.width = `${tower.width || 40}px`;
            towerEl.style.height = `${tower.height || 20}px`;
            towerEl.style.backgroundColor = '#666';
            towerEl.style.color = 'white';
            towerEl.style.fontSize = '8px';
            towerEl.style.fontWeight = 'bold';
            towerEl.style.display = 'flex';
            towerEl.style.justifyContent = 'center';
            towerEl.style.alignItems = 'center';
            towerEl.style.border = '1px solid #333';
            towerEl.style.transform = `rotate(${tower.rotation || 0}deg)`;
            towerEl.style.transformOrigin = 'center center';
            
            // 保持文字垂直显示
            const labelSpan = document.createElement('span');
            labelSpan.textContent = tower.label;
            labelSpan.style.transform = `rotate(${-1 * (tower.rotation || 0)}deg)`;
            labelSpan.style.display = 'inline-block';
            towerEl.appendChild(labelSpan);
            
            // 调试模式：添加位置标识
            if (showBoundaries) {
                towerEl.style.boxShadow = '0 0 0 1px yellow';
                
                // 添加坐标显示
                const posText = document.createElement('div');
                posText.style.position = 'absolute';
                posText.style.top = '-15px';
                posText.style.left = '0';
                posText.style.fontSize = '9px';
                posText.style.color = 'yellow';
                posText.style.backgroundColor = 'rgba(0,0,0,0.5)';
                posText.style.whiteSpace = 'nowrap';
                posText.textContent = `${tower.position.x},${tower.position.y}`;
                towerEl.appendChild(posText);
                
                // 添加尺寸显示
                const sizeText = document.createElement('div');
                sizeText.style.position = 'absolute';
                sizeText.style.bottom = '-15px';
                sizeText.style.right = '0';
                sizeText.style.fontSize = '9px';
                sizeText.style.color = 'yellow';
                sizeText.style.backgroundColor = 'rgba(0,0,0,0.5)';
                sizeText.style.whiteSpace = 'nowrap';
                sizeText.textContent = `${tower.width || 40}x${tower.height || 20}`;
                towerEl.appendChild(sizeText);
            }
            
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
            
            // 调试模式：添加位置标识
            if (showBoundaries) {
                bedEl.style.boxShadow = bed.isAdditional ? '0 0 0 1px orange' : '0 0 0 1px green';
                
                // 添加坐标和ID显示
                const posText = document.createElement('div');
                posText.style.position = 'absolute';
                posText.style.top = '-18px';
                posText.style.left = '0';
                posText.style.fontSize = '8px';
                posText.style.color = bed.isAdditional ? 'orange' : 'green';
                posText.style.whiteSpace = 'nowrap';
                posText.style.pointerEvents = 'none';
                posText.textContent = `${bed.id}: ${bed.position.x},${bed.position.y}`;
                bedEl.appendChild(posText);
            }
            
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
        
        // 显示调试模式信息
        const debugMode = window.showElementBoundaries ? ' [调试模式]' : '';
        
        // 显示加床信息
        const additionalBedCount = this.additionalBeds.length;
        const additionalBedInfo = additionalBedCount > 0 ? ` (含${additionalBedCount}张加床)` : '';
        
        titleEl.innerHTML = `
            <span id="current-date">${year}年${month}月${day}日</span>601室床位分布图${additionalBedInfo}, 
            总床位${totalBeds}张,
            病人总数<input type="number" id="patient-count" min="0" style="width:40px" value="${patientCountValue}">人,
            预出院<input type="number" id="discharge-count" min="0" style="width:40px; height: 25px;" value="${dischargeCountValue}">人
            ${debugMode ? `<span class="debug-mode">${debugMode}</span>` : ''}
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
                    localStorage.setItem('room601Counts', JSON.stringify(counts));
                });
            }
        });
        
        // 加载保存的计数值
        try {
            const savedCounts = localStorage.getItem('room601Counts');
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
let room601Manager = null;

// 初始化函数
function initRoom601Enhanced() {
    room601Manager = new Room601Manager();
    room601Manager.render();
}

// 兼容性函数 - 保持与原有代码的兼容
function renderRoom601() {
    if (room601Manager) {
        room601Manager.render();
    } else {
        initRoom601Enhanced();
    }
}

function openBedModal(bedId) {
    if (room601Manager) {
        room601Manager.openBedModal(bedId);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initRoom601Enhanced();
});
