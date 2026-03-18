// 更新：处理编辑界面中的快捷短语

function setupEditPhraseButtons() {
    // 为编辑界面中的快捷短语按钮添加事件
    document.querySelectorAll('.edit-phrase-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const phrase = this.getAttribute('data-phrase');
            const input = document.getElementById('taskInput');
            
            if (input) {
                // 获取当前光标位置
                const start = input.selectionStart;
                const end = input.selectionEnd;
                const currentText = input.value;
                
                // 插入短语到光标位置
                const newText = currentText.substring(0, start) + phrase + currentText.substring(end);
                input.value = newText;
                
                // 更新字符计数
                const charCount = document.getElementById('charCount');
                if (charCount) {
                    charCount.textContent = newText.length;
                    
                    // 如果超过10字，截断并提示
                    if (newText.length > 10) {
                        input.value = newText.substring(0, 10);
                        charCount.textContent = 10;
                        if (window.bingoApp) {
                            window.bingoApp.showNotification('最多只能输入10个字哦！');
                        }
                    }
                }
                
                // 移动光标到插入位置之后
                const newCursorPos = start + phrase.length;
                input.setSelectionRange(newCursorPos, newCursorPos);
                input.focus();
                
                // 添加点击反馈
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
}

// 修改原有的openEditModal方法以支持快捷短语
function enhanceEditModal() {
    if (!window.bingoApp) return;
    
    const originalOpenEditModal = window.bingoApp.openEditModal;
    
    if (originalOpenEditModal) {
        window.bingoApp.openEditModal = function(index) {
            // 调用原始方法
            originalOpenEditModal.call(this, index);
            
            // 设置快捷短语按钮
            setTimeout(setupEditPhraseButtons, 50);
            
            // 确保输入框获得焦点
            setTimeout(() => {
                const input = document.getElementById('taskInput');
                if (input) {
                    input.focus();
                    // 如果是空输入框，将光标放在开头
                    if (!input.value) {
                        input.setSelectionRange(0, 0);
                    }
                }
            }, 100);
        };
    }
}

// 移除原有的快捷短语相关代码
function removeOldQuickPhrases() {
    // 原有的快捷短语功能在script.js中，这里我们通过重写方法来覆盖
    if (window.bingoApp && window.bingoApp.addQuickPhrase) {
        // 保留方法但不做任何事情（因为现在在编辑界面中处理）
        window.bingoApp.addQuickPhrase = function() {
            // 空实现，因为功能已移动到编辑界面
        };
    }
}

// 初始化
function initEditPhrases() {
    // 页面加载完成后设置
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                enhanceEditModal();
                removeOldQuickPhrases();
                setupEditPhraseButtons();
            }, 1000);
        });
    } else {
        setTimeout(() => {
            enhanceEditModal();
            removeOldQuickPhrases();
            setupEditPhraseButtons();
        }, 1000);
    }
}

// 导出函数
window.setupEditPhraseButtons = setupEditPhraseButtons;
window.enhanceEditModal = enhanceEditModal;
window.initEditPhrases = initEditPhrases;

// 自动初始化
initEditPhrases();