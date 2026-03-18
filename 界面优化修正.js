// ADHD生活Bingo界面优化修正
// 解决：随机放置按钮无响应、界面优化、色彩调整、编辑窗口改进

document.addEventListener('DOMContentLoaded', function() {
    // 等待应用加载
    const checkInterval = setInterval(() => {
        if (window.bingoApp) {
            clearInterval(checkInterval);
            applyAllFixes();
        }
    }, 500);
});

function applyAllFixes() {
    console.log('开始应用界面优化修正...');
    
    // 1. 修复随机放置按钮事件
    fixRandomPlaceButton();
    
    // 2. 移除"快去开始"文字，调整模板按钮
    fixTemplateSection();
    
    // 3. 优化整体色彩搭配
    enhanceColorScheme();
    
    // 4. 优化编辑任务弹窗
    fixEditModal();
    
    console.log('界面优化修正完成');
}

// 1. 修复随机放置按钮事件
function fixRandomPlaceButton() {
    const randomBtn = document.getElementById('randomPlaceBtn');
    if (!randomBtn) {
        console.error('随机放置按钮未找到');
        return;
    }
    
    // 移除所有现有事件监听器
    const newRandomBtn = randomBtn.cloneNode(true);
    randomBtn.parentNode.replaceChild(newRandomBtn, randomBtn);
    
    // 添加新的事件监听器
    newRandomBtn.addEventListener('click', function() {
        console.log('随机放置按钮被点击');
        
        if (!window.bingoApp) {
            console.error('bingoApp未加载');
            return;
        }
        
        // 获取当前模板
        const currentTemplate = window.bingoApp.currentTemplate || 'daily';
        console.log('当前模板:', currentTemplate);
        
        // 任务库
        const taskLibraries = {
            'daily': [
                '喝2杯水', '整理桌面', '运动15min', '专注25min', '出门走走', '晒太阳',
                '阅读30min', '冥想10min', '写日记', '联系朋友', '整理衣柜', '学习新技能',
                '早睡早起', '吃健康餐', '记账', '计划明天', '打扫房间', '洗衣服',
                '做饭', '购物清单', '回顾目标', '感恩三件事', '整理照片', '备份数据',
                '学习外语', '练习乐器', '画画', '写作', '编程', '手工制作',
                '整理书架', '清理手机'
            ],
            'work': [
                '检查邮件', '制定计划', '完成报告', '团队会议', '客户沟通', '学习新工具',
                '整理文档', '代码审查', '测试功能', '部署上线', '项目复盘', '技能提升',
                '时间管理', '目标设定', '进度跟踪', '问题解决', '创新思考', '协作沟通',
                '文档编写', '演示准备', '数据分析', '市场调研', '产品设计', '用户测试',
                '竞品分析', '策略制定', '预算规划', '风险管理', '质量检查', '流程优化',
                '团队建设', '知识分享'
            ],
            'selfcare': [
                '泡个热水澡', '听音乐放松', '做瑜伽', '按摩放松', '芳香疗法', '森林浴',
                '正念冥想', '呼吸练习', '感恩练习', '自我肯定', '情绪日记', '心理咨询',
                '艺术治疗', '音乐治疗', '舞蹈放松', '园艺疗法', '宠物陪伴', '社交活动',
                '兴趣爱好', '创意表达', '心灵阅读', '静坐冥想', '身体扫描', '渐进放松',
                '视觉想象', '积极思考', '放下执念', '接受自我', '设定边界', '说不练习',
                '休息暂停', '小确幸记录'
            ]
        };
        
        const taskPool = taskLibraries[currentTemplate] || taskLibraries.daily;
        console.log('任务池大小:', taskPool.length);
        
        // 获取当前棋盘状态
        const cells = document.querySelectorAll('.bingo-cell');
        const currentTasks = window.bingoApp.tasks || Array(16).fill('自定义任务');
        const newTasks = [...currentTasks];
        
        console.log('当前任务:', currentTasks);
        
        // 记录已完成格子的索引
        const completedIndices = [];
        cells.forEach((cell, index) => {
            if (cell.classList.contains('completed')) {
                completedIndices.push(index);
                console.log('已完成格子:', index, '任务:', currentTasks[index]);
            }
        });
        
        console.log('已完成格子索引:', completedIndices);
        
        // 创建可用任务池（排除已完成的任务）
        const availableTasks = [...taskPool];
        completedIndices.forEach(index => {
            const completedTask = currentTasks[index];
            const taskIndex = availableTasks.indexOf(completedTask);
            if (taskIndex > -1) {
                availableTasks.splice(taskIndex, 1);
            }
        });
        
        console.log('可用任务池:', availableTasks.length);
        
        // 打乱可用任务
        const shuffledTasks = [...availableTasks];
        for (let i = shuffledTasks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledTasks[i], shuffledTasks[j]] = [shuffledTasks[j], shuffledTasks[i]];
        }
        
        // 重新分配任务
        let taskIndex = 0;
        cells.forEach((cell, index) => {
            // 如果这个格子已经完成，保持原样
            if (completedIndices.includes(index)) {
                return;
            }
            
            // 分配新任务
            if (taskIndex < shuffledTasks.length) {
                newTasks[index] = shuffledTasks[taskIndex];
                taskIndex++;
            } else {
                // 如果任务不够，从原始池中随机选择
                const randomTask = taskPool[Math.floor(Math.random() * taskPool.length)];
                newTasks[index] = randomTask;
            }
        });
        
        console.log('新任务:', newTasks);
        
        // 更新应用状态
        window.bingoApp.tasks = newTasks;
        window.bingoApp.saveToStorage();
        
        // 重新渲染棋盘
        window.bingoApp.renderBoard();
        
        // 显示通知
        window.bingoApp.showNotification('🎲 已随机重新放置任务！');
        
        // 按钮动画反馈
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
    
    console.log('随机放置按钮事件已修复');
}

// 2. 移除"快去开始"文字，调整模板按钮
function fixTemplateSection() {
    // 移除"快去开始"标题
    const quickStartTitle = document.querySelector('h3 i.fa-rocket')?.parentElement;
    if (quickStartTitle && quickStartTitle.textContent.includes('快去开始')) {
        quickStartTitle.remove();
    }
    
    // 调整模板按钮样式
    const templateButtons = document.querySelector('.template-buttons');
    if (templateButtons) {
        // 向上紧凑调整
        templateButtons.style.marginTop = '0';
        templateButtons.style.marginBottom = '15px';
        
        // 设置区别于下方任务内容按钮的色彩
        const buttons = templateButtons.querySelectorAll('.template-btn');
        buttons.forEach(btn => {
            btn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            btn.style.color = 'white';
            btn.style.border = 'none';
            btn.style.boxShadow = '0 4px 6px rgba(102, 126, 234, 0.3)';
            
            // 悬停效果
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 6px 12px rgba(102, 126, 234, 0.4)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '0 4px 6px rgba(102, 126, 234, 0.3)';
            });
        });
    }
}

