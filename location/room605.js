// 605室床位布局配置
// 图片Y轴范围：0 到 -250 (主区域到隔离病房底部)
// HTML容器高度：400px
// 转换公式：htmlY = imageY * -1.6 (因为 imageY 是负数，乘 -1.6 后变为正数并缩放)
// HTML容器宽度：500px (X轴保持不变)
const room605Config = {
    canvasSize: { width: 500, height: 400 }, // 与HTML容器尺寸一致
    beds: [
        // 竖向床位 (rotation: 0)
        // Image (~20, -40). HTML: x=20, y=-40 * -1.6 = 64
        { id: "605-06", position: { x: 20, y: 64 }, rotation: 0, hasOxygen: true },
        // Image (~20, -90). HTML: x=20, y=-90 * -1.6 = 144
        { id: "605-07", position: { x: 20, y: 144 }, rotation: 0, hasOxygen: true },
        // Image (~290, -30). HTML: x=290, y=-30 * -1.6 = 48
        { id: "605-05", position: { x: 290, y: 48 }, rotation: 0, hasOxygen: true },
        // Image (~400, -40). HTML: x=400, y=-40 * -1.6 = 64
        { id: "605-03", position: { x: 400, y: 64 }, rotation: 0, hasOxygen: true },
        // Image (~400, -100). HTML: x=400, y=-100 * -1.6 = 160
        { id: "605-02", position: { x: 400, y: 160 }, rotation: 0, hasOxygen: true },
        
        // 横向床位 (rotation: 90)
        // Image (~350, -180). HTML: x=350, y=-180 * -1.6 = 288
        { id: "605-01", position: { x: 350, y: 288 }, rotation: 90, hasOxygen: false }
    ],
    facilities: [
        // 库房1 (Warehouse 1): Image (~0, -150) to (~200, -200). HTML: x=0, y=240, w=200, h=80
        { type: "warehouse", label: "库房1", position: { x: 0, y: 240 }, width: 200, height: 80 },
        // 感应门 (Induction Door): Image (~210, -190). HTML: x=210, y=304
        { type: "induction_door", label: "感应门", position: { x: 210, y: 360 }, width: 60, height: 40 },
        // 感应门 (Induction Door): Image (~270, -190). HTML: x=270, y=304
        { type: "induction_door", label: "感应门", position: { x: 270, y: 304 }, width: 60, height: 40 },
        // 主门 (Main Door)
        { type: "induction_door", label: "门", position: { x: 0, y: 100 }, width: 60, height: 40 },
        // 电脑 (Computer): Image (~420, -190). HTML: x=420, y=304
        { type: "computer", label: "电脑", position: { x: 420, y: 304 } },
        // 洗手池 (Washbasin): Image (~480, -160). HTML: x=480, y=256
        { type: "washbasin", label: "洗手池", position: { x: 480, y: 256 } },
        
        // 无名矩形结构/隔断 (Structures):
        // Image (~200, -30) to (~250, -60). HTML: x=200, y=48, w=50, h=48
        { type: "structure", label: "结构", position: { x: 200, y: 48 }, width: 50, height: 48 },
        // Image (~260, -30) to (~310, -60). HTML: x=260, y=48, w=50, h=48
        { type: "structure", label: "结构", position: { x: 260, y: 48 }, width: 50, height: 48 },

        // 隔离病房 (Isolation Wards):
        // Image (~100, -240). HTML: x=100, y=384, w=100, h=30
        { type: "isolation_ward", label: "隔离病房1", position: { x: 100, y: 400 }, width: 100, height: 30 },
        // Image (~300, -240). HTML: x=300, y=384, w=100, h=30
        { type: "isolation_ward", label: "隔离病房2", position: { x: 300, y: 400 }, width: 100, height: 30 }
    ],
    // 氧源接口位置 (◉)
    oxygenSources: [
        // Near 605-06: Image (~0, -10). HTML: x=0, y=16
        { position: { x: 0, y: 16 }, symbol: "◉" },
        // Near 605-07: Image (~0, -70). HTML: x=0, y=112
        { position: { x: 0, y: 112 }, symbol: "◉" },
        // Near 605-05: Image (~340, -10). HTML: x=340, y=16
        { position: { x: 340, y: 16 }, symbol: "◉" },
        // Near 605-03: Image (~470, -60). HTML: x=470, y=96
        { position: { x: 470, y: 96 }, symbol: "◉" },
        // Near 605-02: Image (~470, -130). HTML: x=470, y=208
        { position: { x: 470, y: 208 }, symbol: "◉" }
    ],
    // 机械吊塔位置
    mechanicalTowers: [
        // Near 605-06: Image (~70, -20). HTML: x=70, y=32
        { position: { x: 70, y: 32 }, label: "机械吊塔" },
        // Near 605-07: Image (~70, -120). HTML: x=70, y=192
        { position: { x: 70, y: 192 }, label: "机械吊塔" },
        // Near 605-05: Image (~300, -20). HTML: x=300, y=32
        { position: { x: 300, y: 32 }, label: "机械吊塔" },
        // Near 605-03: Image (~400, -80). HTML: x=400, y=128
        { position: { x: 400, y: 128 }, label: "机械吊塔" },
        // Near 605-02: Image (~400, -140). HTML: x=400, y=224
        { position: { x: 400, y: 224 }, label: "机械吊塔" }
    ]
};

// 床位数据状态 (与room602.js相同)
let room605BedData = {};

// 初始化床位数据
function initRoom605BedData() {
    room605Config.beds.forEach(bed => {
        room605BedData[bed.id] = {
            patientName: '',
            status: 'empty',
            remarks: ''
        };
    });
}

// 渲染605室布局 (与room603.js渲染逻辑相同，只是引用不同的config)
function renderRoom605() {
    const container = document.getElementById('room605-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // 渲染设施
    room605Config.facilities.forEach(facility => {
        const facilityEl = document.createElement('div');
        facilityEl.className = `facility ${facility.type}`;
        facilityEl.style.left = `${facility.position.x}px`;
        facilityEl.style.top = `${facility.position.y}px`;
        
        // 特殊处理需要设置宽度/高度的设施类型
        if (facility.type === 'warehouse' || facility.type === 'structure' || facility.type === 'isolation_ward') {
            facilityEl.style.width = `${facility.width}px`;
            facilityEl.style.height = `${facility.height}px`;
        }
        // induction_door 和 washbasin 的尺寸已在CSS中定义
        
        facilityEl.textContent = facility.label;
        container.appendChild(facilityEl);
    });
    
    // 渲染氧源标识
    room605Config.oxygenSources.forEach(oxygen => {
        const oxygenEl = document.createElement('div');
        oxygenEl.className = 'oxygen-source';
        oxygenEl.style.left = `${oxygen.position.x}px`;
        oxygenEl.style.top = `${oxygen.position.y}px`;
        oxygenEl.textContent = oxygen.symbol;
        container.appendChild(oxygenEl);
    });
    
    // 渲染机械吊塔 (样式与room602.js保持一致，直接在JS中设置)
    room605Config.mechanicalTowers.forEach(tower => {
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
    room605Config.beds.forEach(bed => {
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
        bedEl.classList.add(`bed-${room605BedData[bed.id].status}`);
        
        // 床位内容
        bedEl.innerHTML = `
            <div class="bed-label">${bed.id}</div>
            <div class="patient-area">${room605BedData[bed.id].patientName}</div>
        `;
        
        // 点击事件
        bedEl.addEventListener('click', () => openBedModal(bed.id));
        
        container.appendChild(bedEl);
    });
}

// 初始化床位数据
initRoom605BedData();
