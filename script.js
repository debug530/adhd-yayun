// ADHD生活Bingo - 修复随机放置逻辑 v1.5
// 修复：每个未完成任务独立从库里随机获取一次

class ADHDBingo {
    constructor() {
        this.cells = Array(16).fill().map(() => ({ text: '', completed: false }));
        this.templates = {
            daily: ['规律睡眠','晒太阳','出门走走','喝2杯水','吃早餐','整理床铺','洗澡','刷牙','呼吸新鲜空气','与人交谈','整理物品','放松10分钟','记录心情','适量运动','阅读15分钟','早睡','整理衣柜','打扫房间','洗衣服','倒垃圾','浇花植物','整理书架','清理冰箱','洗碗','购物清单','支付账单','预约医生','联系家人','学习烹饪','尝试新菜','整理照片','写日记'],
            work: ['专注25分钟','学习新知识','整理桌面','输出内容','制定计划','回顾进度','断舍离','整理文件','邮件处理','会议准备','技能练习','项目推进','问题解决','团队沟通','文档整理','总结复盘','阅读专业文章','学习新软件','整理笔记','制定周计划','参加培训','分享知识','优化流程','备份数据','清理邮箱','更新简历','学习外语','练习演讲','研究案例','分析数据','制作图表','撰写报告'],
            relax: ['看电影','听音乐','泡茶喝','晒太阳','深呼吸','伸展身体','冥想5分钟','涂鸦','看云发呆','闻花香','抱抱宠物','写日记','整理照片','做手工','泡澡','小睡片刻','听播客','画画','弹乐器','做瑜伽','散步公园','逛书店','喝咖啡','做按摩','玩拼图','做园艺','看星星','写诗歌','整理音乐','看纪录片','练习书法','做伸展']
        };
        this.currentTemplate = 'daily';
        this.quickPhrases = ['喝2杯水','整理桌面','运动15min','专注25min','出门走走','晒太阳','深呼吸','记录心情'];
        this.editingCellIndex = null;
        this.bingoPatterns = [[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15],[0,4,8,12],[1,5,9,13],[2,6,10,14],[3,7,11,15],[0,5,10,15],[3,6,9,12]];
        this.completedBingos = new Set();
        this.init();
    }
    
    init() {
        this.loadFromStorage();
        this.renderBoard();
        this.setupEventListeners();
        this.updateStats();
    }
    
