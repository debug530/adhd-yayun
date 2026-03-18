#!/bin/bash

echo "🚀 ADHD生活Bingo - GitHub上传与部署脚本"
echo "========================================"

# 检查参数
if [ $# -lt 3 ]; then
    echo "❌ 使用方法: $0 <github_username> <github_password> <repository_name>"
    echo ""
    echo "示例:"
    echo "  $0 yourusername yourpassword adhd-bingo"
    echo ""
    echo "或者交互式输入:"
    echo "  请依次提供:"
    echo "  1. GitHub用户名"
    echo "  2. GitHub密码/Token"
    echo "  3. 仓库名称（如: adhd-bingo）"
    exit 1
fi

GITHUB_USER="$1"
GITHUB_PASS="$2"
REPO_NAME="$3"

echo ""
echo "📊 配置信息:"
echo "   用户名: $GITHUB_USER"
echo "   仓库名: $REPO_NAME"
echo "   项目目录: /root/.openclaw/workspace/adhd-bingo"
echo ""

# 检查GitHub CLI是否安装
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI 未安装，正在安装..."
    curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
    chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null
    apt update && apt install -y gh
fi

echo "✅ GitHub CLI 已安装: $(gh --version | head -1)"

# 登录GitHub
echo ""
echo "🔐 登录GitHub..."
echo "$GITHUB_PASS" | gh auth login --with-token 2>/dev/null

if [ $? -ne 0 ]; then
    echo "⚠️  Token登录失败，尝试用户名密码登录..."
    echo -e "$GITHUB_USER\n$GITHUB_PASS\n\n" | gh auth login --web 2>/dev/null || {
        echo "❌ GitHub登录失败"
        echo "请检查:"
        echo "  1. 用户名和密码是否正确"
        echo "  2. 是否启用双重验证（建议使用Personal Access Token）"
        echo "  3. 网络连接是否正常"
        exit 1
    }
fi

echo "✅ GitHub登录成功"

# 创建仓库
echo ""
echo "📦 创建GitHub仓库..."
gh repo create "$REPO_NAME" --public --description "ADHD生活Bingo - 为ADHD人群设计的低压力、游戏化日常任务管理工具" --homepage "https://$GITHUB_USER.github.io/$REPO_NAME" 2>/dev/null || {
    echo "⚠️  仓库可能已存在，继续..."
}

# 进入项目目录
cd /root/.openclaw/workspace/adhd-bingo

# 初始化Git仓库
echo ""
echo "🔄 初始化Git仓库..."
rm -rf .git 2>/dev/null
git init
git config user.name "$GITHUB_USER"
git config user.email "$GITHUB_USER@users.noreply.github.com"

# 添加文件
echo "📄 添加文件到Git..."
git add .

# 提交
echo "💾 提交更改..."
git commit -m "feat: 初始提交 - ADHD生活Bingo完整实现

- 4×4 Bingo棋盘布局
- 点击切换完成状态
- 长按编辑任务功能
- Bingo检测与庆祝动画
- 三种预设模板
- 本地存储支持
- 响应式设计
- PWA支持"

# 添加远程仓库
echo "🌐 连接到GitHub远程仓库..."
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"

# 推送代码
echo "🚀 推送代码到GitHub..."
git branch -M main
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo "✅ 代码推送成功！"
else
    echo "❌ 代码推送失败，尝试HTTPS方式..."
    git remote set-url origin "https://$GITHUB_USER:$GITHUB_PASS@github.com/$GITHUB_USER/$REPO_NAME.git"
    git push -u origin main --force
fi

# 启用GitHub Pages
echo ""
echo "🌍 配置GitHub Pages..."
gh repo view --web 2>/dev/null

echo "📝 手动启用GitHub Pages步骤:"
echo "  1. 访问: https://github.com/$GITHUB_USER/$REPO_NAME/settings/pages"
echo "  2. 在'Source'部分选择: 'Deploy from a branch'"
echo "  3. 在'Branch'部分选择: 'main' 和 '/ (root)'"
echo "  4. 点击 'Save'"
echo "  5. 等待部署完成（约1-2分钟）"

# 创建部署状态检查
echo ""
echo "⏳ 部署状态检查..."
sleep 10
echo "🔗 访问地址:"
echo "   GitHub仓库: https://github.com/$GITHUB_USER/$REPO_NAME"
echo "   GitHub Pages: https://$GITHUB_USER.github.io/$REPO_NAME"
echo ""
echo "📱 手机访问链接:"
echo "   https://$GITHUB_USER.github.io/$REPO_NAME"
echo ""
echo "🎉 上传完成！请在手机浏览器中测试访问。"

# 提供后续步骤
echo ""
echo "🔧 后续步骤:"
echo "  1. 在手机浏览器中打开上面的链接"
echo "  2. 测试所有功能是否正常"
echo "  3. 如有问题，检查GitHub Pages部署状态"
echo "  4. 可以分享链接给朋友使用"

# 清理敏感信息
echo ""
echo "🧹 清理敏感信息..."
unset GITHUB_USER
unset GITHUB_PASS
history -c

echo ""
echo "✅ 所有操作完成！"