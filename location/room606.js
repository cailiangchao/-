// 606室床位布局配置 - 根据图片精准还原并进行坐标转换
// 图片坐标系：X [0, ~1100], Y [0, ~-550] (Y负数向下)
// HTML画布：X [0, 1000], Y [0, 500] (Y正数向下)

const IMAGE_MAX_X = 1080; // 从图片最右边柜子边缘估算
const IMAGE_MAX_Y_ABS = 550; // 从图片最下方网格线估算

const CANVAS_WIDTH = 1000; // 更新画布宽度
const CANVAS_HEIGHT = 500;   // 更新画布高度

const SCALE_X = CANVAS_WIDTH / IMAGE_MAX_X; // 1000 / 1080 ≈ 0.9259
const SCALE_Y = CANVAS_HEIGHT / IMAGE_MAX_Y_ABS; // 500 / 550 ≈ 0.9090

// 辅助函数，将图片坐标转换为HTML坐标
function mapX(imageX) {
    return imageX * SCALE_X;
}

function mapY(imageY) {
    // imageY是负数向下，乘以-1使其变为正数，然后缩放
    return imageY * -1 * SCALE_Y;
}

// 定义床位的默认尺寸（未旋转时）- 调整以适应新的画布尺寸，并保持与原图比例接近
// 原图床位宽约40单位，高约80单位。
// 新画布下，宽应为 40 * SCALE_X ≈ 37px，高应为 80 * SCALE_Y ≈ 72.7px。
// 为了视觉效果，我们设置一个接近的整数值
const DEFAULT_BED_WIDTH_HTML = 37; // CSS .bed width
const DEFAULT_BED_HEIGHT_HTML = 73; // CSS .bed height

