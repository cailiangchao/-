// 607室床位布局配置 - 根据图片精准还原并进行坐标转换
// 图片坐标系：X [0, ~1050], Y [0, ~-550] (Y负数向下)
// HTML画布：X [0, 1000], Y [0, 500] (Y正数向下)

const IMAGE_MAX_X = 1050; // 根据图片X轴最右侧大致估算
const IMAGE_MAX_Y_ABS = 550; // 根据图片Y轴最下侧走廊文字大致估算

const CANVAS_WIDTH = 1000; // 更新画布宽度
const CANVAS_HEIGHT = 500;   // 更新画布高度

const SCALE_X = CANVAS_WIDTH / IMAGE_MAX_X; // 1000 / 1050 ≈ 0.95238
const SCALE_Y = CANVAS_HEIGHT / IMAGE_MAX_Y_ABS; // 500 / 550 ≈ 0.90909

// 辅助函数，将图片坐标转换为HTML坐标
function mapX(imageX) {
    return imageX * SCALE_X;
}

function mapY(imageY) {
    // imageY是负数向下，乘以-1使其变为正数，然后缩放
    return imageY * -1 * SCALE_Y;
}

// 定义床位的默认尺寸（未旋转时）
// 这些尺寸在CSS中已设置，并根据新的缩放比例进行了调整
const DEFAULT_BED_WIDTH_HTML = 38; 
const DEFAULT_BED_HEIGHT_HTML = 73; 