// 3. 优化整体色彩搭配
function enhanceColorScheme() {
    const style = document.createElement('style');
    style.textContent = `
        /* 整体色彩优化 */
        :root {
            --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            --success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            --warning-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
            --info-gradient: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        }
        
        /* 头部优化 */
        .header {
            background: var(--primary-gradient);
            color: white;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
        }
        
        /* 底部按钮优化 */
        .bottom-btn {
            background: var(--secondary-gradient);
            color: white;
            border: none;
            box-shadow: 0 4px 8px rgba(245, 87, 108, 0.3);
            transition: all 0.3s ease;
        }
        
        .bottom-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(245, 87, 108, 0.4);
        }
        
        #randomPlaceBtn {
            background: var(--success-gradient);
            box-shadow: 0 4px 8px rgba(79, 172, 254, 0.3);
        }
        
        #resetBtn {
            background: var(--warning-gradient);
            box-shadow: 0 4px 8px rgba(250, 112, 154, 0.3);
        }
        
        #shareBtn {
            background: var(--info-gradient);
            color: #333;
            box-shadow: 0 4px 8px rgba(168, 237, 234, 0.3);
        }
        
        #clearAllBtn {
            background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
            color: #333;
            box-shadow: 0 4px 8px rgba(255, 154, 158, 0.3);
        }
        
        /* 棋盘格子优化 */
        .bingo-cell {
            background: white;
            border: 2px solid #e0e0e0;
            transition: all 0.3s ease;
        }
        
        .bingo-cell:hover {
            border-color: #667eea;
            box-shadow: 0 4px 8px rgba(102, 126, 234, 0.2);
        }
        
        .bingo-cell.completed {
            background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
            border-color: #4CAF50;
        }
        
        /* 统计区域优化 */
        .stats {
            background: rgba(255, 255, 255, 0.9);
            border-radius: 15px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .stat-value {
            color: #667eea;
            font-weight: bold;
            font-size: 1.2rem;
        }
        
        /* 提示语优化 */
        .instructions {
            background: rgba(168, 237, 234, 0.2);
            border-radius: 10px;
            padding: 12px;
            color: #555;
            border-left: 4px solid #667eea;
        }
    `;
    document.head.appendChild(style);
}

