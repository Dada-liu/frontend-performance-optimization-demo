一个前端性能优化演示项目：

1. 当前仓库包括多个互不关联的项目 demo，使用 monorepo 隔离各个仓库
2. 使用git进行分支和版本管理，分支如下：
    - before-optimization：优化前的代码
    - optimized：优化后的代码
3. 有三个demo
    - 某电商平台首页上线后，用户反馈首屏加载时间长达8秒，移动端低网速环境下白屏时间超过10秒，跳出率高达65%，严重影响用户留存和转化
    - 某后台管理系统的数据分析页面，在加载1000+条数据并展示为表格时，出现滚动卡顿、排序和筛选操作响应延迟（点击后1.5秒左右才出现反馈），用户体验极差。
    - 某资讯类APP的H5页面，在移动端（尤其是中低端机型、4G网络环境下）出现加载慢、滑动卡顿、图片错位等问题，用户投诉率较高。



## demo1

### 原生项目

见：[vanilla](https://github.com/Dada-liu/frontend-performance-optimization-demo/blob/main/demos/demo1-ecommerce-homepage/vanilla/README.md)

### Webpack 项目

见：[react-webpack](https://github.com/Dada-liu/frontend-performance-optimization-demo/blob/main/demos/demo1-ecommerce-homepage/react-webpack/README.md)


## demo2

见：[demo2-admin-dashboard](https://github.com/Dada-liu/frontend-performance-optimization-demo/blob/main/demos/demo2-admin-dashboard/README.md)

## demo3

见：[demo3-news-h5](https://github.com/Dada-liu/frontend-performance-optimization-demo/blob/main/demos/demo3-news-h5/README.md)