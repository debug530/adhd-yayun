// ADHD生活Bingo最终优化修正
// 确保所有需求准确实现

document.addEventListener('DOMContentLoaded', function() {
    // 等待应用加载
    const checkInterval = setInterval(() => {
        if (window.bingoApp) {
            clearInterval(checkInterval);
            applyAllOptimizations();
        }
    }, 500);
});

function applyAllOptimizations() {
    console.log('开始应用最终优化修正...');
    
    // 1. 确保快速开始按钮紧凑居中
    fixTemplateButtons();
    
    // 2. 确保编辑窗口布局正确
    fixEditModalLayout();
    
    // 3. 确保随机放置功能正确
    ensureRandomPlacement();
    
    // 4. 确保提示语居中
    centerInstructions();
    
    // 5. 确保内容库和随机显示正确
    ensureContentLibrary();
    
    console.log('最终优化修正完成');
}

// 1. 快速开始按钮紧凑居中
function fixTemplateButtons() {
    const templateButtons = document.querySelector('.template-buttons');
    if (templateButtons) {
        // 确保CSS类正确应用
        templateButtons.classList.add('compact-center');
        
        // 添加内联样式确保不滑动
        templateButtons.style.overflow = 'hidden';
        templateButtons.style.justifyContent = 'center';
        templateButtons.style.flexWrap = 'nowrap';
        
        // 按钮样式
        const buttons = templateButtons.querySelectorAll('.template-btn');
        buttons.forEach(btn => {
            btn.style.flex = '1';
            btn.style.minWidth = '0';
            btn.style.maxWidth = '140px';
            btn.style.margin = '0 4px';
        });
    }
}

// 2. 编辑窗口布局正确
function fixEditModalLayout() {
    // 确保编辑窗口打开时布局正确
    const originalOpenEditModal = window.bingoApp.openEditModal;
    
    window.bingoApp.openEditModal = function(index) {
        // 调用原始方法
        originalOpenEditModal.call(this, index);
        
        // 延迟确保DOM已更新
        setTimeout(() => {
            // 确保按钮并排
            const modalButtons = document.querySelector('.modal-buttons');
            if (modalButtons) {
                modalButtons.style.display = 'flex';
                modalButtons.style.gap = '10px';
                modalButtons.style.marginTop = '15px';
                modalButtons.style.marginBottom = '20px';
            }
            
            // 确保快捷短语在按钮下方
            const editPhrases = document.querySelector('.edit-quick-phrases');
            if (editPhrases) {
                editPhrases.style.marginTop = '0';
                editPhrases.style.marginBottom = '15px';
            }
            
            // 加载当前分类的快捷短语
            loadCategoryPhrases();
        }, 50);
    };
}

// 加载当前分类的快捷短语
function loadCategoryPhrases() {
    if (!window.bingoApp) return;
    
    const currentTemplate = window.bingoApp.currentTemplate || 'daily';
    const phraseContainer = document.querySelector('.edit-phrase-buttons');
    if (!phraseContainer) return;
    
    // 清空现有短语
    phraseContainer.innerHTML = '';
    
    // 根据当前模板加载短语
    const phrases = getPhrasesByCategory(currentTemplate);
    
    // 添加短语按钮
    phrases.forEach(phrase => {
        const btn = document.createElement('button');
        btn.className = 'edit-phrase-btn';
        btn.setAttribute('data-phrase', phrase);
        btn.textContent = phrase;
        btn.addEventListener('click', function() {
            const input = document.getElementById('taskInput');
            if (input) {
                input.value = phrase;
                const charCount = document.getElementById('charCount');
                if (charCount) charCount.textContent = phrase.length;
                input.focus();
            }
        });
        phraseContainer.appendChild(btn);
    });
}

// 分类短语库
function getPhrasesByCategory(category) {
    const phraseLibraries = {
        'daily': [
            '喝2杯水', '整理桌面', '运动15min', '专注25min', '出门走走', '晒太阳',
            '阅读30min', '冥想10min', '写日记', '联系朋友', '整理衣柜', '学习新技能',
            '早睡早起', '吃健康餐', '记账', '计划明天', '打扫房间', '洗衣服',
            '做饭', '购物清单', '回顾目标', '感恩三件事', '整理照片', '备份数据'
        ],
        'work': [
            '检查邮件', '制定计划', '完成报告', '团队会议', '客户沟通', '学习新工具',
            '整理文档', '代码审查', '测试功能', '部署上线', '项目复盘', '技能提升',
            '时间管理', '目标设定', '进度跟踪', '问题解决', '创新思考', '协作沟通',
            '文档编写', '演示准备', '数据分析', '市场调研', '产品设计', '用户测试'
        ],
        'selfcare': [
            '泡个热水澡', '听音乐放松', '做瑜伽', '按摩放松', '芳香疗法', '森林浴',
            '正念冥想', '呼吸练习', '感恩练习', '自我肯定', '情绪日记', '心理咨询',
            '艺术治疗', '音乐治疗', '舞蹈放松', '园艺疗法', '宠物陪伴', '社交活动',
            '兴趣爱好', '创意表达', '心灵阅读', '静坐冥想', '身体扫描', '渐进放松'
        ]
    };
    
    return phraseLibraries[category] || phraseLibraries.daily;
}

