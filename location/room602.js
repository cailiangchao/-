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
        { type: "induction_door", label: "感应门", position: { x: 300, y: 370 }, width: 60, height: 40 },
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
        
        // 添加床位状态类
        bedEl.classList.add(`bed-${room602BedData[bed.id].status}`);
        
        // 床位内容
        bedEl.innerHTML = `
            <div class="bed-label">${bed.id}</div>
            <div class="patient-area">${room602BedData[bed.id].patientName}</div>
        `;
        
        // 点击事件
        bedEl.addEventListener('click', () => openBedModal(bed.id));
        
        container.appendChild(bedEl);
    });
}

// 初始化
initRoom602BedData();
