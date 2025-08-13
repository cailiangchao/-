// 601室床位布局配置 - 根据图片精准还原
const room601Config = {
    canvasSize: { width: 1000, height: 600},
    beds: [
        // 上排床位 (从左到右)
        { id: "601-15", position: { x: 70, y: 0 }, rotation: 0, hasOxygen: false },
        { id: "601-13", position: { x: 140, y: 0 }, rotation: 0, hasOxygen: false },
        { id: "601-12", position: { x: 210, y: 0 }, rotation: 0, hasOxygen: false },
        { id: "601-11", position: { x: 280, y: 0 }, rotation: 0, hasOxygen: true },
        { id: "601-10", position: { x: 350, y: 0 }, rotation: 0, hasOxygen: true },
        { id: "601-09", position: { x: 420, y: 0 }, rotation: 0, hasOxygen: true },
        { id: "601-08", position: { x: 490, y: 0 }, rotation: 0, hasOxygen: true },
        { id: "601-07", position: { x: 560, y: 0 }, rotation: 0, hasOxygen: true },
        { id: "601-06", position: { x: 630, y: 0 }, rotation: 0, hasOxygen: true },
        { id: "601-05", position: { x: 700, y: 0 }, rotation: 0, hasOxygen: true },
        
        // 左侧床位 (从上到下)
        { id: "601-16", position: { x: 30, y: 190 }, rotation: 0, hasOxygen: true },
        { id: "601-17", position: { x: 100, y: 190 }, rotation: 0, hasOxygen: true },
        
        // 中下区域床位 (从左到右)
        { id: "601-19", position: { x: 280, y: 198 }, rotation: 0, hasOxygen: true },
        { id: "601-20", position: { x: 350, y: 198 }, rotation: 0, hasOxygen: true },
        { id: "601-21", position: { x: 420, y: 198 }, rotation: 0, hasOxygen: true },
        { id: "601-22", position: { x: 490, y: 198 }, rotation: 0, hasOxygen: true },
        
        // 右下区域床位
        { id: "601-03", position: { x: 740, y: 120 }, rotation: 90, hasOxygen: true },
        
        // 底部床位
        { id: "601-18", position: { x: 120, y: 320 }, rotation: 0, hasOxygen: true },
        { id: "601-01", position: { x: 610, y: 320 }, rotation: 0, hasOxygen: true },
        { id: "601-02", position: { x: 680, y: 320 }, rotation: 0, hasOxygen: false }
    ],
    facilities: [
        { type: "warehouse", label: "库房", position: { x: 280, y: 280 }, width: 260, height: 120 },
        { type: "cabinet", label: "储物柜", position: { x: 550, y: 280 }, width: 30, height: 80 },
        { type: "induction_door", label: "感应门", position: { x: 210, y: 360 }, width: 60, height: 40 },
        { type: "induction_door", label: "感应门", position: { x: 550, y: 360 }, width: 60, height: 40 },
        { type: "computer", label: "电脑", position: { x: 180, y: 380 }, width: 20, height: 20 }
        
    ],
    // 氧源标识位置
    oxygenSources: [
        // 上排床位的氧源
        { position: { x: 265, y: 0 }, symbol: "◉" },  // 601-11
        { position: { x: 330, y: 0 }, symbol: "◉" },  // 601-10
        { position: { x: 400, y: 0 }, symbol: "◉" },  // 601-09
        { position: { x: 470, y: 0 }, symbol: "◉" },  // 601-08
        { position: { x: 540, y: 0 }, symbol: "◉" },  // 601-07
        { position: { x: 610, y: 0 }, symbol: "◉" },  // 601-06
        { position: { x: 680, y: 0 }, symbol: "◉" },  // 601-05
        { position: { x: 755, y: 0 }, symbol: "◉" },
        // 左侧床位的氧源 - X轴在两床位间
        { position: { x: 15, y: 260 }, symbol: "◉" },  // 601-16
        { position: { x: 85, y: 260 }, symbol: "◉" },  // 601-16与601-17之间
        { position: { x: 660, y: 380 }, symbol: "◉" }, //601-01
        { position: { x: 730, y: 380 }, symbol: "◉" },
        { position: { x: 330, y: 260 }, symbol: "◉" }, // 601-19
        // 601-19与601-20之间
        { position: { x: 470, y: 260 }, symbol: "◉" }, // 601-20
         // 601-20与601-21之间
        { position: { x: 400, y: 260 }, symbol: "◉" }, // 601-21
        
        { position: { x: 530, y: 260 }, symbol: "◉" }, // 601-22
        
        { position: { x: 780, y: 180 }, symbol: "◉" }, // 601-03右侧
        
        // 底部床位的氧源
        { position: { x: 100, y: 375 }, symbol: "◉" }, // 601-18
       
   
    ],
    // 机械吊臂位置
    mechanicalTowers: [
        { position: { x: 50, y: 150 }, width: 100, height: 30, label: "机械吊臂" },
        { position: { x: 70, y: 150 }, width: 100, height: 30, label: "机械吊臂" },
        { position: { x: 750, y: 150 }, width: 100, height: 30, label: "机械吊臂" },
        { position: { x: 750, y: 150 }, width: 100, height: 30, label: "机械吊臂" },
        { position: { x: 750, y: 150 }, width: 100, height: 30, label: "机械吊臂" },
        { position: { x: 750, y: 150 }, width: 100, height: 30, label: "机械吊臂" },
        { position: { x: 750, y: 150 }, width: 100, height: 30, label: "机械吊臂" },
        { position: { x: 750, y: 150 }, width: 100, height: 30, label: "机械吊臂" },
        { position: { x: 750, y: 150 }, width: 100, height: 30, label: "机械吊臂" }
    ]
};

