#!/bin/bash

echo "🚀 启动 ADHD生活Bingo 简易HTTP服务器..."
echo "========================================"

# 检查Python3
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 未安装，正在安装..."
    apt-get update && apt-get install -y python3
fi

# 获取服务器IP
SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')
PORT=8080

echo ""
echo "📊 服务器信息:"
echo "   本地IP: $SERVER_IP"
echo "   端口: $PORT"
echo "   目录: $(pwd)"
echo ""
echo "🌐 访问地址:"
echo "   本地: http://localhost:$PORT"
echo "   远程: http://$SERVER_IP:$PORT"
echo ""
echo "📱 手机访问:"
echo "   在手机浏览器中输入: http://$SERVER_IP:$PORT"
echo ""
echo "🛡️ 防火墙提示:"
echo "   如果无法访问，请检查防火墙是否开放端口 $PORT"
echo "   Ubuntu: sudo ufw allow $PORT/tcp"
echo ""
echo "🔄 启动服务器..."
echo "   按 Ctrl+C 停止服务器"
echo ""
echo "=" * 50
echo ""

# 启动HTTP服务器
python3 -m http.server $PORT --bind 0.0.0.0