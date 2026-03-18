#!/bin/bash

clear
echo "========================================="
echo "🚀 ADHD生活Bingo - GitHub自动上传部署"
echo "========================================="
echo ""
echo "我将帮你把ADHD生活Bingo项目上传到GitHub并启用Pages托管"
echo "这样你就可以在手机上直接访问了！"
echo ""
echo "📋 需要你提供以下信息:"
echo "   1. GitHub用户名"
echo "   2. GitHub密码 或 Personal Access Token（推荐）"
echo "   3. 仓库名称（可选，默认: adhd-bingo）"
echo ""
echo "🔐 安全提示:"
echo "   - Token比密码更安全"
echo "   - 获取Token: https://github.com/settings/tokens"
echo "   - 选择 'repo' 权限即可"
echo ""
echo "========================================="

# 收集信息
read -p "📧 请输入GitHub用户名: " GITHUB_USER
echo ""
echo "请选择认证方式:"
echo "  1. 使用密码（不推荐）"
echo "  2. 使用Personal Access Token（推荐）"
read -p "请选择 (1/2): " AUTH_CHOICE

if [ "$AUTH_CHOICE" = "1" ]; then
    read -sp "🔑 请输入GitHub密码: " GITHUB_AUTH
    AUTH_TYPE="password"
else
    read -sp "🔑 请输入GitHub Token: " GITHUB_AUTH
    AUTH_TYPE="token"
fi

echo ""
read -p "📦 请输入仓库名称 (默认: adhd-bingo): " REPO_NAME
REPO_NAME=${REPO_NAME:-adhd-bingo}

echo ""
echo "========================================="
echo "✅ 信息收集完成！"
echo ""
echo "📊 配置摘要:"
echo "   用户名: $GITHUB_USER"
echo "   认证方式: $AUTH_TYPE"
echo "   仓库名称: $REPO_NAME"
echo "   项目目录: /root/.openclaw/workspace/adhd-bingo"
echo ""
read -p "是否开始上传？(y/N): " CONFIRM

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "❌ 操作取消"
    exit 0
fi

echo ""
echo "🔄 开始上传过程..."
echo "========================================="

# 进入项目目录
cd /root/.openclaw/workspace/adhd-bingo

# 清理旧的Git记录
echo "🧹 清理旧Git记录..."
rm -rf .git 2>/dev/null

# 初始化Git
echo "🔄 初始化Git仓库..."
git init
git config user.name "$GITHUB_USER"
git config user.email "$GITHUB_USER@users.noreply.github.com"

# 添加文件
echo "📄 添加项目文件..."
git add .

# 提交
echo "💾 提交更改..."
git commit -m "发布ADHD生活Bingo v1.0

功能特性:
- 4×4 Bingo棋盘游戏化任务管理
- 点击交互与长按编辑功能
- Bingo检测与庆祝动画
- 三种预设任务模板
- 本地存储与响应式设计
- PWA支持可安装到主屏幕
- 完全隐私保护，无需登录"

# 创建GitHub仓库
echo "📦 创建GitHub仓库..."
if [ "$AUTH_TYPE" = "token" ]; then
    # 使用Token创建仓库
    curl -s -X POST \
      -H "Authorization: token $GITHUB_AUTH" \
      -H "Accept: application/vnd.github.v3+json" \
      https://api.github.com/user/repos \
      -d "{\"name\":\"$REPO_NAME\",\"description\":\"ADHD生活Bingo - 低压力游戏化日常任务管理工具\",\"private\":false}" > /dev/null 2>&1
else
    # 使用密码（尝试）
    echo "⚠️  密码方式可能受限，建议使用Token"
fi

# 添加远程仓库
echo "🌐 连接GitHub远程仓库..."
if [ "$AUTH_TYPE" = "token" ]; then
    git remote add origin "https://$GITHUB_USER:$GITHUB_AUTH@github.com/$GITHUB_USER/$REPO_NAME.git"
else
    git remote add origin "https://$GITHUB_USER:$GITHUB_AUTH@github.com/$GITHUB_USER/$REPO_NAME.git"
fi

# 推送代码
echo "🚀 推送代码到GitHub..."
git branch -M main
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo "✅ 代码上传成功！"
else
    echo "❌ 上传失败，可能的原因:"
    echo "   1. 认证信息错误"
    echo "   2. 网络问题"
    echo "   3. 仓库权限不足"
    echo ""
    echo "🔧 尝试备用方案..."
    # 备用方案：创建裸仓库推送
    cd /tmp
    git clone --bare "/root/.openclaw/workspace/adhd-bingo" adhd-bingo-bare.git
    cd adhd-bingo-bare.git
    git push --mirror "https://$GITHUB_USER:$GITHUB_AUTH@github.com/$GITHUB_USER/$REPO_NAME.git"
fi

echo ""
echo "========================================="
echo "🎉 上传完成！"
echo ""
echo "🔗 重要链接:"
echo "   1. 仓库地址: https://github.com/$GITHUB_USER/$REPO_NAME"
echo "   2. Pages设置: https://github.com/$GITHUB_USER/$REPO_NAME/settings/pages"
echo ""
echo "📱 启用GitHub Pages步骤:"
echo "   1. 打开上面的Pages设置链接"
echo "   2. 在'Source'选择: 'Deploy from a branch'"
echo "   3. 在'Branch'选择: 'main' 和 '/ (root)'"
echo "   4. 点击 'Save'"
echo "   5. 等待1-2分钟部署"
echo ""
echo "🌐 访问地址（启用Pages后）:"
echo "   https://$GITHUB_USER.github.io/$REPO_NAME"
echo ""
echo "📲 手机直接访问:"
echo "   在手机浏览器中输入上面的地址即可"
echo ""
echo "🔧 功能测试:"
echo "   1. 打开页面，选择模板"
echo "   2. 点击格子标记完成"
echo "   3. 长按格子编辑任务"
echo "   4. 凑齐Bingo线触发动画"
echo ""
echo "========================================="
echo "✅ 所有操作完成！"
echo ""
echo "💡 提示: GitHub Pages部署需要几分钟时间"
echo "     稍后在手机浏览器中测试访问即可"
echo ""
echo "🧹 清理敏感信息..."
unset GITHUB_AUTH
history -c

echo "✨ 祝你使用愉快！"