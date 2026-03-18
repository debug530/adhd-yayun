#!/bin/bash

echo "🔍 ADHD生活Bingo 访问问题诊断"
echo "================================"

# 获取服务器信息
SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')
echo "📊 服务器信息:"
echo "   公网IP: $SERVER_IP"
echo "   内网IP: $(hostname -I | awk '{print $1}')"
echo ""

# 检查Python服务器进程
echo "🔧 检查服务器进程:"
ps aux | grep "python.*http.server" | grep -v grep
echo ""

# 检查端口监听
echo "📡 检查端口监听:"
netstat -tlnp | grep -E ":80|:3000|:8080|:8000"
echo ""

# 测试本地访问
echo "💻 测试本地访问:"
for port in 80 3000 8080 8000; do
    if netstat -tln | grep -q ":$port "; then
        echo -n "   端口 $port: "
        curl -s -o /dev/null -w "%{http_code}" http://localhost:$port/ 2>/dev/null || echo "失败"
        echo " - HTTP状态"
    fi
done
echo ""

# 检查防火墙
echo "🛡️ 检查防火墙:"
if command -v ufw &> /dev/null; then
    ufw status
elif command -v firewall-cmd &> /dev/null; then
    firewall-cmd --list-all
else
    echo "   未找到常见防火墙工具"
fi
echo ""

# 检查云服务器安全组提示
echo "☁️ 云服务器安全组检查:"
echo "   如果无法从外部访问，可能是云服务器的安全组未开放端口。"
echo "   需要登录云控制台，在安全组中开放以下端口:"
echo "   - 80 (HTTP)"
echo "   - 3000 (开发端口)"
echo "   - 8080 (备用端口)"
echo ""

# 提供解决方案
echo "🚀 解决方案:"
echo "   1. 使用Nginx反向代理（推荐）"
echo "   2. 配置云服务器安全组开放端口"
echo "   3. 使用Cloudflare Tunnel等内网穿透"
echo "   4. 使用更简单的静态托管服务"
echo ""

# 当前可用的访问方式
echo "🌐 当前可用的访问方式:"
echo "   1. 服务器本地: http://localhost:8080"
echo "   2. 同一内网: http://$(hostname -I | awk '{print $1}'):8080"
echo "   3. 公网访问: http://$SERVER_IP:8080 (需要安全组开放)"
echo ""

echo "📞 如需进一步帮助，请提供:"
echo "   1. 云服务器提供商（腾讯云/阿里云/AWS等）"
echo "   2. 错误截图或描述"
echo "   3. 使用的浏览器和设备"