import React, { useState } from 'react';
import ResponsiveImage from './components/ResponsiveImage';

// 生成资讯数据
const generateNews = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `这是一条资讯标题 ${i + 1}，点击查看详情`,
    category: ['科技', '财经', '体育', '娱乐', '国际'][i % 5],
    seed: i,
    author: `记者 ${(i % 10) + 1}`,
    time: `${Math.floor(Math.random() * 24)}小时前`,
    views: Math.floor(Math.random() * 10000)
  }));

function App() {
  const [newsList] = useState(() => generateNews(30));
  const [activeTab, setActiveTab] = useState('推荐');

  const tabs = ['推荐', '科技', '财经', '体育', '娱乐'];

  return (
    <div className="app">
      <header className="header">
        <h1>资讯头条</h1>
      </header>

      <nav className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main className="content">
        <div className="news-list">
          {newsList.map((news) => (
            <article key={news.id} className="news-item">
              <div className="news-image">
                <ResponsiveImage seed={news.seed} alt={news.title} />
              </div>
              <div className="news-info">
                <h3 className="news-title">{news.title}</h3>
                <div className="news-meta">
                  <span className="news-category">{news.category}</span>
                  <span className="news-author">{news.author}</span>
                  <span className="news-time">{news.time}</span>
                </div>
                <div className="news-stats">
                  <span>👁 {news.views}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="footer">
        <a href="#" className="active">首页</a>
        <a href="#">发现</a>
        <a href="#">消息</a>
        <a href="#">我的</a>
      </footer>
    </div>
  );
}

export default App;
