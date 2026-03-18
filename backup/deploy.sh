#!/bin/bash

echo "🚀 开始部署 ADHD生活Bingo 到静态网站..."
echo "=========================================="

# 检查Nginx是否安装
if ! command -v nginx &> /dev/null; then
    echo "❌ Nginx 未安装，正在安装..."
    apt-get update && apt-get install -y nginx
fi

# 创建网站目录
echo "📁 创建网站目录..."
WEB_DIR="/var/www/adhd-bingo"
mkdir -p $WEB_DIR

# 复制文件
echo "📄 复制网站文件..."
cp -r /root/.openclaw/workspace/adhd-bingo/* $WEB_DIR/

# 设置权限
echo "🔒 设置文件权限..."
chown -R www-data:www-data $WEB_DIR
chmod -R 755 $WEB_DIR

# 创建Nginx配置
echo "⚙️ 配置Nginx..."
cp /root/.openclaw/workspace/adhd-bingo/nginx.conf /etc/nginx/sites-available/adhd-bingo
ln -sf /etc/nginx/sites-available/adhd-bingo /etc/nginx/sites-enabled/

# 测试Nginx配置
echo "🧪 测试Nginx配置..."
/usr/sbin/nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx配置测试通过"
    
    # 重启Nginx
    echo "🔄 重启Nginx服务..."
    systemctl restart nginx
    
    # 检查服务状态
    echo "📊 检查服务状态..."
    sleep 2
    systemctl status nginx --no-pager | head -10
    
    # 获取服务器IP
    SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')
    
    echo ""
    echo "🎉 部署完成！"
    echo ""
    echo "🌐 访问地址:"
    echo "   本地访问: http://localhost"
    echo "   远程访问: http://$SERVER_IP"
    echo "   或使用域名访问你的服务器"
    echo ""
    echo "📱 手机访问:"
    echo "   在手机浏览器中输入: http://$SERVER_IP"
    echo ""
    echo "🔧 管理命令:"
    echo "   查看日志: sudo tail -f /var/log/nginx/access.log"
    echo "   重启服务: sudo systemctl restart nginx"
    echo "   停止服务: sudo systemctl stop nginx"
    echo ""
    echo "📁 网站文件位置: $WEB_DIR"
    
else
    echo "❌ Nginx配置测试失败，请检查配置文件"
    exit 1
fi