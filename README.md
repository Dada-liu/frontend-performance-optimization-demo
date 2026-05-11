一个前端性能优化演示项目：

1. 当前仓库包括多个互不关联的项目 demo，使用 monorepo 隔离各个仓库
2. 使用git进行分支和版本管理，分支如下：
    - before-optimization：优化前的代码
    - optimized：优化后的代码
3. 有三个demo
    - 某电商平台首页上线后，用户反馈首屏加载时间长达8秒，移动端低网速环境下白屏时间超过10秒，跳出率高达65%，严重影响用户留存和转化
    - 某后台管理系统的数据分析页面，在加载1000+条数据并展示为表格时，出现滚动卡顿、排序和筛选操作响应延迟（点击后1.5秒左右才出现反馈），用户体验极差。
    - 某资讯类APP的H5页面，在移动端（尤其是中低端机型、4G网络环境下）出现加载慢、滑动卡顿、图片错位等问题，用户投诉率较高。


## 原生项目

见：[vanilla](https://github.com/Dada-liu/frontend-performance-optimization-demo/blob/main/demos/demo1-ecommerce-homepage/vanilla/README.md)

## Webpack 项目

见：[react-webpack](https://github.com/Dada-liu/frontend-performance-optimization-demo/blob/main/demos/demo1-ecommerce-homepage/react-webpack/README.md)


## Vite 项目

见：


---

## 项目总结

### 项目概述

本项目是一个前端性能优化演示项目，通过三个独立 demo 展示不同业务场景下的性能问题诊断与优化策略。项目采用 monorepo 架构，使用 Git 分支管理优化前后的代码对比（`before-optimization` vs `optimized`）。

### Demo 1：电商平台首页（demo1-ecommerce-homepage）

**场景**：首屏加载 8s、移动端白屏 10s+、跳出率 65%。

包含两个子项目：
- **vanilla**：原生 HTML/CSS/JS 实现，通过资源压缩、图片优化、关键 CSS 内联、Nginx Gzip 等手段优化首屏性能
- **react-webpack**：React + Webpack 实现，通过代码分割、Tree Shaking、懒加载、资源压缩等手段减小打包体积，提升加载速度

### Demo 2：后台管理系统表格（demo2-admin-dashboard）

**场景**：1000+ 条数据表格渲染导致滚动卡顿、排序筛选延迟 1.5s。

技术栈：React 18 + Vite 8

已实施的优化：
- **虚拟滚动**：使用 `react-window`（FixedSizeList）仅渲染可视区域内的行，将 10000 条数据的 DOM 节点数从 10000 降至约 20-30 个
- **防抖搜索**：搜索输入增加 300ms 防抖，减少高频搜索逻辑触发
- **数据缓存**：使用 `useMemo` 缓存筛选和排序结果，避免重复计算

### Demo 3：资讯类 H5 页面（demo3-news-h5）

**场景**：移动端加载慢、滑动卡顿、图片错位。

技术栈：React 18 + Vite 8

优化方向：移动端首屏性能、滚动流畅度、图片加载策略。

### 优化技术总览

| 优化手段 | Demo 1 | Demo 2 | Demo 3 |
|---------|--------|--------|--------|
| 代码分割 / 懒加载 | ✓ | - | - |
| Tree Shaking | ✓ | - | - |
| 虚拟滚动 | - | ✓ | - |
| 防抖 / 节流 | - | ✓ | - |
| 图片优化 / 懒加载 | ✓ | - | ✓ |
| 资源压缩（Gzip） | ✓ | - | - |
| 关键 CSS 内联 | ✓ | - | - |
| useMemo / 缓存 | - | ✓ | - |

### 分支策略

- `before-optimization`：优化前的原始代码，保留性能问题用于对比
- `optimized`：优化后的代码，持续集成各项优化措施

### 技术栈

- **构建工具**：Vite 8（demo2、demo3）、Webpack 5（demo1 react-webpack）
- **框架**：React 18
- **包管理**：pnpm（monorepo）
- **关键依赖**：react-window 1.8（虚拟滚动）