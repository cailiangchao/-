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
    initDatePicker(daySelect);
    
    // 加载数据
    loadBedData();

    // 绑定床位点击事件
    bedContainer.addEventListener('click', function(e) {
        const bedElement = e.target.closest('.bed');
        if (bedElement) {
            const bedId = bedElement.dataset.bedId;
            currentBedId = bedId;
            openBedModal(bedId);
        }
    });
}

// 打开床位编辑模态框
function openBedModal(bedId) {
    const modal = document.getElementById('bed-modal');
    document.getElementById('modal-bed-id').textContent = bedId;
    
    // 填充现有数据
    const bed = bedData[bedId] || { patientName: '', status: 'empty', remarks: '' };
    document.getElementById('patient-name').value = bed.patientName;
    document.getElementById('bed-status').value = bed.status;
    document.getElementById('bed-remarks').value = bed.remarks;
    
    modal.style.display = 'block';
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
