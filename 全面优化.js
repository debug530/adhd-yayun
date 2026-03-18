// ADHD生活Bingo全面优化功能

// 扩展的内容库 - 每个模板32个任务
const expandedTaskLibrary = {
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

// 随机放置功能
function setupRandomPlacement() {
    const randomBtn = document.getElementById('randomPlaceBtn');
    if (!randomBtn) return;
    
    randomBtn.addEventListener('click', function() {
        if (!window.bingoApp) return;
        
        const currentTemplate = window.bingoApp.currentTemplate || 'daily';
        const taskPool = expandedTaskLibrary[currentTemplate] || expandedTaskLibrary.daily;
        
        // 获取当前棋盘状态
        const cells = document.querySelectorAll('.bingo-cell');
        const currentTasks = window.bingoApp.tasks || [];
        
        // 创建新的任务数组
        const newTasks = [...currentTasks];
        
        // 随机选择16个任务（排除已完成的）
        const availableTasks = [...taskPool];
        const usedIndices = new Set();
        
        cells.forEach((cell, index) => {
            // 如果这个格子已经完成，保持原样
            if (cell.classList.contains('completed')) {
                return;
            }
            
            // 随机选择一个未使用的任务
            if (availableTasks.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableTasks.length);
                newTasks[index] = availableTasks[randomIndex];
                usedIndices.add(randomIndex);
                
                // 移除已使用的任务，避免重复
                availableTasks.splice(randomIndex, 1);
            }
        });
        
        // 更新应用状态
        window.bingoApp.tasks = newTasks;
        window.bingoApp.saveToStorage();
        
        // 重新渲染棋盘
        window.bingoApp.renderBoard();
        
        // 显示通知
        window.bingoApp.showNotification('已随机放置新任务！');
        
        // 按钮动画反馈
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
}

// 编辑窗口按钮功能
function setupEditModalButtons() {
    const saveBtn = document.getElementById('saveEditBtn');
    const clearBtn = document.getElementById('clearEditBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const editModal = document.getElementById('editModal');
            if (editModal && window.bingoApp) {
                // 触发保存
                const event = new Event('click');
                document.querySelector('.modal-btn.primary')?.dispatchEvent(event);
            }
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            const input = document.getElementById('taskInput');
            if (input) {
                input.value = '';
                const charCount = document.getElementById('charCount');
                if (charCount) charCount.textContent = '0';
                input.focus();
            }
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            const editModal = document.getElementById('editModal');
            if (editModal && window.bingoApp) {
                window.bingoApp.closeEditModal();
            }
        });
    }
}

// 更新模板内容为32个
function enhanceTemplates() {
    if (!window.bingoApp) return;
    
    // 保存原始方法
    const originalLoadTemplate = window.bingoApp.loadTemplate;
    
    window.bingoApp.loadTemplate = function(templateName) {
        // 调用原始方法
        originalLoadTemplate.call(this, templateName);
        
        // 更新当前模板
        this.currentTemplate = templateName;
        
        // 从32个任务中随机选择16个
        const taskPool = expandedTaskLibrary[templateName] || expandedTaskLibrary.daily;
        const selectedTasks = [];
        const usedIndices = new Set();
        
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

// 初始化所有优化功能
function initAllEnhancements() {
    // 等待应用加载完成
    const checkInterval = setInterval(() => {
        if (window.bingoApp) {
            clearInterval(checkInterval);
            
            // 1. 设置随机放置功能
            setupRandomPlacement();
            
            // 2. 设置编辑窗口按钮
            setupEditModalButtons();
            
            // 3. 增强模板功能
            enhanceTemplates();
            
            // 4. 更新快捷短语事件（确保在编辑窗口打开时设置）
            const originalOpenEditModal = window.bingoApp.openEditModal;
            if (originalOpenEditModal) {
                window.bingoApp.openEditModal = function(index) {
                    originalOpenEditModal.call(this, index);
                    
                    // 设置快捷短语按钮事件
                    setTimeout(() => {
                        document.querySelectorAll('.edit-phrase-btn').forEach(btn => {
                            btn.addEventListener('click', function() {
                                const phrase = this.getAttribute('data-phrase');
                                const input = document.getElementById('taskInput');
                                if (input) {
                                    input.value = phrase;
                                    const charCount = document.getElementById('charCount');
                                    if (charCount) charCount.textContent = phrase.length;
                                    input.focus();
                                }
                            });
                        });
                    }, 50);
                };
            }
            
            console.log('✅ 所有优化功能已加载');
        }
    }, 500);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllEnhancements);
} else {
    initAllEnhancements();
}

// 导出函数
window.setupRandomPlacement = setupRandomPlacement;
window.setupEditModalButtons = setupEditModalButtons;
window.enhanceTemplates = enhanceTemplates;
window.initAllEnhancements = initAllEnhancements;