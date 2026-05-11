
## 存在的问题
1、未做大数据渲染优化，一次性渲染1000+条数据，生成大量DOM节点（超过2000个），导致滚动时频繁重排重绘，主线程阻塞；

2、排序和筛选操作未做防抖处理，用户每输入一个字符或点击一次排序按钮，就触发一次数据计算和DOM更新，频繁占用主线程；

3、表格组件未做缓存，每次筛选和排序后，都会重新创建所有表格行组件，组件重复渲染严重；四是存在定时器泄漏，页面切换后，数据刷新定时器未清理，持续占用内存和主线程资源。


## 优化后分析

## 大数据渲染优化
使用 react-window 来实现虚拟列表，这样能减少屏幕首次渲染需要挂载的dom和绘制的时间，从而缩短 FCP 的时间

## 防抖处理

筛选时加上防抖，避免因为筛选值的频繁变更带来表格的频繁重新渲染

```js

export function debounce(func, delay) {

    let timer;

    return function (...agrs) {

        if (timer) cancelTimeout(timer)

        timer = setTimeout(() => {
            func(...agrs)
        }, delay)
    }
}

```

## 表格组件做缓存

---

## 进一步优化建议

以下是对当前代码审查后发现的潜在优化方向，按优先级排列：

### 一、高优先级（效果明显，改动量小）

#### 1. 构建配置优化

当前 `vite.config.js` 未配置生产构建优化，建议添加：

```js
// vite.config.js
export default defineConfig({
  build: {
    target: 'es2020',           // 减少 polyfill 体积
    cssMinify: true,            // CSS 压缩
    rollupOptions: {
      output: {
        manualChunks: {         // 分包策略
          vendor: ['react', 'react-dom'],
          'react-window': ['react-window'],
        },
      },
    },
  },
});
```

**收益**：减小打包体积，分离第三方库利用浏览器缓存。

#### 2. 避免排序时不必要的数组复制

当前 `useMemo` 中使用 `[...data]` 每次都复制 10000 条数据的数组：

```js
// 当前：不必要的 O(n) 内存复制
let result = [...data];

// 优化：filter 已返回新数组，无需提前复制
const filteredData = useMemo(() => {
  let result = data; // 不复制

  if (debouncedSearch) {
    result = result.filter(...); // filter 返回新数组
  }

  // sort 会修改原数组，但 filter 已产生新数组，安全
  return [...result].sort(...);
}, [data, debouncedSearch, sortField, sortOrder]);
```

**收益**：减少每次搜索/排序时的内存分配和 GC 压力。

#### 3. 虚拟列表 overscanCount 调优

当前未设置 `overscanCount`，默认仅渲染可视区 + 1 行，快速滚动时可能出现空白：

```jsx
<List
  overscanCount={5}    // 预渲染可视区外 5 行，减少滚动白屏
  itemData={filteredData}  // 通过 itemData 传递，避免闭包陈旧引用
  ...
>
  {Row}
</List>
```

**收益**：提升快速滚动时的视觉流畅度，消除白屏闪烁。

#### 4. 搜索大小写转换缓存

当前 `filter` 中对每个 item 重复调用 `toLowerCase()`：

```js
// 当前：每条数据都现场转小写
item.name.toLowerCase().includes(debouncedSearch.toLowerCase())

// 优化：提前归一化搜索词
const lowerSearch = debouncedSearch.toLowerCase();
result = result.filter(item =>
  item.name.toLowerCase().includes(lowerSearch) ||
  item.email.toLowerCase().includes(lowerSearch)
);
```

**收益**：10000 条数据每次搜索减少约 10000 次 `toLowerCase()` 调用。

#### 5. handleSort 使用 useCallback 包裹

```js
const handleSort = useCallback((field) => {
  setSortField(prevField => {
    if (prevField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
      return prevField;
    }
    setSortOrder('asc');
    return field;
  });
}, []);
```

**收益**：避免子组件因回调引用变化而重渲染。

### 二、中优先级（进一步打磨）

#### 6. CSS 滚动性能优化

为虚拟列表容器添加 GPU 加速提示：

```css
.virtual-list {
  will-change: transform;      /* 提示浏览器该元素会频繁滚动 */
}

.virtual-row {
  contain: layout style;       /* 限制重排范围，隔离行内布局 */
}
```

**收益**：减少滚动时的重排重绘范围，提升低端设备流畅度。

#### 7. 响应式布局适配

当前 sidebar 固定 240px，表格列宽固定百分比，在移动端会溢出：

```css
@media (max-width: 768px) {
  .sidebar {
    width: 60px;
    padding: 10px 0;
  }
  .sidebar .logo { font-size: 0; }
  .sidebar nav a { padding: 12px 8px; font-size: 0; }

  .virtual-cell { padding: 8px 6px; font-size: 12px; }
}
```

**收益**：支持移动端访问场景。

#### 8. 可访问性增强

添加 ARIA 属性提升屏幕阅读器体验：

```jsx
<div className="virtual-table-header" role="row">
  <div role="columnheader" aria-sort={...} tabIndex={0} ...>
```

### 三、低优先级（锦上添花）

#### 9. 数据生成优化

`generateData` 中 `toLocaleDateString` 调用开销较大，可替换为手动拼接：

```js
// 替换 new Date(...).toLocaleDateString()
const y = 2024, m = String(i % 12 + 1).padStart(2, '0');
const d = String((i * 7) % 28 + 1).padStart(2, '0');
date: `${y}/${m}/${d}`
```

#### 10. 表格空状态处理

当搜索结果为空时，可展示占位提示而非空白区域：

```jsx
{filteredData.length === 0 && (
  <div className="empty-state">暂无匹配数据</div>
)}
```

### 优化前后对比总结

| 优化项 | 当前状态 | 建议优化后 |
|--------|---------|-----------|
| 数组复制 | 每次 O(n) 复制 | 复用 filter 返回的新数组 |
| 搜索小写转换 | 每项重复 toLowerCase | 搜索词提前归一化 |
| overscanCount | 未设置（默认1） | 5 行预渲染 |
| handleSort | 普通函数 | useCallback 包裹 |
| 构建分包 | 无分包 | vendor / react-window 分离 |
| CSS 滚动 | 无优化 | will-change + contain |
| 响应式 | 未适配 | 移动端断点适配 |