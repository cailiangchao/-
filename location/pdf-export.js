// PDF导出功能 - 使用html2canvas截图
function generateRoomPDF(roomNumber) {
    const roomContainer = document.querySelector(`#room${roomNumber}-container`);
    if (!roomContainer) {
        console.error('Room container not found!');
        return;
    }

    html2canvas(roomContainer, {
        scale: 2, // 提高截图清晰度
        useCORS: true // 允许加载跨域图片（如果有）
    }).then(canvas => {
        const imageData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        
        // 根据容器尺寸计算PDF页面尺寸
        const containerWidth = roomContainer.offsetWidth;
        const containerHeight = roomContainer.offsetHeight;
        const orientation = containerWidth > containerHeight ? 'l' : 'p'; // landscape or portrait
        const doc = new jsPDF(orientation, 'px', [containerWidth, containerHeight]);

        // 将截图添加到PDF
        doc.addImage(imageData, 'PNG', 0, 0, containerWidth, containerHeight);

        // 保存PDF文件
        const now = new Date();
        const filename = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${roomNumber}室床位分布.pdf`;
        doc.save(filename);
    });
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