const room606Config = {
    canvasSize: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
    beds: [
        // 第一排床位 (Y约-60)
        { id: "606-42", position: { x: mapX(65), y: mapY(-0) }, rotation: 0, hasOxygen: true },
        { id: "606-41", position: { x: mapX(125), y: mapY(-0) }, rotation: 0, hasOxygen: true },
        { id: "606-40", position: { x: mapX(185), y: mapY(-0) }, rotation: 0, hasOxygen: true },
        { id: "606-39", position: { x: mapX(245), y: mapY(-0) }, rotation: 0, hasOxygen: true },
        { id: "606-38", position: { x: mapX(305), y: mapY(-0) }, rotation: 0, hasOxygen: true },
        { id: "606-37", position: { x: mapX(365), y: mapY(-0) }, rotation: 0, hasOxygen: true },
        { id: "606-36", position: { x: mapX(425), y: mapY(-0) }, rotation: 0, hasOxygen: true },
        { id: "606-35", position: { x: mapX(485), y: mapY(-0) }, rotation: 0, hasOxygen: true },
        { id: "606-33", position: { x: mapX(545), y: mapY(-0) }, rotation: 0, hasOxygen: true },
        { id: "606-32", position: { x: mapX(650), y: mapY(-0) }, rotation: 0, hasOxygen: true },
        { id: "606-31", position: { x: mapX(710), y: mapY(-0) }, rotation: 0, hasOxygen: true },
        { id: "606-30", position: { x: mapX(770), y: mapY(-0) }, rotation: 0, hasOxygen: true },
        { id: "606-29", position: { x: mapX(830), y: mapY(-0) }, rotation: 0, hasOxygen: true },
        { id: "606-28", position: { x: mapX(890), y: mapY(-0) }, rotation: 0, hasOxygen: true },
        { id: "606-27", position: { x: mapX(950), y: mapY(-0) }, rotation: 0, hasOxygen: true },
        { id: "606-26", position: { x: mapX(1010), y: mapY(-0) }, rotation: 0, hasOxygen: true },

        // 第二排床位 (Y约-250)
        { id: "606-25", position: { x: mapX(70), y: mapY(-190) }, rotation: 0, hasOxygen: true },
        { id: "606-23", position: { x: mapX(130), y: mapY(-190) }, rotation: 0, hasOxygen: true },
        { id: "606-22", position: { x: mapX(210), y: mapY(-190) }, rotation: 0, hasOxygen: true },
        { id: "606-21", position: { x: mapX(300), y: mapY(-190) }, rotation: 0, hasOxygen: true },
        { id: "606-20", position: { x: mapX(360), y: mapY(-190) }, rotation: 0, hasOxygen: true },
        { id: "606-19", position: { x: mapX(440), y: mapY(-190) }, rotation: 0, hasOxygen: true },
        { id: "606-18", position: { x: mapX(500), y: mapY(-190) }, rotation: 0, hasOxygen: true },
        { id: "606-09", position: { x: mapX(650), y: mapY(-190) }, rotation: 0, hasOxygen: true },
        { id: "606-08", position: { x: mapX(710), y: mapY(-190) }, rotation: 0, hasOxygen: true },
        { id: "606-07", position: { x: mapX(770), y: mapY(-190) }, rotation: 0, hasOxygen: true },
        { id: "606-06", position: { x: mapX(830), y: mapY(-190) }, rotation: 0, hasOxygen: true },
        { id: "606-05", position: { x: mapX(950), y: mapY(-190) }, rotation: 0, hasOxygen: true },
        { id: "606-03", position: { x: mapX(1030), y: mapY(-190) }, rotation: 0, hasOxygen: true },

        
        { id: "606-45", position: { x: mapX(130), y: mapY(-290) }, rotation: 0, hasOxygen: true },
        { id: "606-43", position: { x: mapX(210), y: mapY(-272) }, rotation: 90, hasOxygen: true }, // Horizontal in image, but label is vertical
        { id: "606-10", position: { x: mapX(650), y: mapY(-290) }, rotation: 0, hasOxygen: true },
        { id: "606-11", position: { x: mapX(710), y: mapY(-290) }, rotation: 0, hasOxygen: true },
        { id: "606-17", position: { x: mapX(470), y: mapY(-270) }, rotation: 90, hasOxygen: true },
        { id: "606-01", position: { x: mapX(840), y: mapY(-290) }, rotation: 0, hasOxygen: true },
        { id: "606-02", position: { x: mapX(1000), y: mapY(-290) }, rotation: 0, hasOxygen: true },

        // 第四排床位 (Y约-490)
        { id: "606-47", position: { x: mapX(150), y: mapY(-490) }, rotation: 90, hasOxygen: false },
        { id: "606-46", position: { x: mapX(230), y: mapY(-490) }, rotation: 0, hasOxygen: false },
        { id: "606-16", position: { x: mapX(420), y: mapY(-490) }, rotation: 0, hasOxygen: false },
        { id: "606-15", position: { x: mapX(500), y: mapY(-490) }, rotation: 0, hasOxygen: false },
        { id: "606-13", position: { x: mapX(610), y: mapY(-490) }, rotation: 90, hasOxygen: false },
        { id: "加床1", position: { x: mapX(310), y: mapY(-490) }, rotation: 0, hasOxygen: false },
        { id: "加床4", position: { x: mapX(360), y: mapY(-490) }, rotation: 0, hasOxygen: false },
        { id: "加床2", position: { x: mapX(300), y: mapY(-290) }, rotation: 0, hasOxygen: false },
        { id: "加床3", position: { x: mapX(360), y: mapY(-290) }, rotation: 0, hasOxygen: false },
        { id: "606-12", position: { x: mapX(700), y: mapY(-490) }, rotation: 90, hasOxygen: false }
    ],
    facilities: [
        // 左侧设施
        { type: "storage-cabinet", label: "储物柜", position: { x: mapX(0), y: mapY(-200) }, width: mapX(70), height: mapY(100) - mapY(200) },
        
        { type: "facility", label: "脑电监护护仪", position: { x: mapX(0), y: mapY(-70) }, width: mapX(60), height: mapY(50)-mapY(70) },
        
        // 中间区域设施
        { type: "wall", label: "墙体", position: { x: mapX(0), y: mapY(-290) }, width: mapX(130), height: mapY(50)-mapY(370) },
        { type: "equipment-belt", label: "设备带", position: { x: mapX(130), y: mapY(-270) }, width: mapX(130), height: mapY(10) },
        { type: "equipment-belt", label: "设备带", position: { x: mapX(300), y: mapY(-270) }, width: mapX(240), height: mapY(10) },
        { type: "computer", label: "电脑", position: { x: mapX(400), y: mapY(-240) }, width: mapX(40), height: mapY(20)-mapY(0) },
        { type: "wall", label: "墙体", position: { x: mapX(400), y: mapY(-290) }, width: mapX(40), height: mapY(20)-mapY(370) },
        { type: "equipment-belt", label: "设备带", position: { x: mapX(630), y: mapY(-270) }, width: mapX(240), height: mapY(10) },
        { type: "wall", label: "墙体", position: { x: mapX(760), y: mapY(-300) }, width: mapX(70), height: mapY(20)-mapY(370) },
        { type: "equipment-belt", label: "设备带", position: { x: mapX(950), y: mapY(-270) }, width: mapX(140), height: mapY(10) },
        { type: "treatment-car", label: "治疗车", position: { x: mapX(585), y: mapY(-0) }, width: mapX(40), height: mapY(20)-mapY(0) },
        { type: "treatment-car", label: "治疗车", position: { x: mapX(1050), y: mapY(-0) }, width: mapX(20), height: mapY(40)-mapY(0) },
        
        // 顶部设施
        { type: "door", label: "门", position: { x: mapX(280), y: mapY(-530) }, width: mapX(40), height: mapY(30)-mapY(0) },
        { type: "door", label: "门", position: { x: mapX(900), y: mapY(-530) }, width: mapX(40), height: mapY(30)-mapY(0) },
        { type: "cabinet", label: "柜子", position: { x: mapX(830), y: mapY(-530) }, width: mapX(70), height: mapY(60)-mapY(0) },
        { type: "cabinet", label: "柜子", position: { x: mapX(980), y: mapY(-530) }, width: mapX(70), height: mapY(60)-mapY(0) },
        { type: "cabinet", label: "柜子", position: { x: mapX(1040), y: mapY(-300) }, width: mapX(40), height: mapY(60)-mapY(270) },
        
        // 区域标注
        { type: "infection-zone", label: "感染病区 (7张)", position: { x: mapX(50), y: mapY(-100) }, width: mapX(150), height: mapY(50)-mapY(0) },
        { type: "area-label", label: "C区", position: { x: mapX(280), y: mapY(-140) }, width: mapX(50), height: mapY(50)-mapY(0) },
        { type: "area-label", label: "B区", position: { x: mapX(600), y: mapY(-140) }, width: mapX(50), height: mapY(50)-mapY(0) },
        { type: "area-label", label: "A区", position: { x: mapX(880), y: mapY(-270) }, width: mapX(50), height: mapY(50)-mapY(0) },
        { type: "infection-zone", label: "感染病区4", position: { x: mapX(180), y: mapY(-450) }, width: mapX(150), height: mapY(50)-mapY(0) },
        { type: "area-label", label: "C区", position: { x: mapX(280), y: mapY(-380) }, width: mapX(50), height: mapY(50)-mapY(0) },
        { type: "remark-box", label: "病情稍重病人 (需要用氧病人) 靠窗放置", position: { x: mapX(850), y: mapY(-110) }, width: mapX(200), height: mapY(70)-mapY(0) }
    ],
    // 氧源接口位置 (●)
    oxygenSources: [
        // Y约-100
        { position: { x: mapX(100), y: mapY(0) }, symbol: "●" },
        { position: { x: mapX(160), y: mapY(0) }, symbol: "●" },
        { position: { x: mapX(220), y: mapY(0) }, symbol: "●" },
        { position: { x: mapX(340), y: mapY(0) }, symbol: "●" },
        { position: { x: mapX(400), y: mapY(0) }, symbol: "●" },
        { position: { x: mapX(460), y: mapY(0) }, symbol: "●" },
        { position: { x: mapX(520), y: mapY(0) }, symbol: "●" },
        { position: { x: mapX(680), y: mapY(0) }, symbol: "●" },
        { position: { x: mapX(740), y: mapY(0) }, symbol: "●" },
        { position: { x: mapX(800), y: mapY(0) }, symbol: "●" },
        { position: { x: mapX(920), y: mapY(0) }, symbol: "●" },
        { position: { x: mapX(980), y: mapY(0) }, symbol: "●" },
        { position: { x: mapX(1040), y: mapY(0) }, symbol: "●" },
        { position: { x: mapX(200), y: mapY(-280) }, symbol: "●" },
        { position: { x: mapX(515), y: mapY(-280) }, symbol: "●" },
        { position: { x: mapX(460), y: mapY(-250) }, symbol: "●" },
        { position: { x: mapX(740), y: mapY(-250) }, symbol: "●" },
        { position: { x: mapX(800), y: mapY(-250) }, symbol: "●" },
        { position: { x: mapX(950), y: mapY(-250) }, symbol: "●" },
        { position: { x: mapX(1000), y: mapY(-280) }, symbol: "●" },
        { position: { x: mapX(300), y: mapY(-250) }, symbol: "●" },
        { position: { x: mapX(680), y: mapY(-280) }, symbol: "●" },
        { position: { x: mapX(840), y: mapY(-280) }, symbol: "●" },
        { position: { x: mapX(140), y: mapY(-250) }, symbol: "●" },
        { position: { x: mapX(640), y: mapY(-250) }, symbol: "●" },
        { position: { x: mapX(440), y: mapY(-530) }, symbol: "●" },
        { position: { x: mapX(640), y: mapY(-530) }, symbol: "●" }
    ],
    // 机械吊塔位置
    mechanicalTowers: []
};

