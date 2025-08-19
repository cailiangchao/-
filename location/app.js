// 通用床位布局配置 - 会被各房间的配置覆盖
const bedLayoutConfig = {
    canvasSize: { width: 1200, height: 500 },
    beds: [],
    facilities: [],
    oxygenSources: [],
    washbasins: [],
    specialAreas: []
};

// 床位数据状态
let bedData = {};
let currentBedId = null;
let currentDate = getCurrentDateString();

// 初始化应用
function initApp() {
    // 初始化DOM元素
    const bedContainer = document.getElementById('bed-container');
    const totalPatientsInput = document.getElementById('total-patients');
    const dischargePlannedInput = document.getElementById('discharge-planned');
    const modal = document.getElementById('bed-modal');
    const modalBedId = document.getElementById('modal-bed-id');
    const patientNameInput = document.getElementById('patient-name');
    const bedStatusSelect = document.getElementById('bed-status');
    const bedRemarksTextarea = document.getElementById('bed-remarks');
    const monthSelect = document.getElementById('month-select');
    const daySelect = document.getElementById('day-select');

    // 初始化日期选择器
    if (daySelect) {
        initDatePicker(daySelect);
    }
    
    // 加载数据
    loadBedData();

    // 绑定床位点击事件
    if (bedContainer) {
        bedContainer.addEventListener('click', function(e) {
            const bedElement = e.target.closest('.bed');
            if (bedElement) {
                const bedId = bedElement.dataset.bedId;
                currentBedId = bedId;
                openBedModal(bedId);
            }
        });
    }
    
    // 绑定模态框按钮事件
    bindModalEvents();
}