// 4. 优化编辑任务弹窗
function fixEditModal() {
    // 修改编辑窗口打开逻辑
    const originalOpenEditModal = window.bingoApp.openEditModal;
    
    window.bingoApp.openEditModal = function(index) {
        // 调用原始方法
        originalOpenEditModal.call(this, index);
        
        // 延迟确保DOM已更新
        setTimeout(() => {
            // 1. 输入框字数限制提示放进输入框内右侧
            const input = document.getElementById('taskInput');
            const charCount = document.getElementById('charCount');
            
            if (input && charCount) {
                // 创建容器
                const inputContainer = document.createElement('div');
                inputContainer.style.position = 'relative';
                inputContainer.style.width = '100%';
                
                // 包装输入框
                input.parentNode.insertBefore(inputContainer, input);
                inputContainer.appendChild(input);
                
                // 创建字数提示
                const charHint = document.createElement('div');
                charHint.id = 'charHint';
                charHint.style.position = 'absolute';
                charHint.style.right = '10px';
                charHint.style.top = '50%';
                charHint.style.transform = 'translateY(-50%)';
                charHint.style.color = '#999';
                charHint.style.fontSize = '0.9rem';
                charHint.style.pointerEvents = 'none';
                charHint.textContent = '0/10';
                
                inputContainer.appendChild(charHint);
                
                // 更新字数显示
                input.addEventListener('input', function() {
                    const length = this.value.length;
                    charHint.textContent = `${length}/10`;
                    if (length > 10) {
                        charHint.style.color = '#f5576c';
                    } else {
                        charHint.style.color = '#999';
                    }
                });
                
                // 初始更新
                charHint.textContent = `${input.value.length}/10`;
            }
            
            // 2. 确保保存清空取消三个按钮并排放置
            const modalButtons = document.querySelector('.modal-buttons');
            if (modalButtons) {
                modalButtons.style.display = 'flex';
                modalButtons.style.justifyContent = 'space-between';
                modalButtons.style.gap = '10px';
                modalButtons.style.marginTop = '20px';
                modalButtons.style.marginBottom = '20px';
                
                // 按钮样式优化
                const buttons = modalButtons.querySelectorAll('.modal-btn');
                buttons.forEach((btn, index) => {
                    btn.style.flex = '1';
                    btn.style.padding = '12px';
                    
                    if (index === 0) { // 保存按钮
                        btn.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
                        btn.style.color = 'white';
                    } else if (index === 1) { // 清空按钮
                        btn.style.background = 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
                        btn.style.color = '#333';
                    } else if (index === 2) { // 取消按钮
                        btn.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)';
                        btn.style.color = '#333';
                    }
                    
                    btn.style.border = 'none';
                    btn.style.borderRadius = '8px';
                    btn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                });
            }
            
            // 3. 去除下方冗余按钮
            const redundantButtons = document.querySelectorAll('.modal-btn:not(.save-btn):not(.clear-btn):not(.cancel-btn)');
            redundantButtons.forEach(btn => {
                if (btn.parentElement === modalButtons) {
                    btn.remove();
                }
            });
            
            // 4. 快捷短语取消滑动模式，直接显示
            const phraseContainer = document.querySelector('.edit-phrase-buttons');
            if (phraseContainer) {
                phraseContainer.style.overflow = 'visible';
                phraseContainer.style.maxHeight = 'none';
                phraseContainer.style.display = 'grid';
                phraseContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
                phraseContainer.style.gap = '8px';
                phraseContainer.style.marginTop = '10px';
                
                // 短语按钮样式
                const phraseButtons = phraseContainer.querySelectorAll('.edit-phrase-btn');
                phraseButtons.forEach(btn => {
                    btn.style.padding = '8px 6px';
                    btn.style.background = 'white';
                    btn.style.border = '1px solid #e0e0e0';
                    btn.style.borderRadius = '6px';
                    btn.style.color = '#333';
                    btn.style.fontSize = '0.8rem';
                    btn.style.transition = 'all 0.2s ease';
                    
                    btn.addEventListener('mouseenter', function() {
                        this.style.background = '#667eea';
                        this.style.color = 'white';
                        this.style.borderColor = '#667eea';
                        this.style.transform = 'translateY(-1px)';
                    });
                    
                    btn.addEventListener('mouseleave', function() {
                        this.style.background = 'white';
                        this.style.color = '#333';
                        this.style.borderColor = '#e0e0e0';
                        this.style.transform = '';
                    });
                });
            }
            
            // 5. 加载当前分类的快捷短语
            loadCategoryPhrases();
        }, 100);
    };
}