    renderBoard() {
        const board = document.getElementById('bingoBoard');
        if (!board) return;
        board.innerHTML = '';
        this.cells.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'bingo-cell';
            cellElement.dataset.index = index;
            if (cell.completed) {
                cellElement.classList.add('completed');
                if (index % 2 === 0) cellElement.classList.add('alt');
            }
            cellElement.textContent = cell.text || `任务 ${index + 1}`;
            cellElement.addEventListener('click', (e) => this.handleCellClick(index, e));
            cellElement.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.openEditModal(index);
            });
            let pressTimer;
            cellElement.addEventListener('touchstart', (e) => {
                pressTimer = setTimeout(() => this.openEditModal(index), 500);
            });
            cellElement.addEventListener('touchend', () => clearTimeout(pressTimer));
            cellElement.addEventListener('touchmove', () => clearTimeout(pressTimer));
            board.appendChild(cellElement);
        });
    }
    
    handleCellClick(index, event) {
        if (event.type === 'click' && event.detail === 0) return;
        this.cells[index].completed = !this.cells[index].completed;
        this.saveToStorage();
        this.renderBoard();
        this.checkBingo();
        this.updateStats();
        const cell = document.querySelector(`.bingo-cell[data-index="${index}"]`);
        if (cell) {
            cell.style.animation = 'none';
            setTimeout(() => cell.style.animation = 'cellComplete 0.5s ease', 10);
        }
    }
    
    // 修复的随机放置功能 - 每个未完成任务独立随机获取
    randomPlaceTasks() {
        console.log('🎲 随机放置功能被调用 - 修复版');
        
        // 获取当前模板的所有任务
        const allTasks = [...this.templates[this.currentTemplate]];
        console.log(`📚 当前模板"${this.currentTemplate}"有 ${allTasks.length} 个任务`);
        
        // 分离已完成和未完成的格子
        const completedIndices = [];
        const uncompletedIndices = [];
        
        this.cells.forEach((cell, index) => {
            if (cell.completed) {
                completedIndices.push(index);
            } else {
                uncompletedIndices.push(index);
            }
        });
        
        console.log(`✅ 已完成格子: ${completedIndices.length} 个 (保持不变)`);
        console.log(`🔄 未完成格子: ${uncompletedIndices.length} 个 (需要重新分配)`);
        
        // 关键修复：每个未完成任务独立从库里随机获取一次
        uncompletedIndices.forEach(index => {
            // 从32个任务中随机选择一个
            const randomIndex = Math.floor(Math.random() * allTasks.length);
            const randomTask = allTasks[randomIndex];
            
            // 分配随机任务
            this.cells[index].text = randomTask;
            console.log(`📝 格子 ${index} 获得随机任务: ${randomTask}`);
        });
        
        // 保存并重新渲染
        this.saveToStorage();
        this.renderBoard();
        this.updateStats();
        
        this.showNotification('🎲 任务已随机重新放置！每个未完成任务都从库里独立随机获取。');
    }
    
    applyTemplate(templateName) {
        if (!this.templates[templateName]) return;
        if (!confirm(`确定要应用"${templateName}"模板吗？这将覆盖当前所有任务。`)) return;
        this.currentTemplate = templateName;
        const allTasks = [...this.templates[templateName]];
        const shuffledTasks = [...allTasks].sort(() => Math.random() - 0.5);
        const selectedTasks = shuffledTasks.slice(0, 16);
        selectedTasks.forEach((text, index) => {
            this.cells[index].text = text;
            this.cells[index].completed = false;
        });
        this.completedBingos.clear();
        this.saveToStorage();
        this.renderBoard();
        this.updateStats();
        this.showNotification(`✅ 已应用"${templateName}"模板！从32个任务中随机选择了16个。`);
    }
    
    openEditModal(index) {
        this.editingCellIndex = index;
        const cell = this.cells[index];
        const modal = document.getElementById('editModal');
        const input = document.getElementById('taskInput');
        const charCount = document.getElementById('charCount');
        if (!modal || !input || !charCount) return;
        input.value = cell.text;
        charCount.textContent = cell.text.length;
        modal.style.display = 'flex';
        input.focus();
    }
    
    closeEditModal() {
        const modal = document.getElementById('editModal');
        if (modal) modal.style.display = 'none';
        this.editingCellIndex = null;
    }
    
    saveEdit() {
        if (this.editingCellIndex === null) return;
        const input = document.getElementById('taskInput');
        if (!input) return;
        const text = input.value.trim().slice(0, 10);
        this.cells[this.editingCellIndex].text = text;
        this.saveToStorage();
        this.renderBoard();
        this.closeEditModal();
    }
    
    clearCellText() {
        if (this.editingCellIndex === null) return;
        this.cells[this.editingCellIndex].text = '';
        this.saveToStorage();
        this.renderBoard();
        this.closeEditModal();
    }
    
    checkBingo() {
        const newBingos = new Set();
        this.bingoPatterns.forEach((pattern, patternIndex) => {
            if (this.completedBingos.has(patternIndex)) return;
            const isComplete = pattern.every(index => this.cells[index].completed);
            if (isComplete) {
                this.completedBingos.add(patternIndex);
                newBingos.add(patternIndex);
            }
        });
        if (newBingos.size > 0) this.showBingoCelebration();
    }
    
    showBingoCelebration() {
        const celebration = document.getElementById('bingoCelebration');
        if (celebration) celebration.style.display = 'flex';
        setTimeout(() => {
            if (celebration) celebration.style.display = 'none';
        }, 3000);
    }
    
    resetBoard() {
        if (!confirm('确定要重置棋盘吗？这将清空所有完成状态，但保留任务文字。')) return;
        this.cells.forEach(cell => cell.completed = false);
        this.completedBingos.clear();
        this.saveToStorage();
        this.renderBoard();
        this.updateStats();
        this.showNotification('🔄 棋盘已重置！');
    }
    
    clearAllTasks() {
        if (!confirm('确定要清空所有任务吗？这将删除所有任务文字和完成状态。')) return;
        this.cells.forEach(cell => {
            cell.text = '';
            cell.completed = false;
        });
        this.completedBingos.clear();
        this.saveToStorage();
        this.renderBoard();
        this.updateStats();
        this.showNotification('🗑️ 所有任务已清空！');
    }
    
    updateStats() {
        const completedCount = this.cells.filter(cell => cell.completed).length;
        const bingoCount = this.completedBingos.size;
        const progressPercent = Math.round((completedCount / 16) * 100);
        const completedCountEl = document.getElementById('completedCount');
        const bingoCountEl = document.getElementById('bingoCount');
        const progressPercentEl = document.getElementById('progressPercent');
        if (completedCountEl) completedCountEl.textContent = completedCount;
        if (bingoCountEl) bingoCountEl.textContent = bingoCount;
        if (progressPercentEl) progressPercentEl.textContent = `${progressPercent}%`;
    }
    
    shareStatus() {
        const shareModal = document.getElementById('shareModal');
        const sharePreview = document.getElementById('sharePreview');
        if (!shareModal || !sharePreview) return;
        const completedCount = this.cells.filter(cell => cell.completed).length;
        const bingoCount = this.completedBingos.size;
        let shareText = `🎯 ADHD生活Bingo 进度报告\n`;
        shareText += `✅ 已完成: ${completedCount}/16\n`;
        shareText += `🎉 Bingo线: ${bingoCount}\n`;
        shareText += `📅 ${new Date().toLocaleDateString('zh-CN')}\n\n`;
        const completedTasks = this.cells
            .filter(cell => cell.completed && cell.text)
            .map(cell => `✓ ${cell.text}`);
        if (completedTasks.length > 0) {
            shareText += '今日成就:\n';
            shareText += completedTasks.join('\n');
        }
        sharePreview.textContent = shareText;
        shareModal.style.display = 'flex';
    }
    
    saveToStorage() {
        const data = {
            cells: this.cells,
            currentTemplate: this.currentTemplate,
            completedBingos: Array.from(this.completedBingos),
            timestamp: Date.now()
        };
        localStorage.setItem('adhd-bingo-data', JSON.stringify(data));
    }
    
    loadFromStorage() {
        const saved = localStorage.getItem('adhd-bingo-data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.cells = data.cells || this.cells;
                this.currentTemplate = data.currentTemplate || 'daily';
                this.completedBingos = new Set(data.completedBingos || []);
            } catch (e) {
                console.error('加载保存数据失败:', e);
            }
        }
    }
    
    showNotification(message) {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) notification.remove();
                }, 300);
            }
        }, 3000);
    }
    
    setupEventListeners() {
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', () => this.applyTemplate(btn.dataset.template));
        });
        const randomPlaceBtn = document.getElementById('randomPlaceBtn');
        if (randomPlaceBtn) randomPlaceBtn.addEventListener('click', () => this.randomPlaceTasks());
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetBoard());
        const clearAllBtn = document.getElementById('clearAllBtn');
        if (clearAllBtn) clearAllBtn.addEventListener('click', () => this.clearAllTasks());
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) shareBtn.addEventListener('click', () => this.shareStatus());
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) saveBtn.addEventListener('click', () => this.saveEdit());
        const clearTextBtn = document.getElementById('clearTextBtn');
        if (clearTextBtn) clearTextBtn.addEventListener('click', () => this.clearCellText());
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeEditModal());
        const taskInput = document.getElementById('taskInput');
        if (taskInput) {
            taskInput.addEventListener('input', () => {
                const charCount = document.getElementById('charCount');
                if (charCount) charCount.textContent = taskInput.value.length;
                if (taskInput.value.length > 10) {
                    taskInput.value = taskInput.value.slice(0, 10);
                    this.showNotification('最多只能输入10个字哦！');
                }
            });
            taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.saveEdit();
            });
        }
        const closeShareBtn = document.getElementById('closeShareBtn');
        if (closeShareBtn) {
            closeShareBtn.addEventListener('click', () => {
                const shareModal = document.getElementById('shareModal');
                if (shareModal) shareModal.style.display = 'none';
            });
        }
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    if (modal.id === 'editModal') this.editingCellIndex = null;
                }
            });
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeEditModal();
                const shareModal = document.getElementById('shareModal');
                if (shareModal) shareModal.style.display = 'none';
            }
        });
    }
    
    static initApp() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification {
                position: fixed; top: 20px; right: 20px;
                background: var(--primary-color); color: white;
                padding: 12px 20px; border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 3000;
                animation: slideInRight 0.3s ease;
            }
        `;
        document.head.appendChild(style);
        window.bingoApp = new ADHDBingo();
        setTimeout(() => {
            if (!localStorage.getItem('adhd-bingo-first-visit')) {
                window.bingoApp.showNotification('欢迎使用ADHD生活Bingo！点击格子标记完成，长按编辑任务。');
                localStorage.setItem('adhd-bingo-first-visit', 'true');
            }
        }, 1000);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ADHDBingo.initApp);
} else {
    ADHDBingo.initApp();
}