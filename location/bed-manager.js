// 通用床位管理器 - 支持动态添加床位和拖拽功能
class BedManager {
    constructor(roomId, config) {
        this.roomId = roomId;
        this.config = config;
        this.isDragging = false;
        this.dragElement = null;
        this.dragOffset = { x: 0, y: 0 };
        this.additionalBeds = []; // 存储加床信息
        this.bedData = {};
        this.isAddingBed = false;
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.setupUI();
    }
    
    // 加载数据
    loadData() {
        // 加载床位数据
        const savedBedData = localStorage.getItem(`${this.roomId}BedData`);
        if (savedBedData) {
            try {
                this.bedData = JSON.parse(savedBedData);
            } catch (error) {
                console.error('解析床位数据失败:', error);
                this.initBedData();
            }
        } else {
            this.initBedData();
        }
        
        // 加载加床数据
        const savedAdditionalBeds = localStorage.getItem(`${this.roomId}AdditionalBeds`);
        if (savedAdditionalBeds) {
            try {
                this.additionalBeds = JSON.parse(savedAdditionalBeds);
            } catch (error) {
                console.error('解析加床数据失败:', error);
                this.additionalBeds = [];
            }
        }
    }
    
    // 初始化床位数据
    initBedData() {
        this.config.beds.forEach(bed => {
            this.bedData[bed.id] = {
                patientName: '',
                status: 'empty',
                remarks: ''
            };
        });
        
        // 初始化加床数据
        this.additionalBeds.forEach(bed => {
            this.bedData[bed.id] = {
                patientName: '',
                status: 'empty',
                remarks: ''
            };
        });
    }
    
    // 保存数据
    saveData() {
        localStorage.setItem(`${this.roomId}BedData`, JSON.stringify(this.bedData));
        localStorage.setItem(`${this.roomId}AdditionalBeds`, JSON.stringify(this.additionalBeds));
    }
    
