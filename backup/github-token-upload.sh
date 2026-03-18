#!/bin/bash

echo "🔐 ADHD生活Bingo - GitHub Token上传脚本（推荐）"
echo "=============================================="

echo ""
echo "📋 准备工作:"
echo "  1. 访问 https://github.com/settings/tokens"
echo "  2. 点击 'Generate new token'"
echo "  3. 选择 'repo' 权限"
echo "  4. 生成并复制Token"
echo ""

# 交互式输入
read -p "请输入GitHub用户名: " GITHUB_USER
read -p "请输入GitHub Personal Access Token: " GITHUB_TOKEN
read -p "请输入仓库名称（默认: adhd-bingo）: " REPO_NAME
REPO_NAME=${REPO_NAME:-adhd-bingo}

echo ""
echo "📊 配置信息:"
echo "   用户名: $GITHUB_USER"
echo "   仓库名: $REPO_NAME"
echo "   Token: ${GITHUB_TOKEN:0:4}...${GITHUB_TOKEN: -4}"
echo ""

# 检查Git
if ! command -v git &> /dev/null; then
    echo "❌ Git未安装，正在安装..."
    apt update && apt install -y git
fi

echo "✅ Git已安装: $(git --version)"

# 进入项目目录
cd /root/.openclaw/workspace/adhd-bingo

# 清理旧的.git目录
rm -rf .git 2>/dev/null

# 初始化Git
echo ""
echo "🔄 初始化Git仓库..."
git init
git config user.name "$GITHUB_USER"
git config user.email "$GITHUB_USER@users.noreply.github.com"

# 添加所有文件
echo "📄 添加文件..."
git add .

# 提交
echo "💾 提交更改..."
git commit -m "feat: ADHD生活Bingo完整实现

- 4×4 Bingo棋盘游戏化任务管理
- 点击交互与长按编辑功能
- Bingo检测与动画反馈
- 三种预设任务模板
- 本地存储与响应式设计
- PWA支持可安装到主屏幕"

# 创建GitHub仓库（通过API）
echo ""
echo "📦 创建GitHub仓库..."
CREATE_RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"description\":\"ADHD生活Bingo - 低压力游戏化日常任务管理工具\",\"homepage\":\"https://$GITHUB_USER.github.io/$REPO_NAME\",\"private\":false}")

if echo "$CREATE_RESPONSE" | grep -q "already exists"; then
    echo "⚠️  仓库已存在，继续..."
elif echo "$CREATE_RESPONSE" | grep -q "Bad credentials"; then
    echo "❌ Token无效，请检查Token权限"
    exit 1
elif echo "$CREATE_RESPONSE" | grep -q "name"; then
    echo "✅ 仓库创建成功"
else
    echo "⚠️  仓库创建可能有问题，但继续尝试..."
fi

# 添加远程仓库并推送
echo ""
echo "🌐 连接到GitHub..."
git remote add origin "https://$GITHUB_USER:$GITHUB_TOKEN@github.com/$GITHUB_USER/$REPO_NAME.git"

echo "🚀 推送代码..."
git branch -M main
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo "✅ 代码推送成功！"
else
    echo "❌ 推送失败，请检查网络和权限"
    exit 1
fi

# 启用GitHub Pages（通过API）
echo ""
echo "🌍 启用GitHub Pages..."
sleep 2

PAGES_RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$GITHUB_USER/$REPO_NAME/pages \
  -d '{"source":{"branch":"main","path":"/"}}')

if echo "$PAGES_RESPONSE" | grep -q "Already built"; then
    echo "✅ GitHub Pages已启用"
else
    echo "📝 需要手动启用GitHub Pages:"
    echo "   访问: https://github.com/$GITHUB_USER/$REPO_NAME/settings/pages"
    echo "   选择: Branch: main, Folder: / (root)"
    echo "   点击: Save"
fi

# 显示访问信息
echo ""
echo "🎉 上传完成！"
echo ""
echo "🔗 访问地址:"
echo "   仓库: https://github.com/$GITHUB_USER/$REPO_NAME"
echo "   网站: https://$GITHUB_USER.github.io/$REPO_NAME"
echo ""
echo "📱 手机直接访问:"
echo "   https://$GITHUB_USER.github.io/$REPO_NAME"
echo ""
echo "⏳ 部署状态:"
echo "   GitHub Pages通常需要1-2分钟部署"
echo "   访问 https://github.com/$GITHUB_USER/$REPO_NAME/actions 查看进度"
echo ""
echo "🔧 功能验证清单:"
echo "   [ ] 页面加载正常"
echo "   [ ] 点击格子切换状态"
echo "   [ ] 长按编辑任务"
echo "   [ ] Bingo动画触发"
echo "   [ ] 本地存储工作"
echo "   [ ] 手机端适配良好"

# 清理敏感信息
echo ""
echo "🧹 清理Token信息..."
unset GITHUB_TOKEN
history -c

echo ""
echo "✅ 所有操作完成！请在手机浏览器中测试访问。"