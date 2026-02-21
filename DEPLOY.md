# Orpheus 部署到 Vercel - 快速指南

## 方法 1：通过 Vercel 网站（推荐，2分钟搞定）

### 步骤

1. 访问：https://vercel.com/new
2. 使用 GitHub 账号登录（vivaming）
3. 选择仓库：vivaming/Orpheus
4. 点击 "Import"
5. 配置（全部默认即可）：
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next
6. 点击 "Deploy"
7. 等待 2-3 分钟
8. 获得 URL：https://orpheus.vercel.app

## 方法 2：通过 CLI（需要登录）

```bash
cd C:\Users\vivam\Projects\orpheus

# 登录（会打开浏览器）
vercel login

# 部署
vercel --prod
```

## 配置说明

### 环境变量
不需要设置（SQLite 数据库已包含在代码中）

### 音频文件
- ✅ 已包含在 public/audio/
- ✅ 已压缩到 64kbps（110MB）
- ✅ 符合 Vercel 免费额度

### 免费额度
- 带宽: 100GB/月
- 构建: 6000 分钟/月
- 存储: 无限制
- 函数执行: 100GB-Hrs/月

## 预期结果

部署成功后会获得：
- **URL**: https://orpheus.vercel.app
- **自动 HTTPS**: ✅
- **全球 CDN**: ✅
- **自动部署**: 每次 push 到 main 分支自动更新

## 下一步

部署完成后：
1. 访问 https://orpheus.vercel.app
2. 测试播放功能
3. 从手机访问验证
4. 添加更多歌曲（push 到 GitHub 自动更新）

## 注意事项

- ⚠️ SQLite 数据库在 Vercel 上是只读的
- ✅ 建议使用 Vercel Postgres 或 Supabase（如果需要写操作）
- ✅ 当前版本（只读）完全免费

## 当前状态

✅ GitHub 仓库：https://github.com/vivaming/Orpheus
✅ 音频压缩：110MB（64kbps）
✅ 代码已提交：8706 行
✅ 准备部署
