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
        { id: "605-06", position: { x: 20, y: 64 }, rotation: 90, hasOxygen: true },
        // Image (~20, -90). HTML: x=20, y=-90 * -1.6 = 144
        { id: "605-07", position: { x: 20, y: 164 }, rotation:90, hasOxygen: true },
        // Image (~290, -30). HTML: x=290, y=-30 * -1.6 = 48
        { id: "605-05", position: { x: 270, y:0 }, rotation: 0, hasOxygen: true },
        { id: "加床", position: { x: 140, y:0 }, rotation: 0, hasOxygen: true },
        { id: "加床", position: { x: 380, y:0 }, rotation: 0, hasOxygen: true },
        // Image (~400, -40). HTML: x=400, y=-40 * -1.6 = 64
        { id: "605-03", position: { x: 437, y: 64 }, rotation: 90, hasOxygen: true },
        // Image (~400, -100). HTML: x=400, y=-100 * -1.6 = 160
        { id: "605-02", position: { x: 437, y: 180 }, rotation: 90, hasOxygen: true },
        
        // 横向床位 (rotation: 90)
        // Image (~350, -180). HTML: x=350, y=-180 * -1.6 = 288
        { id: "605-01", position: { x: 350, y: 337 }, rotation: 90, hasOxygen: false }
    ],
    facilities: [
        // 库房1 (Warehouse 1): Image (~0, -150) to (~200, -200). HTML: x=0, y=240, w=200, h=80
        { type: "warehouse", label: "库房1", position: { x: 0, y: 318 }, width: 200, height: 80 },
        // 感应门 (Induction Door): Image (~210, -190). HTML: x=210, y=304
        { type: "induction_door", label: "感应门", position: { x: 210, y: 358 }, width: 60, height: 40 },
                
        // 主门 (Main Door)
        
        // 电脑 (Computer): Image (~420, -190). HTML: x=420, y=304
        { type: "computer", label: "电脑", position: { x: 420, y: 384 } },
        // 洗手池 (Washbasin): Image (~480, -160). HTML: x=480, y=256
        { type: "washbasin", label: "洗手池", position: { x: 447, y: 276 } },
        
        

        // 隔离病房 (Isolation Wards) - now treated as beds
        { id: "隔离病房1", position: { x: 520, y: 100 }, rotation: 0, width: 100, height: 50, isIsolation: true },
        { id: "隔离病房2", position: { x: 520, y: 300 }, rotation: 0, width: 100, height: 50, isIsolation: true }
    ],
    // 氧源接口位置 (◉)
    oxygenSources: [
        // Near 605-06: Image (~0, -10). HTML: x=0, y=16
        { position: { x: 210, y: 2 }, symbol: "◉" },
        // Near 605-07: Image (~0, -70). HTML: x=0, y=112
        { position: { x: 0, y: 152 }, symbol: "◉" },
         { position: { x: 0, y: 42 }, symbol: "◉" },
        // Near 605-05: Image (~340, -10). HTML: x=340, y=16
        { position: { x: 340, y: 2 }, symbol: "◉" },
        // Near 605-03: Image (~470, -60). HTML: x=470, y=96
        { position: { x: 490, y: 140 }, symbol: "◉" },
        // Near 605-02: Image (~470, -130). HTML: x=470, y=208
        { position: { x: 490, y: 250 }, symbol: "◉" }
    ],
    // 机械吊塔位置
    mechanicalTowers: [
        // 需要竖起来
        { position: { x: 200, y: 32 }, label: "机械吊臂" },
        { position: { x: 330, y: 32 }, label: "机械吊臂" }, 
        //横向即可
        { position: { x: 20, y: 153 }, label: "机械吊臂" ,},
        { position: { x: 450, y: 138 }, label: "机械吊臂" },
        { position: { x: 450, y: 170 }, label: "机械吊臂" }
    ]
};

// 床位数据状态 (与room602.js相同)
let room605BedData = {};

// 初始化床位数据（包括隔离病房）
function initRoom605BedData() {
    // 普通床位
    room605Config.beds.forEach(bed => {
        room605BedData[bed.id] = {
            patientName: '',
            status: 'empty',
            remarks: ''
        };
    });
    
    // 隔离病房
    room605Config.facilities
        .filter(f => f.isIsolation)
        .forEach(ward => {
            if (!room605BedData[ward.id]) {
                room605BedData[ward.id] = {
                    patientName: '',
                    status: 'empty', 
                    remarks: ''
                };
            }
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
    
    // 渲染床位 (包括隔离病房)
    [...room605Config.beds, ...room605Config.facilities.filter(f => f.isIsolation)].forEach(bed => {
        const bedEl = document.createElement('div');
        bedEl.className = 'bed';
        if (bed.isIsolation) {
            bedEl.classList.add('isolation-ward');
        }
        bedEl.id = `bed-${bed.id}`;
        bedEl.style.left = `${bed.position.x}px`;
        bedEl.style.top = `${bed.position.y}px`;
        
        // 设置尺寸
        bedEl.style.width = `${bed.width || 40}px`;
        bedEl.style.height = `${bed.height || 80}px`;
        bedEl.style.transform = `rotate(${bed.rotation || 0}deg)`;
        bedEl.style.transformOrigin = 'center center';
        
        // 初始化床位数据（如果不存在）
        if (!room605BedData[bed.id]) {
            room605BedData[bed.id] = {
                patientName: '',
                status: 'empty',
                remarks: ''
            };
        }
        
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
    const bed = room605BedData[bedId] || { patientName: '', status: 'empty', remarks: '' };
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
    room605BedData[bedId] = {
        patientName: document.getElementById('patient-name').value,
        status: document.getElementById('bed-status').value,
        remarks: document.getElementById('bed-remarks').value
    };
    
    // 保存数据到本地存储
    localStorage.setItem('room605BedData', JSON.stringify(room605BedData));
    
    closeModal();
    renderRoom605(); // 重新渲染以更新显示
}

// 关闭模态框
function closeModal() {
    document.getElementById('bed-modal').style.display = 'none';
}

// 清空床位数据
function clearBedData() {
    const bedId = document.getElementById('modal-bed-id').textContent;
    room605BedData[bedId] = {
        patientName: '',
        status: 'empty',
        remarks: ''
    };
    
    // 保存数据到本地存储
    localStorage.setItem('room605BedData', JSON.stringify(room605BedData));
    
    closeModal();
    renderRoom605(); // 重新渲染以更新显示
}

// 初始化床位数据
initRoom605BedData();
