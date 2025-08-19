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

// 床位数据状态
let room602BedData = {};

// 初始化床位数据
function initRoom602BedData() {
    room602Config.beds.forEach(bed => {
        room602BedData[bed.id] = {
            patientName: '',
            status: 'empty',
            remarks: ''
        };
    });
}

// 渲染602室布局
function renderRoom602() {
    const container = document.getElementById('room602-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // 渲染设施
    room602Config.facilities.forEach(facility => {
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
    
    // 渲染氧源标识
    room602Config.oxygenSources.forEach(oxygen => {
        const oxygenEl = document.createElement('div');
        oxygenEl.className = 'oxygen-source';
        oxygenEl.style.left = `${oxygen.position.x}px`;
        oxygenEl.style.top = `${oxygen.position.y}px`;
        oxygenEl.textContent = oxygen.symbol;
        container.appendChild(oxygenEl);
    });
    
    // 渲染机械吊塔
    room602Config.mechanicalTowers.forEach(tower => {
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
    
    // 渲染床位
    room602Config.beds.forEach(bed => {
        const bedEl = document.createElement('div');
        bedEl.className = 'bed';
        bedEl.id = `bed-${bed.id}`;
        bedEl.style.left = `${bed.position.x}px`;
        bedEl.style.top = `${bed.position.y}px`;
        
        // 根据床位位置调整尺寸和旋转
        if (bed.rotation === 90) {
            // 横向床位
            bedEl.style.width = '40px';
            bedEl.style.height = '80px';
            bedEl.style.transform = `rotate(${bed.rotation}deg)`;
            // 横向床位的文本内容也需要旋转，使其保持水平
            bedEl.style.transformOrigin = 'center center';
        } else {
            // 竖向床位
            bedEl.style.width = '40px';
            bedEl.style.height = '80px';
            bedEl.style.transform = 'rotate(0deg)';
        }
        
        // 床位内容
        const bedData = room602BedData[bed.id] || {};
        const hasPatient = bedData.patientName && bedData.patientName.trim() !== '';
        
        // 修复：使用保存的状态，而不是重新判断
        let currentStatus = bedData.status || 'empty';

        // 只有在数据不一致时才进行自动纠正
        if (hasPatient && currentStatus === 'empty') {
            // 有患者但状态是空床，自动纠正为占用
            currentStatus = 'occupied';
            room602BedData[bed.id].status = 'occupied';  // 同步更新数据
        } else if (!hasPatient && (currentStatus === 'occupied' || currentStatus === 'discharge_planned')) {
            // 没有患者但状态不是空床，自动纠正为空床
            currentStatus = 'empty';
            room602BedData[bed.id].status = 'empty';  // 同步更新数据
        }

        bedEl.classList.add(currentStatus);

        bedEl.innerHTML = `
            <div class="bed-label">${bed.id}</div>
            <div class="patient-area">${hasPatient ? bedData.patientName : ''}</div>
        `;
        
        // 点击事件
        bedEl.addEventListener('click', () => openBedModal(bed.id));
        
        container.appendChild(bedEl);
    });
}

// 保留空行以保持代码结构

// 床位点击处理 - 直接输入模式，自动变更状态
function handleBedClick(bedId) {
    const bedEl = document.getElementById(`bed-${bedId}`);
    const patientArea = bedEl.querySelector('.patient-area');
    
    // 创建输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.value = room602BedData[bedId]?.patientName || '';
    input.style.width = '100%';
    input.style.height = '100%';
    input.style.border = 'none';
    input.style.outline = 'none';
    input.style.backgroundColor = 'transparent';
    input.style.textAlign = 'center';
    input.style.fontSize = '10px';
    input.placeholder = '输入床号';
    
    // 替换患者区域为输入框
    patientArea.innerHTML = '';
    patientArea.appendChild(input);
    input.focus();
    input.select();
    
    // 保存处理 - 自动变更状态
    const handleSave = () => {
        const patientName = input.value.trim();
        
        // 自动确定状态：有患者名称就是占用，没有就是空床
        const status = patientName ? 'occupied' : 'empty';
        
        room602BedData[bedId] = {
            patientName: patientName,
            status: status,
            remarks: room602BedData[bedId]?.remarks || ''
        };
        
        // 保存并重新渲染
        localStorage.setItem('room602BedData', JSON.stringify(room602BedData));
        renderRoom602();
    };
    
    // 回车保存
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
        if (e.key === 'Escape') {
            renderRoom602(); // 取消编辑
        }
    });
    
    // 失去焦点保存
    input.addEventListener('blur', handleSave);
}

// 保留空行以保持代码结构

// 数据验证函数
function validateBedData(bedId) {
    const bedData = room602BedData[bedId];
    if (!bedData) return false;
    
    const hasPatient = bedData.patientName && bedData.patientName.trim() !== '';
    const status = bedData.status;
    
    // 检查数据一致性
    if (hasPatient && status === 'empty') {
        console.warn(`床位 ${bedId} 数据不一致：有患者但状态为空床`);
        return false;
    }
    
    if (!hasPatient && status !== 'empty') {
        console.warn(`床位 ${bedId} 数据不一致：无患者但状态非空床`);
        return false;
    }
    
    return true;
}

// 定期数据同步
function syncAllBedData() {
    let hasChanges = false;
    
    Object.keys(room602BedData).forEach(bedId => {
        const bedData = room602BedData[bedId];
        const hasPatient = bedData.patientName && bedData.patientName.trim() !== '';
        
        if (hasPatient && bedData.status === 'empty') {
            room602BedData[bedId].status = 'occupied';
            hasChanges = true;
        } else if (!hasPatient && bedData.status !== 'empty') {
            room602BedData[bedId].status = 'empty';
            hasChanges = true;
        }
    });
    
    if (hasChanges) {
        localStorage.setItem('room602BedData', JSON.stringify(room602BedData));
        renderRoom602();
        console.log('数据已同步修复');
    }
}

// 初始化
initRoom602BedData();

// 页面加载完成后同步数据
document.addEventListener('DOMContentLoaded', function() {
    // 加载保存的数据
    const savedData = localStorage.getItem('room602BedData');
    if (savedData) {
        try {
            room602BedData = JSON.parse(savedData);
        } catch (error) {
            console.error('解析保存数据失败:', error);
            initRoom602BedData();
        }
    }
    
    // 同步数据一致性
    syncAllBedData();
    
    // 渲染页面
    renderRoom602();
});