const room607Config = {
    canvasSize: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
    beds: [
        // 第一排床位 (Y约-50)
        { id: "607-01", position: { x: mapX(150), y: mapY(-0) }, rotation: 0, hasOxygen: false }, // 01-11是白色床位
        { id: "607-02", position: { x: mapX(210), y: mapY(-0) }, rotation: 0, hasOxygen: false },
        { id: "607-03", position: { x: mapX(270), y: mapY(-0) }, rotation: 0, hasOxygen: false },
        { id: "607-05", position: { x: mapX(330), y: mapY(-0) }, rotation: 0, hasOxygen: false },
        { id: "607-06", position: { x: mapX(390), y: mapY(-0) }, rotation: 0, hasOxygen: false },
        { id: "607-07", position: { x: mapX(450), y: mapY(-0) }, rotation: 0, hasOxygen: false },
        { id: "607-08", position: { x: mapX(510), y: mapY(-0) }, rotation: 0, hasOxygen: false },
        { id: "607-09", position: { x: mapX(570), y: mapY(-0) }, rotation: 0, hasOxygen: false },
        { id: "607-10", position: { x: mapX(630), y: mapY(-0) }, rotation: 0, hasOxygen: false },
        { id: "607-11", position: { x: mapX(690), y: mapY(-0) }, rotation: 0, hasOxygen: false },
        { id: "607-12", position: { x: mapX(840), y: mapY(-0) }, rotation: 0, hasOxygen: false, type: 'infection-bed' }, // 12,13是黄色床位
        { id: "607-13", position: { x: mapX(900), y: mapY(-0) }, rotation: 0, hasOxygen: false, type: 'infection-bed' },

        // 第二排床位 (Y约-170)
        { id: "607-15", position: { x: mapX(150), y: mapY(-170) }, rotation: 0, hasOxygen: false },
        { id: "607-16", position: { x: mapX(210), y: mapY(-170) }, rotation: 0, hasOxygen: false },
        { id: "607-17", position: { x: mapX(270), y: mapY(-170) }, rotation: 0, hasOxygen: false },
        { id: "607-18", position: { x: mapX(330), y: mapY(-170) }, rotation: 0, hasOxygen: false },
        { id: "607-19", position: { x: mapX(450), y: mapY(-170) }, rotation: 0, hasOxygen: false },
        { id: "607-20", position: { x: mapX(510), y: mapY(-170) }, rotation: 0, hasOxygen: false },
        { id: "607-21", position: { x: mapX(570), y: mapY(-170) }, rotation: 0, hasOxygen: false },
        { id: "607-22", position: { x: mapX(630), y: mapY(-170) }, rotation: 0, hasOxygen: false },
        { id: "607-23", position: { x: mapX(690), y: mapY(-170) }, rotation: 0, hasOxygen: false },
        { id: "607-25", position: { x: mapX(840), y: mapY(-170) }, rotation: 0, hasOxygen: false, type: 'infection-bed' }, // 25,26是黄色床位
        { id: "607-26", position: { x: mapX(900), y: mapY(-170) }, rotation: 0, hasOxygen: false, type: 'infection-bed' },

        // 第三排床位 (Y约-320)
        { id: "607-45", position: { x: mapX(150), y: mapY(-320) }, rotation: 0, hasOxygen: false },
        { id: "607-27", position: { x: mapX(400), y: mapY(-320) }, rotation: 0, hasOxygen: true }, // 607-27有氧源
        { id: "607-28", position: { x: mapX(460), y: mapY(-320) }, rotation: 0, hasOxygen: false },
        { id: "607-29", position: { x: mapX(550), y: mapY(-320) }, rotation: 0, hasOxygen: true }, // 607-29有氧源
        { id: "607-30", position: { x: mapX(610), y: mapY(-320) }, rotation: 0, hasOxygen: false },
        { id: "607-33", position: { x: mapX(700), y: mapY(-320) }, rotation: 0, hasOxygen: false, type: 'infection-bed' }, // 33,35,38,39是黄色床位
        { id: "607-35", position: { x: mapX(760), y: mapY(-320) }, rotation: 0, hasOxygen: false, type: 'infection-bed' },
        { id: "607-38", position: { x: mapX(850), y: mapY(-320) }, rotation: 0, hasOxygen: false, type: 'infection-bed' },
        { id: "607-39", position: { x: mapX(910), y: mapY(-320) }, rotation: 0, hasOxygen: false, type: 'infection-bed' },

        // 第四排床位 (Y约-420)
        { id: "607-42", position: { x: mapX(150), y: mapY(-470) }, rotation: 0, hasOxygen: false },
        { id: "607-43", position: { x: mapX(210), y: mapY(-470) }, rotation: 0, hasOxygen: false },
        { id: "607-32", position: { x: mapX(540), y: mapY(-470) }, rotation: 0, hasOxygen: true }, // 607-32有氧源
        { id: "607-31", position: { x: mapX(600), y: mapY(-470) }, rotation: 0, hasOxygen: false },
        { id: "607-36", position: { x: mapX(690), y: mapY(-470) }, rotation: 0, hasOxygen: false, type: 'infection-bed' }, // 36,37,40,41是黄色床位
        { id: "607-37", position: { x: mapX(750), y: mapY(-470) }, rotation: 0, hasOxygen: false, type: 'infection-bed' },
        { id: "607-40", position: { x: mapX(870), y: mapY(-470) }, rotation: 0, hasOxygen: false, type: 'infection-bed' },
        { id: "607-41", position: { x: mapX(930), y: mapY(-470) }, rotation: 0, hasOxygen: false, type: 'infection-bed' }
    ],
    facilities: [
        // 左侧区域
        { type: "wall", label: "墙体", position: { x: mapX(0), y: mapY(0) }, width: mapX(100), height: mapY(150) },
        { type: "cabinet", label: "柜子", position: { x: mapX(100), y: mapY(0) }, width: mapX(40), height: mapY(150) },
        { type: "bed-side-xray-machine", label: "床边拍片机", position: { x: mapX(0), y: mapY(-150) }, width: mapX(60), height: mapY(100) },
        { type: "small-bed-collection-area", label: "小床集中放置处", position: { x: mapX(0), y: mapY(-300) }, width: mapX(60), height: mapY(100) },
        
        // 设备带 (Equipment Belts)
        
        { type: "equipment-belt", label: "设备带", position: { x: mapX(130), y: mapY(-300) }, width: mapX(370), height: mapY(20) },
        { type: "equipment-belt", label: "设备带", position: { x: mapX(530), y: mapY(-300) }, width: mapX(200), height: mapY(20) },
        { type: "equipment-belt", label: "设备带", position: { x: mapX(830), y: mapY(-300) }, width: mapX(150), height: mapY(20) },

        // 中间墙体和电脑
        { type: "wall textured", label: "墙体", position: { x: mapX(250), y: mapY(-350) }, width: mapX(100), height: mapY(100) },
        { type: "computer", label: "电脑", position: { x: mapX(650), y: mapY(-290) }, width: mapX(50), height: mapY(20) },
        { type: "wall textured", label: "墙体", position: { x: mapX(650), y: mapY(-350) }, width: mapX(100), height: mapY(100) },
        { type: "cabinet", label: "柜子", position: { x: mapX(500), y: mapY(-450) }, width: mapX(50), height: mapY(30) },

        // 顶部门
        { type: "door", label: "门", position: { x: mapX(110), y: mapY(-525) }, width: mapX(40), height: mapY(30) },
        { type: "door", label: "门", position: { x: mapX(820), y: mapY(-525) }, width: mapX(40), height: mapY(30) },
        

        // 区域标签
        { type: "area-label", label: "B 区", position: { x: mapX(450), y: mapY(-100) }, width: mapX(60), height: mapY(30) },
        { type: "area-label", label: "C 区", position: { x: mapX(850), y: mapY(-100) }, width: mapX(60), height: mapY(30) },
        { type: "area-label", label: "A 区", position: { x: mapX(450), y: mapY(-370) }, width: mapX(60), height: mapY(30) },
        { type: "area-label", label: "C 区", position: { x: mapX(850), y: mapY(-370) }, width: mapX(60), height: mapY(30) },
        { type: "infection-zone", label: "感染病区 (12张床)", position: { x: mapX(750), y: mapY(-400) }, width: mapX(200), height: mapY(50) }
    ],
    // 氧源接口位置 (●)
    oxygenSources: [
      

        // 第三排床位
        { position: { x: mapX(180), y: mapY(-370) }, symbol: "●" },
        { position: { x: mapX(430), y: mapY(-340) }, symbol: "●" }, // 607-27
        { position: { x: mapX(580), y: mapY(-340) }, symbol: "●" }, // 607-29
        { position: { x: mapX(730), y: mapY(-370) }, symbol: "●" },
        { position: { x: mapX(790), y: mapY(-370) }, symbol: "●" },
        { position: { x: mapX(880), y: mapY(-370) }, symbol: "●" },
        { position: { x: mapX(940), y: mapY(-370) }, symbol: "●" },

        // 第四排床位
        { position: { x: mapX(630), y: mapY(-450) }, symbol: "●" }, // 607-32
        { position: { x: mapX(780), y: mapY(-470) }, symbol: "●" },
        { position: { x: mapX(840), y: mapY(-470) }, symbol: "●" },
        { position: { x: mapX(900), y: mapY(-470) }, symbol: "●" },
        { position: { x: mapX(960), y: mapY(-470) }, symbol: "●" }
    ],
    // 机械吊塔位置
    mechanicalTowers: []
};

