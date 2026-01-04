# 🎬 影院在线选座系统 - 前端

基于 Vue 3 + TypeScript + Vite 构建的现代化影院选座系统前端应用。

## 📋 目录

- [技术栈](#技术栈)
- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [可用脚本](#可用脚本)
- [测试账号](#测试账号)
- [功能特性](#功能特性)
- [配置说明](#配置说明)

## 🛠 技术栈

### 核心框架
- **Vue 3.5** - 渐进式JavaScript框架
- **TypeScript 5.8** - 类型安全的JavaScript超集
- **Vite 7.0** - 新一代前端构建工具

### UI与样式
- **CSS3** - 自定义主题样式系统
- **响应式设计** - 移动端适配

### 状态管理与路由
- **Vue Router 4.5** - 路由管理
- **Pinia 3.0** - 状态管理

### HTTP客户端
- **Axios 1.13** - Promise based HTTP客户端

### 开发工具链
- **ESLint + Prettier** - 代码规范和格式化
- **Vue-TSC** - Vue 类型检查

## 📦 环境要求

在开始之前，请确保你的开发环境满足以下要求：

- **Node.js**: 16.x 或更高版本（推荐 18.x 或 20.x）
- **npm**: 7.x 或更高版本（或使用 yarn/pnpm）
- **操作系统**: Windows / macOS / Linux

验证环境：
```bash
node -v    # 检查 Node.js 版本
npm -v     # 检查 npm 版本
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <https://github.com/zhaoweida3214/cinema-frontend.git>
cd cinema-frontend
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置后端 API 地址

项目默认配置后端地址为 `http://localhost:8080`

如需修改，请编辑 `vite.config.ts` 文件中的 proxy 配置：

```typescript
server: {
    port: 5173,
    proxy: {
        '/api': {
            target: 'http://localhost:8080',  // 修改为你的后端地址
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
        }
    }
}
```

### 4. 启动开发服务器

```bash
npm run dev
```

启动成功后，访问 http://localhost:5173 即可看到应用。

> ⚠️ **注意**：前端启动前，请确保后端服务已经运行在 `http://localhost:8080`

### 5. 使用 Nginx 部署版本（建议）

如果不想每次都运行开发服务器，可以直接使用 Nginx 部署：

1. 先构建项目：`npm run build`
2. 进入 `nginx-1.22.0-web` 文件夹，双击 `nginx.exe`
3. 访问 http://localhost:90

## 📁 项目结构

```
cinema-frontend/
├── src/
│   ├── api/              # API 接口封装
│   │   ├── auth.ts       # 登录认证接口
│   │   ├── cinema.ts     # 影院和排片接口
│   │   ├── seats.ts      # 座位和订单接口
│   │   └── request.ts    # Axios 请求配置
│   ├── assets/           # 静态资源
│   │   ├── base.css      # 基础样式
│   │   ├── main.css      # 主样式
│   │   └── theme.css     # 主题样式系统
│   ├── components/       # 公共组件
│   │   └── Toast.vue     # Toast 通知组件
│   ├── router/           # 路由配置
│   │   └── index.ts      # 路由定义
│   ├── stores/           # 状态管理
│   │   └── user.ts       # 用户状态
│   ├── types/            # TypeScript 类型定义
│   │   └── index.ts      # 通用类型
│   ├── utils/            # 工具函数
│   │   └── toast.ts      # Toast 工具
│   ├── views/            # 页面组件
│   │   ├── LoginView.vue         # 登录页面
│   │   ├── CinemaListView.vue    # 影院列表页面
│   │   ├── SeatSelectionView.vue # 座位选择页面
│   │   └── MyOrdersView.vue      # 我的订单页面
│   ├── App.vue           # 根组件
│   └── main.ts           # 应用入口
├── public/               # 公共静态资源
├── index.html            # HTML 模板
├── vite.config.ts        # Vite 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 项目依赖配置
```

## 📜 可用脚本

### 开发模式
```bash
npm run dev
```
启动开发服务器，支持热更新，默认运行在 http://localhost:5173

### 生产构建
```bash
npm run build
```
构建生产版本，输出到 `dist/` 目录

### 预览构建结果
```bash
npm run preview
```
预览生产构建的结果

### 类型检查
```bash
npm run type-check
```
运行 TypeScript 类型检查

### 代码检查
```bash
npm run lint
```
运行 ESLint 并自动修复问题

### 代码格式化
```bash
npm run format
```
使用 Prettier 格式化代码

## 👤 测试账号

系统提供以下测试账号用于开发和演示：

| 用户名 | 密码 | 说明 |
|--------|------|------|
| zhangsan | 123456 | 用户账号 |
| lisi   | 1234 | 用户账号 |

## ✨ 功能特性

### 🎫 用户功能
- **用户登录** - 支持用户名密码登录，带加载动画和表单验证
- **影院浏览** - 查看所有影院信息
- **排片查询** - 按影院和日期筛选排片信息
- **快捷日期选择** - 今天、明天、后天快速切换
- **座位选择** - 可视化座位图，支持选择多个座位
- **价格预览** - 鼠标悬停显示座位价格
- **订单管理** - 查看、支付、取消订单
- **订单筛选** - 按状态筛选订单（全部/待支付/已支付/已取消）
- **倒计时提醒** - 待支付订单过期倒计时

### 🎨 UI/UX 特性
- **Toast 通知** - 优雅的消息提示，替代原生 alert
- **加载动画** - 骨架屏、旋转加载器
- **页面切换动画** - 流畅的路由过渡效果
- **卡片悬停效果** - 交互式卡片动画
- **响应式设计** - 适配移动端和桌面端
- **主题系统** - 统一的颜色和样式变量

### 🔐 安全特性
- **登录验证** - 未登录用户自动跳转登录页
- **会话管理** - 基于 localStorage 的用户状态持久化
- **API 拦截** - 统一的请求/响应拦截处理

## ⚙️ 配置说明

### API 代理配置

项目使用 Vite 的代理功能在开发环境中转发 API 请求：

```typescript
// vite.config.ts
server: {
    port: 5173,
    proxy: {
        '/api': {
            target: 'http://localhost:8080',  // 后端地址
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
        }
    }
}
```

所有以 `/api` 开头的请求都会被代理到后端服务器。

### 路径别名

项目配置了 `@` 别名指向 `src/` 目录：

```typescript
import { something } from '@/utils/helper'
// 等同于
import { something } from './src/utils/helper'
```

## 🚢 生产部署

### 方式一：使用项目配置的 Nginx（推荐）

本项目已经配置好 Nginx 部署环境，开箱即用！

#### 1. 构建项目

```bash
npm run build
```

构建完成后，所有文件将输出到 `dist/` 目录。

#### 2. 启动 Nginx

进入 `nginx-1.22.0-web` 文件夹，双击运行 `nginx.exe`

#### 3. 访问应用

打开浏览器访问：**http://localhost:90**

#### 4. 停止 Nginx

如需停止 Nginx 服务：

```bash
cd nginx-1.22.0-web
nginx.exe -s stop
```

> 💡 **提示**：
> - Nginx 默认监听 90 端口
> - 项目已配置好静态资源服务和 API 代理
> - 确保后端服务运行在 http://localhost:8080

---

### 方式二：自定义 Nginx 部署

如果需要部署到其他 Nginx 服务器：

#### 1. 构建项目

```bash
npm run build
```

#### 2. 配置 Nginx

将 `dist/` 目录中的所有文件复制到 Nginx 的 html 根目录，并配置 Nginx：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/dist;
    index index.html;
    
    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API 代理
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 3. 重启 Nginx

```bash
nginx -t          # 测试配置
nginx -s reload   # 重新加载配置
```

## 🐛 常见问题

### 1. 端口被占用

如果 5173 端口被占用，可以修改 `vite.config.ts` 中的 `server.port` 配置。

### 2. API 请求失败

- 确认后端服务是否正常运行在 http://localhost:8080
- 检查 `vite.config.ts` 中的代理配置是否正确
- 查看浏览器控制台的网络请求详情
- 如果使用 Nginx 部署，确保 Nginx 配置文件中的 API 代理设置正确

### 5. Nginx 无法启动

- 检查 90 端口是否被占用
- 查看 `nginx-1.22.0-web/logs/error.log` 获取错误信息
- 确保没有多个 Nginx 实例同时运行

### 3. 依赖安装失败

尝试清理缓存后重新安装：

```bash
rm -rf node_modules package-lock.json
npm install
```

### 4. TypeScript 类型错误

运行类型检查找出问题：

```bash
npm run type-check
```

## 📝 开发建议

- 使用 Vue DevTools 浏览器扩展进行调试
- 遵循项目的 ESLint 和 Prettier 配置规范
- 提交代码前运行 `npm run lint` 和 `npm run type-check`
- 保持组件的单一职责原则
- 合理使用 TypeScript 类型系统

## 📄 许可证

本项目仅用于学习和教育目的。

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

---

**Happy Coding! 🎉**