// 加载分类短语
function loadCategoryPhrases() {
    if (!window.bingoApp) return;
    
    const currentTemplate = window.bingoApp.currentTemplate || 'daily';
    const phraseContainer = document.querySelector('.edit-phrase-buttons');
    if (!phraseContainer) return;
    
    // 清空现有短语
    phraseContainer.innerHTML = '';
    
    // 根据当前模板加载短语
    const phraseLibraries = {
        'daily': [
            '喝2杯水', '整理桌面', '运动15min', '专注25min', '出门走走', '晒太阳',
            '阅读30min', '冥想10min', '写日记', '联系朋友', '整理衣柜', '学习新技能',
            '早睡早起', '吃健康餐', '记账', '计划明天', '打扫房间', '洗衣服',
            '做饭', '购物清单', '回顾目标', '感恩三件事'
        ],
        'work': [
            '检查邮件', '制定计划', '完成报告', '团队会议', '客户沟通', '学习新工具',
            '整理文档', '代码审查', '测试功能', '部署上线', '项目复盘', '技能提升',
            '时间管理', '目标设定', '进度跟踪', '问题解决', '创新思考', '协作沟通'
        ],
        'selfcare': [
            '泡个热水澡', '听音乐放松', '做瑜伽', '按摩放松', '芳香疗法', '森林浴',
            '正念冥想', '呼吸练习', '感恩练习', '自我肯定', '情绪日记', '心理咨询',
            '艺术治疗', '音乐治疗', '舞蹈放松', '园艺疗法', '宠物陪伴', '社交活动'
        ]
    };
    
    const phrases = phraseLibraries[currentTemplate] || phraseLibraries.daily;
    
    // 添加短语按钮
    phrases.forEach(phrase => {
        const btn = document.createElement('button');
        btn.className = 'edit-phrase-btn';
        btn.setAttribute('data-phrase', phrase);
        btn.textContent = phrase;
        
        // 样式
        btn.style.padding = '8px 6px';
        btn.style.background = 'white';
        btn.style.border = '1px solid #e0e0e0';
        btn.style.borderRadius = '6px';
        btn.style.color = '#333';
        btn.style.fontSize = '0.8rem';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'all 0.2s ease';
        btn.style.textAlign = 'center';
        btn.style.wordBreak = 'break-word';
        
        // 悬停效果
        btn.addEventListener('mouseenter', function() {
            this.style.background = '#667eea';
            this.style.color = 'white';
            this.style.borderColor = '#667eea';
            this.style.transform = 'translateY(-1px)';
            this.style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.3)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.background = 'white';
            this.style.color = '#333';
            this.style.borderColor = '#e0e0e0';
            this.style.transform = '';
            this.style.boxShadow = 'none';
        });
        
        // 点击事件
        btn.addEventListener('click', function() {
            const input = document.getElementById('taskInput');
            if (input) {
                input.value = phrase;
                input.focus();
                
                // 更新字数提示
                const charHint = document.getElementById('charHint');
                if (charHint) {
                    charHint.textContent = `${phrase.length}/10`;
                    if (phrase.length > 10) {
                        charHint.style.color = '#f5576c';
                    } else {
                        charHint.style.color = '#999';
                    }
                }
                
                // 按钮点击反馈
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
        
        phraseContainer.appendChild(btn);
    });
}

// 初始化
setTimeout(() => {
    applyAllFixes();
}, 1500);

// 导出函数
window.fixRandomPlaceButton = fixRandomPlaceButton;
window.fixTemplateSection = fixTemplateSection;
window.enhanceColorScheme = enhanceColorScheme;
window.fixEditModal = fixEditModal;