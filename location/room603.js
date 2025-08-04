
const room603Config = {
    canvasSize: { width: 500, height: 400 }, // 与HTML容器尺寸一致
    beds: [
        // 竖向床位 (rotation: 0)
        { id: "603-06", position: { x: 20, y: 56 }, rotation: 90, hasOxygen: true },
        { id: "603-07", position: { x: 20, y: 180 }, rotation: 90, hasOxygen: true },
        { id: "603-05", position: { x: 250, y: 0 }, rotation: 0, hasOxygen: true },
        { id: "加床", position: { x: 150, y: 0 }, rotation: 0, hasOxygen: true },
        { id: "加床", position: { x: 350, y: 0 }, rotation: 0, hasOxygen: true },
        { id: "603-03", position: { x: 440, y: 112 }, rotation: 90, hasOxygen: true },
        { id: "603-02", position: { x: 440, y: 240 }, rotation: 90, hasOxygen: true },
        
        // 横向床位 (rotation: 90)
        { id: "603-01", position: { x: 340, y: 342 }, rotation: 90, hasOxygen: false }
    ],
    facilities: [
        { type: "warehouse", label: "库房2", position: { x: 0, y: 320 }, width: 180, height: 78 },
        { type: "induction_door", label: "感应门", position: { x: 210, y: 358 }, width: 60, height: 40 },           
        { type: "computer", label: "电脑", position: { x: 450, y: 384 } },
    ],
    // 氧源接口位置 (◉)
    oxygenSources: [
        { position: { x: 00, y: 16 }, symbol: "◉" }, // 靠近603-06
        { position: { x: 00, y: 160 }, symbol: "◉" }, // 靠近603-07
        { position: { x: 310, y: 2 }, symbol: "◉" }, // 靠近603-05
        { position: { x: 430, y: 2 }, symbol: "◉" }, // 靠近603-03
        { position: { x: 490, y: 85 }, symbol: "◉" },  // 靠近603-02
        { position: { x: 490, y: 240 }, symbol: "◉" }  // 靠近603-02
    ],
    // 机械吊塔位置
    mechanicalTowers: [
        { position: { x: 10, y: 20 }, label: "机械吊臂" },   // 603-06 左
        { position: { x: 10, y: 170 }, label: "机械吊臂" },   // 603-06 右
        { position: { x: 190, y: 12 }, label: "机械吊臂" },  // 竖起来
        { position: { x: 300, y: 12 }, label: "机械吊臂" },  // 竖起来
        { position: { x: 460, y: 80 }, label: "机械吊臂" },  // 603-05 左
        { position: { x: 460, y: 220 }, label: "机械吊臂" },  // 603-05 右
 
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
    const bed = room603BedData[bedId] || { patientName: '', status: 'empty', remarks: '' };
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
    room603BedData[bedId] = {
        patientName: document.getElementById('patient-name').value,
        status: document.getElementById('bed-status').value,
        remarks: document.getElementById('bed-remarks').value
    };
    
    // 保存数据到本地存储
    localStorage.setItem('room603BedData', JSON.stringify(room603BedData));
    
    closeModal();
    renderRoom603(); // 重新渲染以更新显示
}

// 关闭模态框
function closeModal() {
    document.getElementById('bed-modal').style.display = 'none';
}

// 清空床位数据
function clearBedData() {
    const bedId = document.getElementById('modal-bed-id').textContent;
    room603BedData[bedId] = {
        patientName: '',
        status: 'empty',
        remarks: ''
    };
    
    // 保存数据到本地存储
    localStorage.setItem('room603BedData', JSON.stringify(room603BedData));
    
    closeModal();
    renderRoom603(); // 重新渲染以更新显示
}

// 初始化床位数据
initRoom603BedData();
