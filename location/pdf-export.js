// PDF导出功能 - 使用html2canvas截图
function generateRoomPDF(roomNumber) {
    // 创建临时容器包含所有需要导出的元素
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.padding = '20px';
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.boxSizing = 'border-box';
    
    // 获取并验证元素
    const originalTitle = document.querySelector('.room-title');
    const originalContainer = document.querySelector(`#room${roomNumber}-container`);
    const originalSignature = document.querySelector('.signature-box');
    
    console.log('Original elements:', {
        title: originalTitle,
        container: originalContainer, 
        signature: originalSignature
    });
    
    if (!originalTitle || !originalContainer || !originalSignature) {
        console.error('Missing required elements for PDF export');
        return;
    }

    // 深度克隆元素
    const roomTitle = originalTitle.cloneNode(true);
    const roomContainer = originalContainer.cloneNode(true);
    const signatureBox = originalSignature.cloneNode(true);
    
    // 复制计算后的样式
    const titleStyles = window.getComputedStyle(originalTitle);
    const containerStyles = window.getComputedStyle(originalContainer);
    const signatureStyles = window.getComputedStyle(originalSignature);
    
    // 应用样式到克隆元素
    for (let i = 0; i < titleStyles.length; i++) {
        const prop = titleStyles[i];
        roomTitle.style[prop] = titleStyles.getPropertyValue(prop);
    }
    
    for (let i = 0; i < containerStyles.length; i++) {
        const prop = containerStyles[i];
        roomContainer.style[prop] = containerStyles.getPropertyValue(prop);
    }
    
    for (let i = 0; i < signatureStyles.length; i++) {
        const prop = signatureStyles[i];
        signatureBox.style[prop] = signatureStyles.getPropertyValue(prop);
    }
    
    // 确保克隆元素可见
    roomTitle.style.display = '';
    roomTitle.style.visibility = 'visible';
    roomContainer.style.display = '';
    roomContainer.style.visibility = 'visible';
    signatureBox.style.display = '';
    signatureBox.style.visibility = 'visible';
    
    // 添加到临时容器
    tempContainer.appendChild(roomTitle);
    tempContainer.appendChild(roomContainer);
    tempContainer.appendChild(signatureBox);
    document.body.appendChild(tempContainer);

    // 添加短暂延迟确保元素渲染完成
    setTimeout(() => {
        // 获取原始容器的尺寸
        const originalContainerWidth = originalContainer.offsetWidth;
        const originalContainerHeight = originalContainer.offsetHeight;
        
        // 设置临时容器的尺寸与原始容器一致
        tempContainer.style.width = originalContainerWidth + 40 + 'px'; // 加上padding
        tempContainer.style.height = 'auto';
        
        // 等待一帧确保尺寸更新
        requestAnimationFrame(() => {
            html2canvas(tempContainer, {
                scale: 2,
                useCORS: true,
                logging: true,
                backgroundColor: '#FFFFFF',
                allowTaint: true,
                // 移除ignoreElements以避免过滤掉所有元素
                width: tempContainer.scrollWidth,
                height: tempContainer.scrollHeight
            }).then(canvas => {
                // 移除临时容器
                document.body.removeChild(tempContainer);
                const imageData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                
                // 根据内容尺寸计算PDF页面尺寸
                const canvasWidth = canvas.width / 2; // 由于scale=2
                const canvasHeight = canvas.height / 2; // 由于scale=2
                const orientation = canvasWidth > canvasHeight ? 'l' : 'p';
                const doc = new jsPDF(orientation, 'px', [canvasWidth, canvasHeight]);

                // 将截图添加到PDF
                doc.addImage(imageData, 'PNG', 0, 0, canvasWidth, canvasHeight);

                // 保存PDF文件
                const now = new Date();
                const filename = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${roomNumber}室床位分布.pdf`;
                doc.save(filename);
            }).catch(error => {
                // 移除临时容器
                document.body.removeChild(tempContainer);
                console.error('PDF generation failed:', error);
            });
        });
    }, 500); // 增加延迟确保渲染完成
}

function getStatusText(status) {
    const statusMap = {
        'empty': '空床',
        'occupied': '占用',
        'discharge_planned': '拟出院'
    };
    return statusMap[status] || status;
}

// 为房间绑定导出按钮事件
function bindPDFExportButton(roomNumber) {
    const exportBtn = document.getElementById('pdf-export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            generateRoomPDF(roomNumber);
        });
    } else {
        console.error('Could not find PDF export button');
    }
}