// 床位数据状态 (与room602.js相同)
let room606BedData = {};

// 初始化床位数据
function initRoom606BedData() {
    room606Config.beds.forEach(bed => {
        room606BedData[bed.id] = {
            patientName: '',
            status: 'empty',
            remarks: ''
        };
    });
}

// 渲染606室布局
function renderRoom606() {
    const container = document.getElementById('room606-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // 渲染设施
    room606Config.facilities.forEach(facility => {
        const facilityEl = document.createElement('div');
        facilityEl.className = `facility ${facility.type}`;
        facilityEl.style.left = `${facility.position.x}px`;
        facilityEl.style.top = `${facility.position.y}px`;
        
        // 特殊处理需要设置宽度/高度的设施类型
        if (facility.width) { // Check if width property exists
            facilityEl.style.width = `${facility.width}px`;
        }
        if (facility.height) { // Check if height property exists
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
    room606Config.oxygenSources.forEach(oxygen => {
        const oxygenEl = document.createElement('div');
        oxygenEl.className = 'oxygen-source';
        oxygenEl.style.left = `${oxygen.position.x}px`;
        oxygenEl.style.top = `${oxygen.position.y}px`;
        oxygenEl.textContent = oxygen.symbol;
        container.appendChild(oxygenEl);
    });
    
    // 渲染机械吊塔 (样式已在CSS中定义，这里设置位置)
    room606Config.mechanicalTowers.forEach(tower => {
        const towerEl = document.createElement('div');
        towerEl.className = 'mechanical-tower';
        towerEl.style.left = `${tower.position.x}px`;
        towerEl.style.top = `${tower.position.y}px`;
        towerEl.textContent = tower.label;
        container.appendChild(towerEl);
    });
    
    // 渲染床位 (渲染逻辑与room602.js一致，但床位尺寸已在CSS和DEFAULT_BED_WIDTH_HTML/HEIGHT_HTML中调整)
    room606Config.beds.forEach(bed => {
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
        bedEl.classList.add(`bed-${room606BedData[bed.id].status}`);
        
        // 床位内容
        bedEl.innerHTML = `
            <div class="bed-label">${bed.id}</div>
            <div class="patient-area">${room606BedData[bed.id].patientName}</div>
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
    const bed = room606BedData[bedId] || { patientName: '', status: 'empty', remarks: '' };
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
    room606BedData[bedId] = {
        patientName: document.getElementById('patient-name').value,
        status: document.getElementById('bed-status').value,
        remarks: document.getElementById('bed-remarks').value
    };
    
    // 保存数据到本地存储
    localStorage.setItem('room606BedData', JSON.stringify(room606BedData));
    
    closeModal();
    renderRoom606(); // 重新渲染以更新显示
}

// 关闭模态框
function closeModal() {
    document.getElementById('bed-modal').style.display = 'none';
}

// 清空床位数据
function clearBedData() {
    const bedId = document.getElementById('modal-bed-id').textContent;
    room606BedData[bedId] = {
        patientName: '',
        status: 'empty',
        remarks: ''
    };
    
    // 保存数据到本地存储
    localStorage.setItem('room606BedData', JSON.stringify(room606BedData));
    
    closeModal();
    renderRoom606(); // 重新渲染以更新显示
}

// 初始化床位数据
initRoom606BedData();
