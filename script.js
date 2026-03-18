// ADHD生活Bingo - 修复随机放置功能 v1.1
// 修复内容：
// 1. 为随机放置按钮添加事件监听
// 2. 扩展每个模板至32个任务
// 3. 实现随机放置算法：保持已完成任务不变，从未完成任务中随机分配

class ADHDBingo {
    constructor() {
        // 初始化状态
        this.cells = Array(16).fill().map(() => ({
            text: '',
            completed: false
        }));
        
        // 扩展模板：每个模式32个任务
        this.templates = {
            daily: [
                '规律睡眠', '晒太阳', '出门走走', '喝2杯水',
                '吃早餐', '整理床铺', '洗澡', '刷牙',
                '呼吸新鲜空气', '与人交谈', '整理物品', '放松10分钟',
                '记录心情', '适量运动', '阅读15分钟', '早睡',
                // 新增16个日常任务
                '整理衣柜', '打扫房间', '洗衣服', '倒垃圾',
                '浇花植物', '整理书架', '清理冰箱', '洗碗',
                '购物清单', '支付账单', '预约医生', '联系家人',
                '学习烹饪', '尝试新菜', '整理照片', '写日记'
            ],
            work: [
                '专注25分钟', '学习新知识', '整理桌面', '输出内容',
                '制定计划', '回顾进度', '断舍离', '整理文件',
                '邮件处理', '会议准备', '技能练习', '项目推进',
                '问题解决', '团队沟通', '文档整理', '总结复盘',
                // 新增16个工作学习任务
                '阅读专业文章', '学习新软件', '整理笔记', '制定周计划',
                '参加培训', '分享知识', '优化流程', '备份数据',
                '清理邮箱', '更新简历', '学习外语', '练习演讲',
                '研究案例', '分析数据', '制作图表', '撰写报告'
            ],
            relax: [
                '看电影', '听音乐', '泡茶喝', '晒太阳',
                '深呼吸', '伸展身体', '冥想5分钟', '涂鸦',
                '看云发呆', '闻花香', '抱抱宠物', '写日记',
                '整理照片', '做手工', '泡澡', '小睡片刻',
                // 新增16个放松任务
                '听播客', '画画', '弹乐器', '做瑜伽',
                '散步公园', '逛书店', '喝咖啡', '做按摩',
                '玩拼图', '做园艺', '看星星', '写诗歌',
                '整理音乐', '看纪录片', '练习书法', '做伸展'
            ]
        };
        
        // 当前使用的模板
        this.currentTemplate = 'daily';
        
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
    
    // 随机放置功能 - 核心修复
    randomPlaceTasks() {
        console.log('🎲 随机放置功能被调用');
        
        // 获取当前模板的所有任务
        const allTasks = [...this.templates[this.currentTemplate]];
        console.log(`📚 当前模板"${this.currentTemplate}"有 ${allTasks.length} 个任务`);
        
        // 打乱所有任务
        const shuffledTasks = [...allTasks].sort(() => Math.random() - 0.5);
        
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
        
        console.log(`✅ 已完成格子: ${completedIndices.length} 个`);
        console.log(`🔄 未完成格子: ${uncompletedIndices.length} 个`);
        
        // 为未完成的格子分配随机任务
        const tasksForUncompleted = shuffledTasks.slice(0, uncompletedIndices.length);
        
        // 打乱未完成格子的顺序
        const shuffledUncompleted = [...uncompletedIndices].sort(() => Math.random() - 0.5);
        
        // 分配任务给未完成的格子
        shuffledUncompleted.forEach((index, i) => {
            if (tasksForUncompleted[i]) {
                this.cells[index].text = tasksForUncompleted[i];
                console.log(`📝 格子 ${index} 获得任务: ${tasksForUncompleted[i]}`);
            }
        });
        
        // 保存并重新渲染
        this.saveToStorage();
        this.renderBoard();
        this.updateStats();
        
        this.showNotification('🎲 任务已随机重新放置！已完成的任务保持不变。');
    }
    
    // 应用模板
    applyTemplate(templateName) {
        if (!this.templates[templateName]) return;
        
        // 确认操作
        if (!confirm(`确定要应用"${templateName}"模板吗？这将覆盖当前所有任务。`)) {
            return;
        }
        
        // 设置当前模板
        this.currentTemplate = templateName;
        
        // 从32个任务中随机选择16个
        const allTasks = [...this.templates[templateName]];
        const shuffledTasks = [...allTasks].sort(() => Math.random() - 0.5);
        const selectedTasks = shuffledTasks.slice(0, 16);
        
        // 应用选中的任务
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
    
    // 检查Bingo
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
        
        // 如果有新的Bingo，显示庆祝动画
        if (newBingos.size > 0) {
            this.showBingoCelebration();
        }
    }
    
    // 显示Bingo庆祝动画
    showBingoCelebration() {
        const celebration = document.getElementById('bingoCelebration');
        celebration.style.display = 'flex';
        
        // 3秒后自动隐藏
        setTimeout(() => {
            celebration.style.display = 'none';
        }, 3000);
    }
    
    // 重置棋盘
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
        
        this.showNotification('🔄 棋盘已重置！');
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
        
        this.showNotification('🗑️ 所有任务已清空！');
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
    }
    
    // 保存到本地存储
    saveToStorage() {
        const data = {
            cells: this.cells,
            currentTemplate: this.currentTemplate,
            completedBingos: Array.from(this.completedBingos),
            timestamp: Date.now()
        };
        localStorage.setItem('adhd-bingo-data', JSON.stringify(data));
    }
    
    // 从本地存储加载
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
    
    // 显示通知
    showNotification(message) {
        // 移除已有的通知
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        // 创建新通知
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // 设置事件监听器 - 修复重点
    setupEventListeners() {
        console.log('🔧 设置事件监听器...');
        
        // 模板按钮
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.applyTemplate(btn.dataset.template);
            });
        });
        
        // 控制按钮 - 重点修复：添加随机放置按钮的事件监听
        const randomPlaceBtn = document.getElementById('randomPlaceBtn');
        if (randomPlaceBtn) {
            console.log('✅ 找到随机放置按钮，添加事件监听');
            randomPlaceBtn.addEventListener('click', () => this.randomPlaceTasks());
        } else {
            console.error('❌ 未找到随机放置按钮！');
        }
        
        document.getElementById('resetBtn').addEventListener('click', () => this.resetBoard());
        document.getElementById('clearAllBtn').addEventListener('click', () => this.clearAllTasks());
        document.getElementById('shareBtn').addEventListener('click', () => this.shareStatus());
        
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
