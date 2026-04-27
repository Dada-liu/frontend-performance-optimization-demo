import React, { useState, useMemo } from 'react';

// 生成模拟数据
const generateData = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: ['活跃', '未激活', '待审核'][i % 3],
    amount: (Math.random() * 10000).toFixed(2),
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString()
  }));

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [data] = useState(() => generateData(1000));

  const filteredData = useMemo(() => {
    let result = [...data];

    // 筛选
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 排序
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [data, searchTerm, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">管理系统</div>
        <nav>
          <a href="#" className="active">数据分析</a>
          <a href="#">用户管理</a>
          <a href="#">订单管理</a>
          <a href="#">系统设置</a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>数据分析</h1>
        </header>

        <div className="toolbar">
          <input
            type="text"
            placeholder="搜索用户名或邮箱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="data-count">共 {filteredData.length} 条数据</span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('name')}>用户名 {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('email')}>邮箱 {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('status')}>状态 {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('amount')}>金额 {sortField === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('date')}>日期 {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 100).map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    <span className={`status status-${item.status}`}>{item.status}</span>
                  </td>
                  <td>¥{item.amount}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;
