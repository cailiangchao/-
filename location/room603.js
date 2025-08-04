// 603室床位布局配置 - 根据图片精准还原并进行坐标转换
const room603Config = {
    canvasSize: { width: 500, height: 400 }, // 与HTML容器尺寸一致
    beds: [
        // 竖向床位 (rotation: 0)
        { id: "603-06", position: { x: 70, y: 96 }, rotation: 0, hasOxygen: true },
        { id: "603-07", position: { x: 70, y: 224 }, rotation: 0, hasOxygen: true },
        { id: "603-05", position: { x: 300, y: 64 }, rotation: 0, hasOxygen: true },
        { id: "603-03", position: { x: 400, y: 112 }, rotation: 0, hasOxygen: true },
        { id: "603-02", position: { x: 400, y: 240 }, rotation: 0, hasOxygen: true },
        
        // 横向床位 (rotation: 90)
        { id: "603-01", position: { x: 340, y: 368 }, rotation: 90, hasOxygen: false }
    ],
    facilities: [
        { type: "warehouse", label: "库房2", position: { x: 0, y: 320 }, width: 280, height: 56 },
        { type: "induction_door", label: "感应门", position: { x: 210, y: 360 }, width: 60, height: 40 },
        { type: "induction_door", label: "感应门", position: { x: 290, y: 384 }, width: 60, height: 40 },
        { type: "induction_door", label: "门", position: { x: 0, y: 100 }, width: 60, height: 40 },
        { type: "computer", label: "电脑", position: { x: 450, y: 384 } },
        // 无名矩形结构/隔断
        { type: "structure", label: "结构", position: { x: 190, y: 112 }, width: 60, height: 128 },
        { type: "structure", label: "结构", position: { x: 260, y: 112 }, width: 60, height: 128 }
    ],
    // 氧源接口位置 (◉)
    oxygenSources: [
        { position: { x: 100, y: 16 }, symbol: "◉" }, // 靠近603-06
        { position: { x: 100, y: 160 }, symbol: "◉" }, // 靠近603-07
        { position: { x: 340, y: 32 }, symbol: "◉" }, // 靠近603-05
        { position: { x: 440, y: 32 }, symbol: "◉" }, // 靠近603-03
        { position: { x: 440, y: 160 }, symbol: "◉" }  // 靠近603-02
    ],
    // 机械吊塔位置
    mechanicalTowers: [
        { position: { x: 70, y: 48 }, label: "机械吊塔" },   // 603-06 左
        { position: { x: 130, y: 64 }, label: "机械吊塔" },   // 603-06 右
        { position: { x: 70, y: 176 }, label: "机械吊塔" },  // 603-07 左
        { position: { x: 130, y: 192 }, label: "机械吊塔" },  // 603-07 右
        { position: { x: 270, y: 80 }, label: "机械吊塔" },  // 603-05 左
        { position: { x: 330, y: 80 }, label: "机械吊塔" },  // 603-05 右
        { position: { x: 370, y: 128 }, label: "机械吊塔" }, // 603-03 左
        { position: { x: 430, y: 128 }, label: "机械吊塔" }, // 603-03 右
        { position: { x: 370, y: 256 }, label: "机械吊塔" }, // 603-02 左
        { position: { x: 430, y: 256 }, label: "机械吊塔" }  // 603-02 右
    ]
};

// 床位数据状态 (与room602.js相同)
let room603BedData = {};

// 初始化床位数据
function initRoom603BedData() {
    room603Config.beds.forEach(bed => {
        room603BedData[bed.id] = {
            patientName: '',
            status: 'empty',
            remarks: ''
        };
    });
}

// 渲染603室布局
function renderRoom603() {
    const container = document.getElementById('room603-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // 渲染设施
    room603Config.facilities.forEach(facility => {
        const facilityEl = document.createElement('div');
        facilityEl.className = `facility ${facility.type}`;
        facilityEl.style.left = `${facility.position.x}px`;
        facilityEl.style.top = `${facility.position.y}px`;
        
        // 特殊处理需要设置宽度/高度的设施类型
        if (facility.type === 'warehouse' || facility.type === 'structure') {
            facilityEl.style.width = `${facility.width}px`;
            facilityEl.style.height = `${facility.height}px`;
        }
        // induction_door 和 washbasin 的尺寸已在CSS中定义
        
        facilityEl.textContent = facility.label;
        container.appendChild(facilityEl);
    });
    
    // 渲染氧源标识
    room603Config.oxygenSources.forEach(oxygen => {
        const oxygenEl = document.createElement('div');
        oxygenEl.className = 'oxygen-source';
        oxygenEl.style.left = `${oxygen.position.x}px`;
        oxygenEl.style.top = `${oxygen.position.y}px`;
        oxygenEl.textContent = oxygen.symbol;
        container.appendChild(oxygenEl);
    });
    
    // 渲染机械吊塔 (样式与room602.js保持一致，直接在JS中设置)
    room603Config.mechanicalTowers.forEach(tower => {
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
    
    // 渲染床位 (渲染逻辑与room602.js完全一致)
    room603Config.beds.forEach(bed => {
        const bedEl = document.createElement('div');
        bedEl.className = 'bed';
        bedEl.id = `bed-${bed.id}`;
        bedEl.style.left = `${bed.position.x}px`;
        bedEl.style.top = `${bed.position.y}px`;
        
        // 无论旋转与否，床位的基础尺寸都设定为40px宽，80px高（即竖向时）
        // 旋转会将其视觉上变为横向（80px宽，40px高）
        bedEl.style.width = '40px';
        bedEl.style.height = '80px';
        bedEl.style.transform = `rotate(${bed.rotation}deg)`;
        bedEl.style.transformOrigin = 'center center'; // 旋转中心保持在元素中心
        
        // 添加床位状态类
        bedEl.classList.add(`bed-${room603BedData[bed.id].status}`);
        
        // 床位内容
        bedEl.innerHTML = `
            <div class="bed-label">${bed.id}</div>
            <div class="patient-area">${room603BedData[bed.id].patientName}</div>
        `;
        
        // 点击事件
        bedEl.addEventListener('click', () => openBedModal(bed.id));
        
        container.appendChild(bedEl);
    });
}

// 初始化床位数据
initRoom603BedData();
