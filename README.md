# ADHD生活Bingo - 部署指南

## 🎯 项目简介

ADHD生活Bingo是一个为ADHD人群设计的低压力、游戏化日常任务管理工具。通过4×4的Bingo棋盘，用户可以轻松管理日常任务，通过「凑Bingo线」的方式降低执行门槛，建立生活秩序感。

## 📁 文件结构

```
adhd-bingo/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # 交互逻辑
├── manifest.json       # PWA应用清单
├── deploy.sh           # Nginx部署脚本
├── start-server.sh     # 简易HTTP服务器
├── nginx.conf          # Nginx配置
└── README.md           # 本文件
```

## 🚀 部署选项

### 选项1：简易HTTP服务器（推荐测试用）

```bash
# 进入项目目录
cd /root/.openclaw/workspace/adhd-bingo

# 启动服务器
./start-server.sh

# 或手动启动
python3 -m http.server 8080 --bind 0.0.0.0
```

**访问地址：**
- 本地：http://localhost:8080
- 远程：http://你的服务器IP:8080

### 选项2：Nginx部署（生产环境）

```bash
# 1. 安装Nginx
sudo apt-get update
sudo apt-get install -y nginx

# 2. 复制文件到网站目录
sudo mkdir -p /var/www/adhd-bingo
sudo cp -r /root/.openclaw/workspace/adhd-bingo/* /var/www/adhd-bingo/

# 3. 设置权限
sudo chown -R www-data:www-data /var/www/adhd-bingo
sudo chmod -R 755 /var/www/adhd-bingo

# 4. 创建Nginx配置
sudo cp nginx.conf /etc/nginx/sites-available/adhd-bingo
sudo ln -sf /etc/nginx/sites-available/adhd-bingo /etc/nginx/sites-enabled/

# 5. 测试并重启
sudo nginx -t
sudo systemctl restart nginx
```

**访问地址：**
- http://你的服务器IP
- 或配置域名后通过域名访问

### 选项3：静态托管服务

#### GitHub Pages
1. 创建GitHub仓库
2. 上传所有文件到仓库
3. 启用GitHub Pages
4. 访问：https://你的用户名.github.io/仓库名

#### Netlify
1. 注册Netlify账号
2. 拖拽项目文件夹到Netlify
3. 自动部署并生成URL
4. 访问：https://随机名称.netlify.app

#### Vercel
1. 注册Vercel账号
2. 导入GitHub仓库
3. 自动部署
4. 访问：https://随机名称.vercel.app

## 🔧 功能特性

### 已完成功能
- ✅ 4×4 Bingo棋盘布局
- ✅ 点击切换完成状态
- ✅ Bingo线自动检测与庆祝动画
- ✅ 任务编辑（长按格子）
- ✅ 三种预设模板
- ✅ 快捷短语输入
- ✅ 本地存储（localStorage）
- ✅ 响应式设计（手机/平板/电脑）
- ✅ 统计面板（完成数/Bingo数/进度）
- ✅ 分享功能

### 技术特性
- ✅ 纯前端实现（HTML5 + CSS3 + JavaScript）
- ✅ PWA支持（可安装到主屏幕）
- ✅ 离线功能（Service Worker）
- ✅ 深色模式支持
- ✅ 触摸屏优化
- ✅ 键盘快捷键支持

## 📱 移动端优化

- **触摸友好**：大点击区域，适合手指操作
- **手势支持**：长按编辑，点击完成
- **横竖屏适配**：自动调整布局
- **PWA**：可添加到主屏幕，像原生应用一样使用
- **离线使用**：数据保存在本地，无需网络

## 🔒 安全与隐私

- **无登录要求**：无需注册，保护隐私
- **本地存储**：所有数据保存在用户浏览器中
- **无数据上传**：不收集任何用户信息
- **HTTPS支持**：建议部署时启用HTTPS

## 🎨 设计规范

### 配色方案
- 主色：浅蓝 (#E3F2FD) / 明黄 (#FFF9C4)
- 背景：白色 (#FFFFFF)
- 文字：深灰 (#333333)
- 已完成格子：交替使用浅蓝和明黄

### 字体
- 无衬线字体（系统默认）
- 任务文字 ≥ 16px
- 按钮文字 ≥ 14px

### 交互反馈
- 点击缩放动画
- 完成状态淡入效果
- Bingo庆祝动画（彩带+放大文字）
- 操作提示通知

## 📊 性能优化

- **文件压缩**：CSS/JS文件已优化
- **缓存策略**：静态资源长期缓存
- **懒加载**：按需加载资源
- **代码分割**：模块化设计
- **预加载**：关键资源预加载

## 🐛 故障排除

### 无法访问
1. 检查防火墙是否开放端口
   ```bash
   sudo ufw allow 8080/tcp  # 对于8080端口
   sudo ufw allow 80/tcp     # 对于80端口
   ```

2. 检查服务器是否运行
   ```bash
   # 检查Python服务器
   ps aux | grep python
   
   # 检查Nginx
   sudo systemctl status nginx
   ```

3. 检查IP地址是否正确
   ```bash
   curl ifconfig.me
   hostname -I
   ```

### 功能异常
1. 清除浏览器缓存
2. 检查浏览器控制台错误（F12）
3. 确保启用JavaScript
4. 检查localStorage是否可用

### 部署问题
1. Nginx配置测试
   ```bash
   sudo nginx -t
   ```

2. 查看Nginx日志
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

3. 检查文件权限
   ```bash
   ls -la /var/www/adhd-bingo/
   ```

## 🔄 更新与维护

### 更新代码
```bash
# 1. 更新文件
cd /root/.openclaw/workspace/adhd-bingo
# 修改文件...

# 2. 重新部署
./deploy.sh  # 对于Nginx部署
# 或
./start-server.sh  # 对于Python服务器
```

### 备份数据
```bash
# 备份网站文件
tar -czf adhd-bingo-backup-$(date +%Y%m%d).tar.gz /var/www/adhd-bingo/

# 备份Nginx配置
cp /etc/nginx/sites-available/adhd-bingo ~/adhd-bingo-nginx-backup.conf
```

## 📞 支持与反馈

### 测试检查清单
- [ ] 手机端访问正常
- [ ] 点击格子切换状态
- [ ] 长按编辑任务
- [ ] 应用模板功能
- [ ] Bingo检测与动画
- [ ] 本地存储（刷新后恢复）
- [ ] 分享功能
- [ ] 响应式布局

### 问题报告
如果遇到问题，请提供：
1. 浏览器类型和版本
2. 设备类型（手机/平板/电脑）
3. 错误信息（如果有）
4. 操作步骤

## 🎉 开始使用

选择适合你的部署方式，启动服务器后，在手机浏览器中访问提供的URL即可开始使用ADHD生活Bingo！

**祝你使用愉快，建立更好的生活秩序！** 🎯