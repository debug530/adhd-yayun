#!/bin/bash

echo "🚀 启动 ADHD生活Bingo 服务器..."
echo "================================="

# 停止可能存在的旧进程
pkill -f "python.*http.server" 2>/dev/null

# 使用端口 3000
PORT=3000
SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')

echo ""
echo "📊 服务器信息:"
echo "   公网IP: $SERVER_IP"
echo "   端口: $PORT"
echo "   目录: $(pwd)"
echo ""
echo "🌐 访问地址:"
echo "   http://$SERVER_IP:$PORT"
echo ""
echo "📱 手机直接访问链接:"
echo "   http://$SERVER_IP:$PORT"
echo ""
echo "🔄 启动服务器..."
echo "   按 Ctrl+C 停止服务器"
echo ""
echo "=" * 50
echo ""

# 启动服务器
exec python3 -m http.server $PORT --bind 0.0.0.0