// 3. 确保随机放置功能正确
function ensureRandomPlacement() {
    const randomBtn = document.getElementById('randomPlaceBtn');
    if (!randomBtn) return;
    
    // 移除旧的事件监听器
    const newRandomBtn = randomBtn.cloneNode(true);
    randomBtn.parentNode.replaceChild(newRandomBtn, randomBtn);
    
    // 添加新的事件监听器
    newRandomBtn.addEventListener('click', function() {
        if (!window.bingoApp) return;
        
        const currentTemplate = window.bingoApp.currentTemplate || 'daily';
        const taskPool = getTaskLibrary(currentTemplate);
        
        // 获取当前棋盘状态
        const cells = document.querySelectorAll('.bingo-cell');
        const currentTasks = window.bingoApp.tasks || [];
        const newTasks = [...currentTasks];
        
        // 记录已完成格子的索引和任务
        const completedCells = [];
        cells.forEach((cell, index) => {
            if (cell.classList.contains('completed')) {
                completedCells.push({
                    index: index,
                    task: currentTasks[index] || ''
                });
            }
        });
        
        // 创建可用任务池（排除已完成的任务）
        const availableTasks = [...taskPool];
        completedCells.forEach(cell => {
            const taskIndex = availableTasks.indexOf(cell.task);
            if (taskIndex > -1) {
                availableTasks.splice(taskIndex, 1);
            }
        });
        
        // 打乱可用任务
        shuffleArray(availableTasks);
        
        // 重新分配任务
        let taskIndex = 0;
        cells.forEach((cell, index) => {
            // 如果这个格子已经完成，保持原样
            if (cell.classList.contains('completed')) {
                return;
            }
            
            // 分配新任务
            if (taskIndex < availableTasks.length) {
                newTasks[index] = availableTasks[taskIndex];
                taskIndex++;
            } else {
                // 如果任务不够，使用默认任务
                newTasks[index] = '自定义任务';
            }
        });
        
        // 更新应用状态
        window.bingoApp.tasks = newTasks;
        window.bingoApp.saveToStorage();
        
        // 重新渲染棋盘
        window.bingoApp.renderBoard();
        
        // 显示通知
        window.bingoApp.showNotification('已随机重新放置任务！');
        
        // 按钮动画反馈
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
}

// 任务库
function getTaskLibrary(category) {
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
    
    return taskLibraries[category] || taskLibraries.daily;
}

// 数组打乱函数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 4. 确保提示语居中
function centerInstructions() {
    const instructions = document.querySelector('.instructions');
    if (instructions) {
        instructions.style.textAlign = 'center';
        instructions.style.margin = '15px auto';
        instructions.style.maxWidth = '400px';
    }
}

// 5. 确保内容库和随机显示正确
function ensureContentLibrary() {
    // 修改模板加载函数，确保从32个中随机选择16个
    const originalLoadTemplate = window.bingoApp.loadTemplate;
    
    window.bingoApp.loadTemplate = function(templateName) {
        // 更新当前模板
        this.currentTemplate = templateName;
        
        // 从32个任务中随机选择16个
        const taskPool = getTaskLibrary(templateName);
        const selectedTasks = [];
        const usedIndices = new Set();
        
        // 随机选择16个不重复的任务
        while (selectedTasks.length < 16 && usedIndices.size < taskPool.length) {
            const randomIndex = Math.floor(Math.random() * taskPool.length);
            if (!usedIndices.has(randomIndex)) {
                selectedTasks.push(taskPool[randomIndex]);
                usedIndices.add(randomIndex);
            }
        }
        
        // 确保有16个任务
        while (selectedTasks.length < 16) {
            selectedTasks.push('自定义任务');
        }
        
        // 更新任务数组
        this.tasks = selectedTasks;
        this.saveToStorage();
        this.renderBoard();
        
        // 显示通知
        this.showNotification(`已加载${templateName}模板（32选16随机）`);
    };
}

// 添加CSS修正
function addCSSFixes() {
    const style = document.createElement('style');
    style.textContent = `
        /* 快速开始按钮紧凑居中 */
        .template-buttons.compact-center {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin: 0 auto 20px;
            max-width: 500px;
            overflow: hidden;
        }
        
        /* 底部按钮区域 */
        .bottom-buttons {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin: 20px auto;
            max-width: 600px;
        }
        
        .bottom-btn {
            flex: 1;
            min-width: 120px;
            max-width: 180px;
        }
        
        /* 提示语居中 */
        .instructions {
            text-align: center;
            margin: 15px auto;
            padding: 10px;
            max-width: 400px;
        }
        
        /* 编辑短语区域 */
        .edit-phrase-buttons {
            max-height: 200px;
            overflow-y: auto;
            padding: 5px;
        }
        
        /* 响应式调整 */
        @media (max-width: 480px) {
            .template-buttons.compact-center {
                gap: 6px;
            }
            
            .bottom-btn {
                min-width: 100px;
            }
            
            .edit-phrase-buttons {
                max-height: 180px;
            }
        }
    `;
    document.head.appendChild(style);
}

// 初始化
setTimeout(() => {
    addCSSFixes();
    applyAllOptimizations();
}, 1000);