# CLAUDE.md

使用中文进行交互

## 项目概述

一个前端性能优化演示项目，采用 monorepo 架构。每个 demo 都是独立的项目，展示不同的性能优化场景。

## 项目结构

```
monorepo/
├── demos/
│   ├── ecommerce-homepage/     # 电商平台首页优化
│   ├── admin-dashboard/        # 后台管理系统表格优化
│   └── news-h5/                # 资讯类H5页面优化
├── docs/                       # 文档
└── shared/                     # 共享配置/工具
```

## 分支策略

- `before-optimization`：优化前的原始代码
- `optimized`：优化后的代码
- 每个 demo 都有独立的分支用于优化前后的对比

## Demo 需求

### Demo 1：电商平台首页 (ecommerce-homepage)
- 首屏加载时间需从 8s 优化至 2s 以内
- 移动端低网速环境下白屏时间需从 10s+ 优化至 3s 以内
- 目标降低跳出率至 20% 以下

### Demo 2：后台管理系统表格 (admin-dashboard)
- 1000+ 条数据表格滚动需流畅无卡顿
- 排序和筛选操作反馈需在 100ms 以内（当前 1.5s）

### Demo 3：资讯类H5页面 (news-h5)
- 移动端加载性能优化
- 滑动流畅度优化
- 图片加载优化，解决错位问题

## 命令

由于这是计划中的 monorepo，常用命令包括：

```bash
# 安装所有 demo 的依赖
pnpm install

# 运行指定 demo
pnpm --filter @demo/ecommerce-homepage dev
pnpm --filter @demo/admin-dashboard dev
pnpm --filter @demo/news-h5 dev

# 构建所有 demo
pnpm build

# 运行测试
pnpm test
```

## 关键技术

每个 demo 将展示不同的优化策略：
- 代码分割和懒加载
- 大列表虚拟滚动
- 图片优化和懒加载
- SSR/SSG 方案
- 打包体积优化
