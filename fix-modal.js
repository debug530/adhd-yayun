// 修复编辑模态框在手机上的显示问题

function fixModalForMobile() {
    const editModal = document.getElementById('editModal');
    const modalContent = editModal.querySelector('.modal-content');
    const taskInput = document.getElementById('taskInput');
    
    if (!editModal || !modalContent) return;
    
    // 检测是否为移动设备
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        // 移动设备优化
        editModal.style.alignItems = 'flex-start';
        editModal.style.paddingTop = '10vh';
        editModal.style.overflowY = 'auto';
        
        // 确保模态框内容不会太大
        modalContent.style.maxHeight = '70vh';
        modalContent.style.overflowY = 'auto';
        modalContent.style.marginTop = '0';
        
        // 输入框优化（防止iOS缩放）
        if (taskInput) {
            taskInput.style.fontSize = '16px';
            taskInput.setAttribute('inputmode', 'text');
        }
        
        // 监听窗口大小变化
        window.addEventListener('resize', adjustModalPosition);
    }
    
    // 调整模态框位置
    function adjustModalPosition() {
        const viewportHeight = window.innerHeight;
        const modalHeight = modalContent.offsetHeight;
        
        if (modalHeight > viewportHeight * 0.8) {
            modalContent.style.maxHeight = (viewportHeight * 0.7) + 'px';
        }
        
        // 如果是横屏
        if (window.innerWidth > window.innerHeight) {
            modalContent.style.maxWidth = '400px';
            modalContent.style.margin = '5vh auto';
        } else {
            modalContent.style.maxWidth = '95%';
            modalContent.style.margin = '10vh auto 0';
        }
    }
    
    // 初始调整
    setTimeout(adjustModalPosition, 100);
    
    // 监听键盘弹出（移动端）
    if ('visualViewport' in window) {
        window.visualViewport.addEventListener('resize', function() {
            if (editModal.style.display === 'flex') {
                adjustModalPosition();
            }
        });
    }
}

// 在编辑模态框打开时调用
function setupModalFix() {
    const originalOpenEditModal = window.bingoApp ? window.bingoApp.openEditModal : null;
    
    if (window.bingoApp && originalOpenEditModal) {
        // 重写openEditModal方法
        window.bingoApp.openEditModal = function(index) {
            // 调用原始方法
            originalOpenEditModal.call(this, index);
            
            // 应用修复
            setTimeout(fixModalForMobile, 50);
            
            // 自动滚动到可视区域（移动端）
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                setTimeout(() => {
                    const modal = document.getElementById('editModal');
                    if (modal) {
                        modal.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            }
        };
    }
    
    // 也直接监听模态框显示
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const modal = document.getElementById('editModal');
                if (modal && modal.style.display === 'flex') {
                    setTimeout(fixModalForMobile, 50);
                }
            }
        });
    });
    
    const editModal = document.getElementById('editModal');
    if (editModal) {
        observer.observe(editModal, { attributes: true });
    }
}

// 页面加载完成后设置
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupModalFix);
} else {
    setupModalFix();
}

// 导出函数
window.fixModalForMobile = fixModalForMobile;
window.setupModalFix = setupModalFix;