// 床位数据状态 (与room602.js相同)
let room607BedData = {};

// 初始化床位数据
function initRoom607BedData() {
    room607Config.beds.forEach(bed => {
        room607BedData[bed.id] = {
            patientName: '',
            status: 'empty',
            remarks: ''
        };
    });
}

// 渲染607室布局
function renderRoom607() {
    const container = document.getElementById('room607-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // 渲染设施
    room607Config.facilities.forEach(facility => {
        const facilityEl = document.createElement('div');
        facilityEl.className = `facility ${facility.type}`;
        facilityEl.style.left = `${facility.position.x}px`;
        facilityEl.style.top = `${facility.position.y}px`;
        
        // 特殊处理需要设置宽度/高度的设施类型
        if (facility.width) { 
            facilityEl.style.width = `${facility.width}px`;
        }
        if (facility.height) { 
            facilityEl.style.height = `${facility.height}px`;
        }
        
        // 允许文本换行
        if (facility.label.includes('\n')) {
             facilityEl.style.whiteSpace = 'pre-wrap';
        }

        facilityEl.textContent = facility.label;
        container.appendChild(facilityEl);
    });
    
    // 渲染氧源标识
    room607Config.oxygenSources.forEach(oxygen => {
        const oxygenEl = document.createElement('div');
        oxygenEl.className = 'oxygen-source';
        oxygenEl.style.left = `${oxygen.position.x}px`;
        oxygenEl.style.top = `${oxygen.position.y}px`;
        oxygenEl.textContent = oxygen.symbol;
        container.appendChild(oxygenEl);
    });
    
    // 渲染机械吊塔 (样式已在CSS中定义，这里设置位置)
    room607Config.mechanicalTowers.forEach(tower => {
        const towerEl = document.createElement('div');
        towerEl.className = 'mechanical-tower';
        towerEl.style.left = `${tower.position.x}px`;
        towerEl.style.top = `${tower.position.y}px`;
        towerEl.textContent = tower.label;
        container.appendChild(towerEl);
    });
    
    // 渲染床位 (渲染逻辑与room602.js一致，但床位尺寸已在CSS和DEFAULT_BED_WIDTH_HTML/HEIGHT_HTML中调整)
    room607Config.beds.forEach(bed => {
        const bedEl = document.createElement('div');
        bedEl.className = 'bed';
        bedEl.id = `bed-${bed.id}`;
        bedEl.style.left = `${bed.position.x}px`;
        bedEl.style.top = `${bed.position.y}px`;
        
        // 设置床位实际尺寸
        bedEl.style.width = `${DEFAULT_BED_WIDTH_HTML}px`;
        bedEl.style.height = `${DEFAULT_BED_HEIGHT_HTML}px`;

        // 根据旋转调整床位显示
        bedEl.style.transform = `rotate(${bed.rotation}deg)`;
        bedEl.style.transformOrigin = 'center center';
        
        // 添加床位状态类
        bedEl.classList.add(`bed-${room607BedData[bed.id].status}`);

        // 为感染病区床位添加特定样式
        if (bed.type === 'infection-bed') {
            bedEl.classList.add('infection-bed');
        }
        
        // 床位内容
        bedEl.innerHTML = `
            <div class="bed-label">${bed.id}</div>
            <div class="patient-area">${room607BedData[bed.id].patientName}</div>
        `;
        
        // 点击事件
        bedEl.addEventListener('click', () => openBedModal(bed.id));
        
        container.appendChild(bedEl);
    });
}

// 创建床位编辑模态框
function createBedModal() {
    const modal = document.createElement('div');
    modal.id = 'bed-modal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <h3>床位信息 - <span id="modal-bed-id"></span></h3>
            <div class="form-group">
                <label for="patient-name">患者床号:</label>
                <input type="text" id="patient-name" placeholder="输入患者床号">
            </div>
            <div class="form-group">
                <label for="bed-status">床位状态:</label>
                <select id="bed-status">
                    <option value="empty">空床</option>
                    <option value="occupied">占用</option>
                    <option value="discharge_planned">拟出院</option>
                </select>
            </div>
            <div class="form-group">
                <label for="bed-remarks">备注:</label>
                <textarea id="bed-remarks" rows="3"></textarea>
            </div>
            <div class="modal-buttons">
                <button id="clear-btn">清空</button>
                <button id="cancel-btn">取消</button>
                <button id="confirm-btn">确认</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    return modal;
}

// 床位编辑模态框功能
function openBedModal(bedId) {
    let modal = document.getElementById('bed-modal');
    if (!modal) {
        modal = createBedModal();
    }
    
    document.getElementById('modal-bed-id').textContent = bedId;
    
    // 填充现有数据
    const bed = room607BedData[bedId] || { patientName: '', status: 'empty', remarks: '' };
    document.getElementById('patient-name').value = bed.patientName || '';
    document.getElementById('bed-status').value = bed.status || 'empty';
    document.getElementById('bed-remarks').value = bed.remarks || '';
    
    modal.style.display = 'block';
    
    // 绑定按钮事件
    document.getElementById('confirm-btn').onclick = saveBedData;
    document.getElementById('cancel-btn').onclick = closeModal;
    document.getElementById('clear-btn').onclick = clearBedData;
}

// 保存床位数据
function saveBedData() {
    const bedId = document.getElementById('modal-bed-id').textContent;
    room607BedData[bedId] = {
        patientName: document.getElementById('patient-name').value,
        status: document.getElementById('bed-status').value,
        remarks: document.getElementById('bed-remarks').value
    };
    
    // 保存数据到本地存储
    localStorage.setItem('room607BedData', JSON.stringify(room607BedData));
    
    closeModal();
    renderRoom607(); // 重新渲染以更新显示
}

// 关闭模态框
function closeModal() {
    document.getElementById('bed-modal').style.display = 'none';
}

// 清空床位数据
function clearBedData() {
    const bedId = document.getElementById('modal-bed-id').textContent;
    room607BedData[bedId] = {
        patientName: '',
        status: 'empty',
        remarks: ''
    };
    
    // 保存数据到本地存储
    localStorage.setItem('room607BedData', JSON.stringify(room607BedData));
    
    closeModal();
    renderRoom607(); // 重新渲染以更新显示
}

// 初始化床位数据
initRoom607BedData();