// 床位数据状态
let room601BedData = {};

// 初始化床位数据
function initRoom601BedData() {
    room601Config.beds.forEach(bed => {
        room601BedData[bed.id] = {
            patientName: '',
            status: 'empty',
            remarks: ''
        };
    });
}

// 渲染601室布局
function renderRoom601() {
    const container = document.getElementById('room601-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // 获取是否显示边界框
    const showBoundaries = window.showElementBoundaries || false;
    
    // 渲染设施
    room601Config.facilities.forEach(facility => {
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
    room601Config.oxygenSources.forEach(oxygen => {
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
    room601Config.mechanicalTowers.forEach(tower => {
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
        towerEl.textContent = tower.label;
        
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
    
    // 渲染床位
    room601Config.beds.forEach(bed => {
        const bedEl = document.createElement('div');
        bedEl.className = 'bed';
        bedEl.id = `bed-${bed.id}`;
        bedEl.style.left = `${bed.position.x}px`;
        bedEl.style.top = `${bed.position.y}px`;
        
        // 调试模式：添加位置标识
        if (showBoundaries) {
            bedEl.style.boxShadow = '0 0 0 1px green';
            
            // 添加坐标和ID显示
            const posText = document.createElement('div');
            posText.style.position = 'absolute';
            posText.style.top = '-18px';
            posText.style.left = '0';
            posText.style.fontSize = '8px';
            posText.style.color = 'green';
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
            // 横向床位的文本内容也需要旋转，使其保持水平
            bedEl.style.transformOrigin = 'center center';
        } else {
            // 竖向床位
            bedEl.style.width = '40px';
            bedEl.style.height = '80px';
            bedEl.style.transform = 'rotate(0deg)';
        }
        
        // 床位内容
        bedEl.innerHTML = `
            <div class="bed-label">${bed.id}</div>
            <div class="patient-area">${room601BedData[bed.id]?.patientName || ''}</div>
        `;
        
        // 点击事件
        bedEl.addEventListener('click', () => openBedModal(bed.id));
        
        container.appendChild(bedEl);
    });
    
    // 更新标题中的日期和病人总数
    updateTitleInfo();
}

// 更新标题信息
function updateTitleInfo() {
    const titleEl = document.querySelector('.room-title');
    if (!titleEl) return;
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // 计算病人总数
    const patientCount = Object.values(room601BedData).filter(data => data.patientName && data.patientName.trim() !== '').length;
    
    // 如果显示调试模式，在标题中显示
    const debugMode = window.showElementBoundaries ? ' [调试模式]' : '';
    
    titleEl.textContent = `${year}年${month}月${day}日601室床位分布图, 病人总数${patientCount}人${debugMode},预出院${1}人`;
}

// 添加位置信息显示的辅助函数
function addPositionInfo(element, x, y, width, height, color = 'blue') {
    if (!window.showElementBoundaries) return;
    
    const infoDiv = document.createElement('div');
    infoDiv.style.position = 'absolute';
    infoDiv.style.top = '-18px';
    infoDiv.style.left = '0';
    infoDiv.style.fontSize = '8px';
    infoDiv.style.color = color;
    infoDiv.style.backgroundColor = 'rgba(255,255,255,0.7)';
    infoDiv.style.padding = '2px';
    infoDiv.style.borderRadius = '2px';
    infoDiv.style.pointerEvents = 'none';
    infoDiv.textContent = `x:${x}, y:${y}`;
    
    if (width && height) {
        infoDiv.textContent += `, w:${width}, h:${height}`;
    }
    
    element.appendChild(infoDiv);
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
    const bed = room601BedData[bedId] || { patientName: '', status: 'empty', remarks: '' };
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
    room601BedData[bedId] = {
        patientName: document.getElementById('patient-name').value,
        status: document.getElementById('bed-status').value,
        remarks: document.getElementById('bed-remarks').value
    };
    
    // 保存数据到本地存储
    localStorage.setItem('room601BedData', JSON.stringify(room601BedData));
    
    closeModal();
    renderRoom601(); // 重新渲染以更新显示
}

// 关闭模态框
function closeModal() {
    document.getElementById('bed-modal').style.display = 'none';
}

// 清空床位数据
function clearBedData() {
    const bedId = document.getElementById('modal-bed-id').textContent;
    room601BedData[bedId] = {
        patientName: '',
        status: 'empty',
        remarks: ''
    };
    
    // 保存数据到本地存储
    localStorage.setItem('room601BedData', JSON.stringify(room601BedData));
    
    closeModal();
    renderRoom601(); // 重新渲染以更新显示
}

// 初始化
initRoom601BedData();
