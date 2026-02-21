# Orpheus 网络访问方案

## 当前状态
- 本地访问：http://localhost:3000
- 局域网访问：http://192.168.68.77:3000

## 方案选择

### 方案 1：Cloudflare Tunnel（推荐）
免费、无需安装、立即使用

**步骤：**
1. 访问：https://try.cloudflare.com
2. 下载 cloudflared
3. 运行：cloudflared tunnel --url http://localhost:3000
4. 获得公网 URL：https://xxx.trycloudflare.com

### 方案 2：ngrok
需要注册，但界面友好

**步骤：**
1. 访问：https://ngrok.com
2. 注册账号
3. 下载 ngrok
4. 运行：ngrok http 3000
5. 获得公网 URL：https://xxx.ngrok.io

### 方案 3：Localtunnel
完全免费，无需注册

**步骤：**
1. npm install -g localtunnel
2. lt --port 3000
3. 获得公网 URL：https://xxx.loca.lt

### 方案 4：固定公网 IP（需要 ISP 支持）
如果你有公网 IP：
1. 配置路由器端口转发（3000 → 你的电脑）
2. 添加防火墙规则
3. 访问：http://你的公网IP:3000

## 推荐
- 快速测试：Cloudflare Tunnel
- 长期使用：ngrok（付费版有固定域名）
- 完全免费：Localtunnel
