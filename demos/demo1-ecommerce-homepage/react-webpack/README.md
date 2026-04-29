## 存在的问题

1. 首页加载了大量未压缩的图片（多为PNG格式，单张图片体积超过2MB），且未使用懒加载，首屏加载时一次性请求所有图片资源；

2. JS和CSS资源未压缩、未拆分，主JS文件体积达1.2MB，且未配置CDN，资源加载延迟严重；

3. 首屏关键CSS未内联，外部CSS文件加载延迟导致首屏渲染阻塞；

4. 存在未使用的第三方依赖（如完整引入的lodash库），冗余代码过多。


## 优化后分析

1、压缩图片
1. 【官方方案】使用 image-minimizer-webpack-plugin + sharp 将图片压缩：降至 2.4k
将图片转换为 WebP：降至 4k

注意 sharp 默认只在 production 环境下开启，开发时想要开启要配置；

2. 使用 image-webpack-loader 将 png 图片转换为 base64：降低至 0.3k

3. 图片懒加载
使用原生 `loading="lazy"`

2、JS、CSS 压缩

1. JS 使用 webpack 自带的 Terser 进行压缩
2. CSS 使用 css-minimizer-webpack-plugin 进行压缩

```js
    {
        optimization: {
            minimize: true,
            minimizer: [
                `...`, // 保留默认 JS 压缩：Terser
                new CssMinimizerPlugin(), // 压缩 CSS
            ],
        },
    }
```

    注：JS、CSS、image 压缩，需要设置 optimization.minimize 为 true 来开启


3. JS 分包 + 缓存

通过打包将代码分为 业务逻辑代码包、三方库包、webpack运行时包，并且为每个包的包名加上hash；
在开启http强制缓存时，因为 三方库包 的代码不变，三方库包就可以实现长时间缓存；
并且将 js 代码分割成多个小包可以避免因为一个包太大导致长时间占用http；

```js
{
    // 1、缓存策略（需结合http强缓存）
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js', // 使用 contenthash 利于缓存
        clean: true
    },

    optimization: {
        // 2、分包策略
        // splitChunks: false, // 关闭
        splitChunks: {
            chunks: 'all', // 对所有代码（同步+异步）都拆分
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\]/,
                    name: 'vendors', // 打包成 vendors.js
                    chunks: 'all'
                }
            }
        },
        runtimeChunk: 'single', // 配合缓存策略
    }
}
```

注：
为什么要加 `runtimeChunk: 'single'`?
webpack 打包后的产物包括：
- main（业务逻辑代码）
- vendors（三方库）
- runtime（Webpack 内部的模块加载逻辑、模块 ID 映射表、记录：哪个文件对应哪个模块、怎么加载

如果不加 `runtimeChunk: 'single'`，runtime 会打包进 main 和 vendro 代码里，每次业务逻辑变了都会重新打所有包而重新生成文件hash，这就导致 文件名里加 hash 和 开启http强制缓存 的策略就失效了；


3、关键 CSS 内联，其余 CSS 抽成包然后异步引入

1. 方案一：css-loader、mini-css-extract-plugin.loader 将 css 提取为外部 css 文件，再使用 critical 将首屏 css 内联
2. 方案二：critters-webpack-plugin
基于 critical 的封装

```js
    const Critters = require('critters-webpack-plugin');

    {
        plugins: [
            // 自动内联「初始chunk关键CSS」
            new Critters({
                inline: true,          // 内联关键CSS
                minify: true,           // 压缩内联CSS
                extract: true,           // 提取剩余CSS为外部文件
                publicPath: '/',         // 资源公共路径
                preload: 'media',        // 预加载非关键CSS
            }),
        ]
    }
```


4、将未使用的三方库、代码去除


1. 前提条件
    - 使用 ES6 Module
    - package.json 中增加 sideEffects 字段
    ```json
        {
            // sideEffects: false, // 所有文件都安全，可尽情删除
            // sideEffects: [...] // 列表里的文件不能删，其余可删，CSS文件一定要写
        }
    ```

2. 在 webpack 配置中开启（生产环境默认开启）：
```js
    {
        optimization: {
            usedExports: true // 给没有被使用的 导出 打上标记
        }
    }

```

3. webpack 自带的 Terser 会把标记的代码删除





## 相关知识点

1、JS包通过在 `<script>` 标签上加 `defer="defer"` 属性来实现异步加载

2、Critters 导入外部样式的实现
1. 通过 `media="print"` 来告诉浏览器这是打印样式，需要异步加载；`onload="this.media='all'"` 的作用是外部样式表加载完之后将样式应用到所有设备；
如果 js 被禁用了，使用 `<noscript>` 来兜底；

```html
    <link href="main.381fae1763abf651e5a8.css" rel="stylesheet" media="print" onload="this.media='all'">
    <noscript>
        <link rel="stylesheet" href="main.381fae1763abf651e5a8.css">
    </noscript>
```

3、package.json 中 sideEffects 的作用
告诉 Webpack：哪些文件是 “有副作用” 的，不能随便 Tree Shaking 删掉。