    // 设置UI控件
    setupUI() {
        const container = document.getElementById(`${this.roomId}-container`);
        if (!container) return;
        
        // 添加加床按钮
        const addBedButton = document.createElement('button');
        addBedButton.id = 'add-bed-btn';
        addBedButton.className = 'add-bed-button';
        addBedButton.innerHTML = '+ 加床';
        addBedButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 8px 15px;
            background-color: #52c41a;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            z-index: 1000;
        `;
        
        addBedButton.addEventListener('click', () => this.startAddingBed());
        
        // 将按钮添加到容器的父元素
        container.parentElement.style.position = 'relative';
        container.parentElement.appendChild(addBedButton);
        
        // 添加模式提示
        const modeIndicator = document.createElement('div');
        modeIndicator.id = 'mode-indicator';
        modeIndicator.style.cssText = `
            position: absolute;
            top: 50px;
            right: 10px;
            padding: 5px 10px;
            background-color: #1890ff;
            color: white;
            border-radius: 3px;
            font-size: 12px;
            display: none;
            z-index: 1000;
        `;
        modeIndicator.innerHTML = '点击选择加床位置';
        container.parentElement.appendChild(modeIndicator);
    }
    
    // 设置事件监听器
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isAddingBed) {
                this.cancelAddingBed();
            }
        });
    }
    
    // 开始添加床位模式
    startAddingBed() {
        this.isAddingBed = true;
        const container = document.getElementById(`${this.roomId}-container`);
        const modeIndicator = document.getElementById('mode-indicator');
        const addBedBtn = document.getElementById('add-bed-btn');
        
        // 显示模式提示
        if (modeIndicator) {
            modeIndicator.style.display = 'block';
        }
        
        // 更改按钮文本
        if (addBedBtn) {
            addBedBtn.innerHTML = '取消加床';
            addBedBtn.style.backgroundColor = '#ff4d4f';
            addBedBtn.onclick = () => this.cancelAddingBed();
        }
        
        // 改变容器样式，显示可选区域
        if (container) {
            container.style.cursor = 'crosshair';
            container.style.boxShadow = '0 0 10px rgba(82, 196, 26, 0.5)';
        }
        
        // 添加点击监听器
        container.addEventListener('click', this.handleContainerClick.bind(this));
    }
    
    // 取消添加床位模式
    cancelAddingBed() {
        this.isAddingBed = false;
        const container = document.getElementById(`${this.roomId}-container`);
        const modeIndicator = document.getElementById('mode-indicator');
        const addBedBtn = document.getElementById('add-bed-btn');
        
        // 隐藏模式提示
        if (modeIndicator) {
            modeIndicator.style.display = 'none';
        }
        
        // 恢复按钮
        if (addBedBtn) {
            addBedBtn.innerHTML = '+ 加床';
            addBedBtn.style.backgroundColor = '#52c41a';
            addBedBtn.onclick = () => this.startAddingBed();
        }
        
        // 恢复容器样式
        if (container) {
            container.style.cursor = 'default';
            container.style.boxShadow = 'none';
        }
        
        // 移除点击监听器
        container.removeEventListener('click', this.handleContainerClick.bind(this));
    }
    
    // 处理容器点击（添加床位）
    handleContainerClick(e) {
        if (!this.isAddingBed) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const container = document.getElementById(`${this.roomId}-container`);
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 检查是否与现有床位或设施冲突
        if (this.checkCollision(x, y)) {
            alert('该位置与现有设施冲突，请选择其他位置');
            return;
        }
        
        // 创建新床位
        this.addNewBed(x, y);
        this.cancelAddingBed();
    }
    
    // 检查位置冲突
    checkCollision(x, y) {
        const bedSize = { width: 40, height: 80 };
        const checkArea = {
            left: x - bedSize.width/2,
            right: x + bedSize.width/2,
            top: y - bedSize.height/2,
            bottom: y + bedSize.height/2
        };
        
        // 检查与现有床位的冲突
        const allBeds = [...this.config.beds, ...this.additionalBeds];
        for (const bed of allBeds) {
            const bedArea = {
                left: bed.position.x,
                right: bed.position.x + bedSize.width,
                top: bed.position.y,
                bottom: bed.position.y + bedSize.height
            };
            
            if (this.isOverlapping(checkArea, bedArea)) {
                return true;
            }
        }
        
        // 检查与设施的冲突
        if (this.config.facilities) {
            for (const facility of this.config.facilities) {
                const facilityArea = {
                    left: facility.position.x,
                    right: facility.position.x + (facility.width || 50),
                    top: facility.position.y,
                    bottom: facility.position.y + (facility.height || 30)
                };
                
                if (this.isOverlapping(checkArea, facilityArea)) {
                    return true;
                }
            }
        }
        
        // 检查边界
        if (checkArea.left < 0 || checkArea.right > this.config.canvasSize.width ||
            checkArea.top < 0 || checkArea.bottom > this.config.canvasSize.height) {
            return true;
        }
        
        return false;
    }
    
    // 检查两个区域是否重叠
    isOverlapping(area1, area2) {
        return !(area1.right < area2.left || 
                area1.left > area2.right || 
                area1.bottom < area2.top || 
                area1.top > area2.bottom);
    }
    
    // 添加新床位
    addNewBed(x, y) {
        const newBedId = `${this.roomId}-ADD${this.additionalBeds.length + 1}`;
        const newBed = {
            id: newBedId,
            position: { x: x - 20, y: y - 40 }, // 居中放置
            rotation: 0,
            hasOxygen: false,
            isAdditional: true
        };
        
        this.additionalBeds.push(newBed);
        
        // 初始化床位数据
        this.bedData[newBedId] = {
            patientName: '',
            status: 'empty',
            remarks: ''
        };
        
        this.saveData();
        this.render();
        
        alert(`成功添加加床: ${newBedId}`);
    }
    
    // 删除床位
    deleteBed(bedId) {
        // 只能删除加床
        const bedIndex = this.additionalBeds.findIndex(bed => bed.id === bedId);
        if (bedIndex === -1) {
            alert('只能删除加床，不能删除原有床位');
            return;
        }
        
        if (confirm(`确定删除床位 ${bedId} 吗？`)) {
            this.additionalBeds.splice(bedIndex, 1);
            delete this.bedData[bedId];
            this.saveData();
            this.render();
        }
    }
    
    // 启用拖拽模式
    enableDragMode() {
        const beds = document.querySelectorAll('.bed.additional');
        beds.forEach(bed => {
            bed.style.cursor = 'move';
            bed.draggable = true;
            bed.addEventListener('dragstart', this.handleDragStart.bind(this));
            bed.addEventListener('dragend', this.handleDragEnd.bind(this));
        });
        
        const container = document.getElementById(`${this.roomId}-container`);
        container.addEventListener('dragover', this.handleDragOver.bind(this));
        container.addEventListener('drop', this.handleDrop.bind(this));
    }
    
    // 拖拽开始
    handleDragStart(e) {
        this.isDragging = true;
        this.dragElement = e.target;
        const bedId = this.dragElement.id.replace('bed-', '');
        e.dataTransfer.setData('text/plain', bedId);
        e.dataTransfer.effectAllowed = 'move';
        this.dragElement.style.opacity = '0.5';
    }
    
    // 拖拽结束
    handleDragEnd(e) {
        this.isDragging = false;
        if (this.dragElement) {
            this.dragElement.style.opacity = '1';
            this.dragElement = null;
        }
    }
    
    // 拖拽悬停
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }
    
    // 拖拽放下
    handleDrop(e) {
        e.preventDefault();
        const bedId = e.dataTransfer.getData('text/plain');
        const bed = this.additionalBeds.find(b => b.id === bedId);
        
        if (!bed) return;
        
        const container = document.getElementById(`${this.roomId}-container`);
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 检查新位置是否有冲突
        if (this.checkCollisionExcludingBed(x, y, bedId)) {
            alert('目标位置与其他设施冲突');
            return;
        }
        
        // 更新床位位置
        bed.position.x = x - 20;
        bed.position.y = y - 40;
        
        this.saveData();
        this.render();
    }
    
    // 检查冲突（排除指定床位）
    checkCollisionExcludingBed(x, y, excludeBedId) {
        const bedSize = { width: 40, height: 80 };
        const checkArea = {
            left: x - bedSize.width/2,
            right: x + bedSize.width/2,
            top: y - bedSize.height/2,
            bottom: y + bedSize.height/2
        };
        
        // 检查与其他床位的冲突
        const allBeds = [...this.config.beds, ...this.additionalBeds.filter(bed => bed.id !== excludeBedId)];
        for (const bed of allBeds) {
            const bedArea = {
                left: bed.position.x,
                right: bed.position.x + bedSize.width,
                top: bed.position.y,
                bottom: bed.position.y + bedSize.height
            };
            
            if (this.isOverlapping(checkArea, bedArea)) {
                return true;
            }
        }
        
        return false;
    }
    
    // 渲染房间
    render() {
        // 这个方法应该由具体的房间实现类重写
        throw new Error('render方法必须由子类实现');
    }
    
    // 打开床位编辑模态框
    openBedModal(bedId) {
        const modal = document.getElementById('bed-modal');
        if (!modal) {
            this.createBedModal();
        }
        
        document.getElementById('modal-bed-id').textContent = bedId;
        
        // 填充现有数据
        const bed = this.bedData[bedId] || { patientName: '', status: 'empty', remarks: '' };
        document.getElementById('patient-name').value = bed.patientName || '';
        document.getElementById('bed-status').value = bed.status || 'empty';
        document.getElementById('bed-remarks').value = bed.remarks || '';
        
        // 检查是否是加床，显示删除按钮
        const isAdditionalBed = this.additionalBeds.some(b => b.id === bedId);
        const deleteBtn = document.getElementById('delete-bed-btn');
        if (deleteBtn) {
            deleteBtn.style.display = isAdditionalBed ? 'inline-block' : 'none';
        }
        
        modal.style.display = 'block';
    }
    
    // 创建床位编辑模态框
    createBedModal() {
        const modal = document.createElement('div');
        modal.id = 'bed-modal';
        modal.className = 'modal';
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div class="modal-content" style="background-color: white; margin: 15% auto; padding: 20px; width: 350px; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                <h3>床位信息 - <span id="modal-bed-id"></span></h3>
                <div class="form-group" style="margin-bottom: 10px;">
                    <label for="patient-name">患者床号:</label>
                    <input type="text" id="patient-name" placeholder="输入患者床号" style="width: 100%; padding: 10px; margin-top: 5px;">
                </div>
                <div class="form-group" style="margin-bottom: 10px;">
                    <label for="bed-status">床位状态:</label>
                    <select id="bed-status" style="width: 100%; padding: 10px; margin-top: 5px;">
                        <option value="empty">空床</option>
                        <option value="occupied">占用</option>
                        <option value="discharge_planned">拟出院</option>
                    </select>
                </div>
                <div class="form-group" style="margin-bottom: 10px;">
                    <label for="bed-remarks">备注:</label>
                    <textarea id="bed-remarks" rows="3" style="width: 100%; padding: 5px; margin-top: 5px;"></textarea>
                </div>
                <div class="modal-buttons" style="text-align: right; margin-top: 20px;">
                    <button id="delete-bed-btn" style="float: left; padding: 8px 15px; background-color: #ff4d4f; color: white; border: none; border-radius: 3px; cursor: pointer;">删除床位</button>
                    <button id="clear-btn" style="margin-right: 5px; padding: 8px 15px; background-color: #d9d9d9; border: none; border-radius: 3px; cursor: pointer;">清空</button>
                    <button id="cancel-btn" style="margin-right: 5px; padding: 8px 15px; background-color: #d9d9d9; border: none; border-radius: 3px; cursor: pointer;">取消</button>
                    <button id="confirm-btn" style="padding: 8px 15px; background-color: #007acc; color: white; border: none; border-radius: 3px; cursor: pointer;">确认</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 绑定事件
        document.getElementById('confirm-btn').addEventListener('click', () => this.saveBedData());
        document.getElementById('cancel-btn').addEventListener('click', () => this.closeModal());
        document.getElementById('clear-btn').addEventListener('click', () => this.clearBedData());
        document.getElementById('delete-bed-btn').addEventListener('click', () => this.deleteCurrentBed());
        
        // 点击模态框外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }
    
    // 保存床位数据
    saveBedData() {
        const bedId = document.getElementById('modal-bed-id').textContent;
        this.bedData[bedId] = {
            patientName: document.getElementById('patient-name').value,
            status: document.getElementById('bed-status').value,
            remarks: document.getElementById('bed-remarks').value
        };
        
        this.saveData();
        this.closeModal();
        this.render();
    }
    
    // 清空床位数据
    clearBedData() {
        const bedId = document.getElementById('modal-bed-id').textContent;
        this.bedData[bedId] = {
            patientName: '',
            status: 'empty',
            remarks: ''
        };
        
        this.saveData();
        this.closeModal();
        this.render();
    }
    
    // 删除当前床位
    deleteCurrentBed() {
        const bedId = document.getElementById('modal-bed-id').textContent;
        this.closeModal();
        this.deleteBed(bedId);
    }
    
    // 关闭模态框
    closeModal() {
        const modal = document.getElementById('bed-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // 获取所有床位（包括加床）
    getAllBeds() {
        return [...this.config.beds, ...this.additionalBeds];
    }
    
    // 获取床位总数
    getTotalBedCount() {
        return this.config.beds.length + this.additionalBeds.length;
    }
    
    // 获取使用中的床位数
    getOccupiedBedCount() {
        let count = 0;
        Object.values(this.bedData).forEach(bed => {
            if (bed.status === 'occupied' || bed.status === 'discharge_planned') {
                count++;
            }
        });
        return count;
    }
    
    // 获取空床数
    getEmptyBedCount() {
        return this.getTotalBedCount() - this.getOccupiedBedCount();
    }
    
    // 数据同步
    syncAllBedData() {
        let hasChanges = false;
        
        Object.keys(this.bedData).forEach(bedId => {
            const bedData = this.bedData[bedId];
            const hasPatient = bedData.patientName && bedData.patientName.trim() !== '';
            
            if (hasPatient && bedData.status === 'empty') {
                this.bedData[bedId].status = 'occupied';
                hasChanges = true;
            } else if (!hasPatient && bedData.status !== 'empty') {
                this.bedData[bedId].status = 'empty';
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            this.saveData();
            this.render();
        }
    }
}

// 导出床位管理器类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BedManager;
} else {
    window.BedManager = BedManager;
}
