import React, { useState, useEffect } from 'react';
// 问题4: 完整引入 lodash（实际上只用到一两个方法）
import _ from 'lodash';

// 模拟商品数据
// 问题1: 使用本地未压缩的大图片（每张 5.9MB）
const generateProducts = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `商品 ${i + 1}`,
    price: (Math.random() * 1000 + 100).toFixed(2),
    // 使用本地大图片，未使用 CDN
    image: `/images/product_${i + 1}.png`
  }));

// 问题4: 实际上只用到 _.cloneDeep，但完整引入了整个 lodash 库
function App() {
  const [products] = useState(() => generateProducts(20));

  // 实际上只用了 lodash 的一个方法
  useEffect(() => {
    const original = { a: 1, b: { c: 2 } };
    const cloned = _.cloneDeep(original);
    console.log('Cloned:', cloned);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="logo">电商平台</h1>
          <nav className="nav">
            <a href="#">首页</a>
            <a href="#">商品分类</a>
            <a href="#">购物车</a>
            <a href="#">我的</a>
          </nav>
        </div>
      </header>

      <main className="main">
        <section className="banner">
          <div className="banner-content">
            <h2>精选商品</h2>
            <p>优质商品等你来选</p>
          </div>
        </section>

        <section className="products">
          <h3>热门商品</h3>
          <div className="product-list">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  className="product-image"
                  src={product.image}
                  alt={product.title}
                  // 问题1: 移除懒加载，首屏一次性加载所有大图片
                />
                <h4 className="product-title">{product.title}</h4>
                <p className="product-price">¥{product.price}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 电商平台 - 性能优化演示</p>
      </footer>
    </div>
  );
}

export default App;