// 绑定模态框事件
function bindModalEvents() {
    // 使用事件委托来处理动态创建的按钮
    document.addEventListener('click', function(e) {
        if (e.target.id === 'confirm-btn') {
            saveBedData();
        } else if (e.target.id === 'cancel-btn') {
            closeModal();
        } else if (e.target.id === 'clear-btn') {
            clearBedData();
        }
    });
    
    // 监听患者姓名输入框的变化，提供实时反馈
    document.addEventListener('input', function(e) {
        if (e.target.id === 'patient-name') {
            const patientName = e.target.value.trim();
            const bedStatusSelect = document.getElementById('bed-status');
            
            if (patientName !== '' && bedStatusSelect.value === 'empty') {
                // 自动将状态设置为占用，但不强制锁定
                bedStatusSelect.value = 'occupied';
                // 添加视觉反馈提示
                bedStatusSelect.style.backgroundColor = '#e8f5e8';
                setTimeout(() => {
                    bedStatusSelect.style.backgroundColor = '';
                }, 1000);
            } else if (patientName === '') {
                // 如果清空了姓名，自动设置为空床
                bedStatusSelect.value = 'empty';
                bedStatusSelect.style.backgroundColor = '#ffe8e8';
                setTimeout(() => {
                    bedStatusSelect.style.backgroundColor = '';
                }, 1000);
            }
        }
    });
    
    // 点击模态框背景关闭
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// 创建通用模态框
function createBedModal() {
    // 如果模态框已存在，直接返回
    const existingModal = document.getElementById('bed-modal');
    if (existingModal) {
        return existingModal;
    }
    
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

// 打开床位编辑模态框
function openBedModal(bedId) {
    let modal = document.getElementById('bed-modal');
    if (!modal) {
        modal = createBedModal();
    }
    
    currentBedId = bedId;
    document.getElementById('modal-bed-id').textContent = bedId;
    
    // 填充现有数据
    const bed = bedData[bedId] || { patientName: '', status: 'empty', remarks: '' };
    document.getElementById('patient-name').value = bed.patientName || '';
    document.getElementById('bed-status').value = bed.status || 'empty';
    document.getElementById('bed-remarks').value = bed.remarks || '';
    
    modal.style.display = 'block';
    
    // 聚焦到患者姓名输入框
    setTimeout(() => {
        document.getElementById('patient-name').focus();
    }, 100);
}

// 获取当前日期字符串 (YYYY-MM-DD)
function getCurrentDateString() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// 初始化日期选择器
function initDatePicker(daySelect) {
    // 清空现有选项
    daySelect.innerHTML = '';
    
    // 获取当前月份的天数
    const daysInMonth = new Date(
        document.getElementById('year-span').textContent,
        document.getElementById('month-select').value,
        0
    ).getDate();
    
    // 添加日期选项
    for (let i = 1; i <= daysInMonth; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i}日`;
        if (i === new Date().getDate()) {
            option.selected = true;
        }
        daySelect.appendChild(option);
    }
}

// 从本地存储加载数据
function loadBedData() {
    const savedData = localStorage.getItem(`bedData_${currentDate}_${window.location.pathname}`);
    
    if (savedData) {
        try {
            bedData = JSON.parse(savedData);
        } catch (error) {
            console.error('解析本地数据失败:', error);
            initBedData();
        }
    } else {
        initBedData();
    }
    
    renderBeds();
}

// 保存所有床位数据到本地存储
function saveAllBedData() {
    localStorage.setItem(`bedData_${currentDate}_${window.location.pathname}`, JSON.stringify(bedData));
}

// 保存单个床位数据并自动设置状态
function saveBedData() {
    const modal = document.getElementById('bed-modal');
    if (!modal || !currentBedId) return;
    
    const patientName = document.getElementById('patient-name').value.trim();
    const bedStatus = document.getElementById('bed-status').value;
    const remarks = document.getElementById('bed-remarks').value;
    
    // 自动逻辑判断：如果输入了床号，自动设置为非空床状态
    let finalStatus = bedStatus;
    if (patientName !== '') {
        // 如果输入了患者信息且当前状态是空床，自动改为占用状态
        if (bedStatus === 'empty') {
            finalStatus = 'occupied';
        }
    } else {
        // 如果没有输入患者信息，强制设置为空床
        finalStatus = 'empty';
    }
    
    // 保存数据
    bedData[currentBedId] = {
        patientName: patientName,
        status: finalStatus,
        remarks: remarks
    };
    
    // 如果状态被自动更改，更新界面上的选择框显示
    if (finalStatus !== bedStatus) {
        document.getElementById('bed-status').value = finalStatus;
    }
    
    saveAllBedData();
    renderBeds();
    closeModal();
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('bed-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 清空床位数据
function clearBedData() {
    if (!currentBedId) return;
    
    bedData[currentBedId] = {
        patientName: '',
        status: 'empty',
        remarks: ''
    };
    
    saveAllBedData();
    renderBeds();
    closeModal();
}

// 初始化床位数据
function initBedData() {
    bedData = {};
    bedLayoutConfig.beds.forEach(bed => {
        bedData[bed.id] = {
            patientName: '',
            status: 'empty',
            remarks: ''
        };
    });
    saveAllBedData();
}

// 渲染床位
function renderBeds() {
    const bedContainer = document.getElementById('bed-container');
    bedContainer.innerHTML = '';
    
    // 设置容器大小
    bedContainer.style.width = `${bedLayoutConfig.canvasSize.width}px`;
    bedContainer.style.height = `${bedLayoutConfig.canvasSize.height}px`;
    
    // 渲染所有床位
    bedLayoutConfig.beds.forEach(bed => {
        const bedElement = document.createElement('div');
        bedElement.className = 'bed';
        bedElement.dataset.bedId = bed.id;
        bedElement.style.left = `${bed.position.x}px`;
        bedElement.style.top = `${bed.position.y}px`;
        
        // 应用旋转
        if (bed.rotation) {
            bedElement.style.transform = `rotate(${bed.rotation}deg)`;
        }
        
        // 设置床位样式
        const bedStatus = bedData[bed.id]?.status || 'empty';
        bedElement.classList.add(bedStatus);
        
        // 添加床位编号
        const bedNumber = document.createElement('div');
        bedNumber.className = 'bed-number';
        bedNumber.textContent = bed.id.split('-')[1]; // 显示床位号如"15"
        bedElement.appendChild(bedNumber);
        
        // 如果有氧气标识
        if (bed.hasOxygen) {
            const oxygenIcon = document.createElement('div');
            oxygenIcon.className = 'oxygen-icon';
            oxygenIcon.innerHTML = '⦿'; // 氧气符号
            bedElement.appendChild(oxygenIcon);
        }
        
        // 如果有患者信息则显示
        if (bedData[bed.id]?.patientName) {
            const patientName = document.createElement('div');
            patientName.className = 'patient-name';
            patientName.textContent = bedData[bed.id].patientName;
            bedElement.appendChild(patientName);
        }
        
        bedContainer.appendChild(bedElement);
    });
    
    // 渲染特殊区域
    if (bedLayoutConfig.specialAreas) {
        bedLayoutConfig.specialAreas.forEach(area => {
            const areaElement = document.createElement('div');
            areaElement.className = 'special-area';
            areaElement.id = area.id;
            areaElement.style.left = `${area.position.x}px`;
            areaElement.style.top = `${area.position.y}px`;
            areaElement.style.width = `${area.width}px`;
            areaElement.style.height = `${area.height}px`;
            
            // 添加标签
            const labelElement = document.createElement('div');
            labelElement.className = 'area-label';
            labelElement.textContent = area.label;
            areaElement.appendChild(labelElement);
            
            bedContainer.appendChild(areaElement);
        });
    }
    
    updateStats();
}

// 更新统计数据
function updateStats() {
    const occupiedBeds = Object.values(bedData).filter(
        bed => bed.status === 'occupied' || bed.status === 'discharge_planned'
    ).length;
    
    const dischargePlannedBeds = Object.values(bedData).filter(
        bed => bed.status === 'discharge_planned'
    ).length;
    
    document.getElementById('total-patients').value = occupiedBeds;
    document.getElementById('discharge-planned').value = dischargePlannedBeds;
}

// 其他功能函数...
// (保留原有的功能函数，但调整为使用通用DOM元素)
