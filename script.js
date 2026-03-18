// ADHD生活Bingo - 主逻辑文件

class ADHDBingo {
    constructor() {
        // 初始化状态
        this.cells = Array(16).fill().map(() => ({
            text: '',
            completed: false
        }));
        
        // 预设模板
        this.templates = {
            daily: [
                '规律睡眠', '晒太阳', '出门走走', '喝2杯水',
                '吃早餐', '整理床铺', '洗澡', '刷牙',
                '呼吸新鲜空气', '与人交谈', '整理物品', '放松10分钟',
                '记录心情', '适量运动', '阅读15分钟', '早睡'
            ],
            work: [
                '专注25分钟', '学习新知识', '整理桌面', '输出内容',
                '制定计划', '回顾进度', '断舍离', '整理文件',
                '邮件处理', '会议准备', '技能练习', '项目推进',
                '问题解决', '团队沟通', '文档整理', '总结复盘'
            ],
            relax: [
                '看电影', '听音乐', '泡茶喝', '晒太阳',
                '深呼吸', '伸展身体', '冥想5分钟', '涂鸦',
                '看云发呆', '闻花香', '抱抱宠物', '写日记',
                '整理照片', '做手工', '泡澡', '小睡片刻'
            ]
        };
        
        // 快捷短语
        this.quickPhrases = [
            '喝2杯水', '整理桌面', '运动15min', '专注25min',
            '出门走走', '晒太阳', '深呼吸', '记录心情'
        ];
        
        // 当前编辑的格子索引
        this.editingCellIndex = null;
        
        // Bingo线检测模式
        this.bingoPatterns = [
            // 横向
            [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15],
            // 纵向
            [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15],
            // 对角线
            [0, 5, 10, 15], [3, 6, 9, 12]
        ];
        
        // 已完成的Bingo线
        this.completedBingos = new Set();
        
        this.init();
    }
    
    init() {
        this.loadFromStorage();
        this.renderBoard();
        this.setupEventListeners();
        this.updateStats();
    }
    
    // 渲染Bingo棋盘
    renderBoard() {
        const board = document.getElementById('bingoBoard');
        board.innerHTML = '';
        
        this.cells.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'bingo-cell';
            cellElement.dataset.index = index;
            
            // 交替使用两种完成颜色
            if (cell.completed) {
                cellElement.classList.add('completed');
                if (index % 2 === 0) {
                    cellElement.classList.add('alt');
                }
            }
            
            // 显示任务文字或占位符
            cellElement.textContent = cell.text || `任务 ${index + 1}`;
            
            // 添加点击事件
            cellElement.addEventListener('click', (e) => this.handleCellClick(index, e));
            cellElement.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.openEditModal(index);
            });
            
            // 长按编辑（移动端）
            let pressTimer;
            cellElement.addEventListener('touchstart', (e) => {
                pressTimer = setTimeout(() => {
                    this.openEditModal(index);
                }, 500);
            });
            
            cellElement.addEventListener('touchend', () => {
                clearTimeout(pressTimer);
            });
            
            cellElement.addEventListener('touchmove', () => {
                clearTimeout(pressTimer);
            });
            
            board.appendChild(cellElement);
        });
    }
    
    // 处理格子点击
    handleCellClick(index, event) {
        // 防止长按触发点击
        if (event.type === 'click' && event.detail === 0) return;
        
        // 切换完成状态
        this.cells[index].completed = !this.cells[index].completed;
        
        // 保存到本地存储
        this.saveToStorage();
        
        // 重新渲染
        this.renderBoard();
        
        // 检查Bingo
        this.checkBingo();
        
        // 更新统计
        this.updateStats();
        
        // 添加点击动画
        const cell = document.querySelector(`.bingo-cell[data-index="${index}"]`);
        cell.style.animation = 'none';
        setTimeout(() => {
            cell.style.animation = 'cellComplete 0.5s ease';
        }, 10);
    }
    
    // 打开编辑模态框
    openEditModal(index) {
        this.editingCellIndex = index;
        const cell = this.cells[index];
        const modal = document.getElementById('editModal');
        const input = document.getElementById('taskInput');
        const charCount = document.getElementById('charCount');
        
        input.value = cell.text;
        charCount.textContent = cell.text.length;
        
        modal.style.display = 'flex';
        input.focus();
    }
    
    // 关闭编辑模态框
    closeEditModal() {
        document.getElementById('editModal').style.display = 'none';
        this.editingCellIndex = null;
    }
    
    // 保存编辑
    saveEdit() {
        if (this.editingCellIndex === null) return;
        
        const input = document.getElementById('taskInput');
        const text = input.value.trim().slice(0, 10); // 限制10字
        
        this.cells[this.editingCellIndex].text = text;
        this.saveToStorage();
        this.renderBoard();
        this.closeEditModal();
    }
    
    // 清空当前格子的文字
    clearCellText() {
        if (this.editingCellIndex === null) return;
        
        this.cells[this.editingCellIndex].text = '';
        this.saveToStorage();
        this.renderBoard();
        this.closeEditModal();
    }
    
    // 应用模板
    applyTemplate(templateName) {
        if (!this.templates[templateName]) return;
        
        // 确认操作
        if (!confirm(`确定要应用"${templateName}"模板吗？这将覆盖当前所有任务。`)) {
            return;
        }
        
        this.templates[templateName].forEach((text, index) => {
            this.cells[index].text = text;
            this.cells[index].completed = false;
        });
        
        this.completedBingos.clear();
        this.saveToStorage();
        this.renderBoard();
        this.updateStats();
        this.showNotification('模板应用成功！');
    }
    
    // 添加快捷短语
    addQuickPhrase(phrase) {
        if (this.editingCellIndex === null) return;
        
        const input = document.getElementById('taskInput');
        const currentText = input.value.trim();
        
        if (currentText) {
            input.value = `${currentText} ${phrase}`;
        } else {
            input.value = phrase;
        }
        
        // 更新字符计数
        const charCount = document.getElementById('charCount');
        charCount.textContent = input.value.length;
        
        // 自动聚焦并选中新增部分
        input.focus();
        input.setSelectionRange(currentText.length, input.value.length);
    }
    
    // 检查Bingo
    checkBingo() {
        const newBingos = [];
        
        this.bingoPatterns.forEach((pattern, patternIndex) => {
            if (this.completedBingos.has(patternIndex)) return;
            
            const isComplete = pattern.every(index => this.cells[index].completed);
            if (isComplete) {
                this.completedBingos.add(patternIndex);
                newBingos.push(patternIndex);
            }
        });
        
        // 如果有新的Bingo，显示庆祝动画
        if (newBingos.length > 0) {
            this.showBingoCelebration();
        }
    }
    
    // 显示Bingo庆祝动画
    showBingoCelebration() {
        const celebration = document.getElementById('bingoCelebration');
        celebration.style.display = 'flex';
        
        // 2秒后自动关闭
        setTimeout(() => {
            celebration.style.display = 'none';
        }, 2000);
        
        // 播放声音（如果支持）
        this.playBingoSound();
    }
    
    // 播放Bingo声音
    playBingoSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            // 音频API不可用，静默失败
        }
    }
    
    // 重置棋盘（只清空完成状态）
    resetBoard() {
        if (!confirm('确定要重置棋盘吗？这将清空所有完成状态，但保留任务文字。')) {
            return;
        }
        
        this.cells.forEach(cell => {
            cell.completed = false;
        });
        
        this.completedBingos.clear();
        this.saveToStorage();
        this.renderBoard();
        this.updateStats();
        this.showNotification('棋盘已重置！');
    }
    
    // 清空所有任务
    clearAllTasks() {
        if (!confirm('确定要清空所有任务吗？这将删除所有任务文字和完成状态。')) {
            return;
        }
        
        this.cells.forEach(cell => {
            cell.text = '';
            cell.completed = false;
        });
        
        this.completedBingos.clear();
        this.saveToStorage();
        this.renderBoard();
        this.updateStats();
        this.showNotification('所有任务已清空！');
    }
    
    // 更新统计信息
    updateStats() {
        const completedCount = this.cells.filter(cell => cell.completed).length;
        const bingoCount = this.completedBingos.size;
        const progressPercent = Math.round((completedCount / 16) * 100);
        
        document.getElementById('completedCount').textContent = completedCount;
        document.getElementById('bingoCount').textContent = bingoCount;
        document.getElementById('progressPercent').textContent = `${progressPercent}%`;
    }
    
    // 分享功能
    shareStatus() {
        const shareModal = document.getElementById('shareModal');
        const sharePreview = document.getElementById('sharePreview');
        
        // 生成分享文本
        const completedCount = this.cells.filter(cell => cell.completed).length;
        const bingoCount = this.completedBingos.size;
        
        let shareText = `🎯 ADHD生活Bingo 进度报告\n`;
        shareText += `✅ 已完成: ${completedCount}/16\n`;
        shareText += `🎉 Bingo线: ${bingoCount}\n`;
        shareText += `📅 ${new Date().toLocaleDateString('zh-CN')}\n\n`;
        
        // 添加已完成的任务
        const completedTasks = this.cells
            .filter(cell => cell.completed && cell.text)
            .map(cell => `✓ ${cell.text}`);
        
        if (completedTasks.length > 0) {
            shareText += '今日成就:\n';
            shareText += completedTasks.join('\n');
        }
        
        sharePreview.textContent = shareText;
        shareModal.style.display = 'flex';
        
        // 保存分享数据
        this.shareData = {
            text: shareText,
            url: window.location.href,
            state: this.exportState()
        };
    }
    
    // 导出状态（用于分享）
    exportState() {
        return {
            cells: this.cells,
            timestamp: Date.now(),
            version: '1.0'
        };
    }
    
    // 复制分享链接
    copyShareLink() {
        const state = this.exportState();
        const encoded = btoa(JSON.stringify(state));
        const shareUrl = `${window.location.origin}${window.location.pathname}?state=${encoded}`;
        
        navigator.clipboard.writeText(shareUrl).then(() => {
            this.showNotification('链接已复制到剪贴板！');
        }).catch(() => {
            // 降级方案
            const textarea = document.createElement('textarea');
            textarea.value = shareUrl;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showNotification('链接已复制到剪贴板！');
        });
    }
    
    // 保存为图片（简化版）
    saveAsImage() {
        this.showNotification('图片保存功能正在开发中...');
        // 实际实现需要使用html2canvas库
    }
    
    // 本地存储
    saveToStorage() {
        try {
            localStorage.setItem('adhd-bingo-state', JSON.stringify({
                cells: this.cells,
                completedBingos: Array.from(this.completedBingos),
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('本地存储失败:', e);
        }
    }
    
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('adhd-bingo-state');
            if (saved) {
                const data = JSON.parse(saved);
                this.cells = data.cells || this.cells;
                this.completedBingos = new Set(data.completedBingos || []);
                
                // 检查数据是否过期（超过24小时）
                const oneDay = 24 * 60 * 60 * 1000;
                if (data.timestamp && Date.now() - data.timestamp > oneDay) {
                    this.showNotification('欢迎回来！昨天的进度已自动保存。');
                }
            }
        } catch (e) {
            console.warn('加载存储失败:', e);
        }
    }
    
    // 显示通知
    showNotification(message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 3000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // 设置事件监听器
    setupEventListeners() {
        // 模板按钮
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.applyTemplate(btn.dataset.template);
            });
        });
        
        // 快捷短语按钮
        document.querySelectorAll('.phrase-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.addQuickPhrase(btn.textContent);
            });
        });
        
        // 控制按钮
        document.getElementById('resetBtn').addEventListener('click', () => this.resetBoard());
        document.getElementById('clearAllBtn').addEventListener('click', () => this.clearAllTasks());
        document.getElementById('exportBtn').addEventListener('click', () => this.shareStatus());
        
        // 编辑模态框
        document.getElementById('saveBtn').addEventListener('click', () => this.saveEdit());
        document.getElementById('clearTextBtn').addEventListener('click', () => this.clearCellText());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeEditModal());
        
        // 任务输入框
        const taskInput = document.getElementById('taskInput');
        taskInput.addEventListener('input', () => {
            const charCount = document.getElementById('charCount');
            charCount.textContent = taskInput.value.length;
            
            // 限制10个字
            if (taskInput.value.length > 10) {
                taskInput.value = taskInput.value.slice(0, 10);
                this.showNotification('最多只能输入10个字哦！');
            }
        });
        
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveEdit();
            }
        });
        
        // 分享模态框
        document.getElementById('copyLinkBtn').addEventListener('click', () => this.copyShareLink());
        document.getElementById('saveImageBtn').addEventListener('click', () => this.saveAsImage());
        document.getElementById('closeShareBtn').addEventListener('click', () => {
            document.getElementById('shareModal').style.display = 'none';
        });
        
        // 点击模态框外部关闭
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    if (modal.id === 'editModal') {
                        this.editingCellIndex = null;
                    }
                }
            });
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeEditModal();
                document.getElementById('shareModal').style.display = 'none';
            }
            
            // Ctrl+S 保存编辑
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveEdit();
            }
        });
        
        // PWA安装提示
        this.setupPWA();
        
        // 离线检测
        this.setupOfflineDetection();
    }
    
    // PWA支持
    setupPWA() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(error => {
                    console.log('ServiceWorker 注册失败:', error);
                });
            });
        }
        
        // 显示安装提示
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // 可以在这里显示安装按钮
            setTimeout(() => {
                if (deferredPrompt && confirm('是否要将ADHD生活Bingo安装到主屏幕？')) {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            this.showNotification('已成功安装到主屏幕！');
                        }
                        deferredPrompt = null;
                    });
                }
            }, 5000);
        });
    }
    
    // 离线检测
    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.showNotification('网络已恢复连接！');
        });
        
        window.addEventListener('offline', () => {
            this.showNotification('当前处于离线模式，数据将保存在本地。');
        });
    }
    
    // 初始化应用
    static initApp() {
        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--primary-color);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 3000;
                animation: slideInRight 0.3s ease;
            }
        `;
        document.head.appendChild(style);
        
        // 创建应用实例
        window.bingoApp = new ADHDBingo();
        
        // 显示欢迎信息
        setTimeout(() => {
            if (!localStorage.getItem('adhd-bingo-first-visit')) {
                window.bingoApp.showNotification('欢迎使用ADHD生活Bingo！点击格子标记完成，长按编辑任务。');
                localStorage.setItem('adhd-bingo-first-visit', 'true');
            }
        }, 1000);
    }
}

// 页面加载完成后初始化应用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ADHDBingo.initApp);
} else {
    ADHDBingo.initApp();
}

// 导出到全局
window.ADHDBingo = ADHDBingo;