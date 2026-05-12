import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// 生成模拟数据
const generateData = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: ['活跃', '未激活', '待审核'][i % 3],
    amount: (Math.random() * 10000 * 100).toFixed(2),
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString()
  }));

const ROW_HEIGHT = 48;
const TABLE_HEADER_HEIGHT = 44;

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [data] = useState(() => generateData(10000));
  const listRef = useRef(null);
  const containerRef = useRef(null);
  const [listHeight, setListHeight] = useState(400);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        setListHeight(containerHeight - TABLE_HEADER_HEIGHT);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const filteredData = useMemo(() => {
    let result = [...data];

    if (debouncedSearch) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          item.email.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [data, debouncedSearch, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const Row = React.useCallback(({ index, style }) => {
    const item = filteredData[index];
    return (
      <div className="virtual-row" style={style}>
        <div className="virtual-cell" style={{ width: '8%' }}>{item.id}</div>
        <div className="virtual-cell" style={{ width: '18%' }}>{item.name}</div>
        <div className="virtual-cell" style={{ width: '25%' }}>{item.email}</div>
        <div className="virtual-cell" style={{ width: '12%' }}>
          <span className={`status status-${item.status}`}>{item.status}</span>
        </div>
        <div className="virtual-cell" style={{ width: '15%' }}>¥{item.amount}</div>
        <div className="virtual-cell" style={{ width: '22%' }}>{item.date}</div>
      </div>
    );
  }, [ filteredData ]);

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

        <div className="table-container" ref={containerRef}>
          <div className="virtual-table-header">
            <div className="virtual-cell header-cell" style={{ width: '8%' }} onClick={() => handleSort('id')}>
              ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
            </div>
            <div className="virtual-cell header-cell" style={{ width: '18%' }} onClick={() => handleSort('name')}>
              用户名 {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </div>
            <div className="virtual-cell header-cell" style={{ width: '25%' }} onClick={() => handleSort('email')}>
              邮箱 {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
            </div>
            <div className="virtual-cell header-cell" style={{ width: '12%' }} onClick={() => handleSort('status')}>
              状态 {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
            </div>
            <div className="virtual-cell header-cell" style={{ width: '15%' }} onClick={() => handleSort('amount')}>
              金额 {sortField === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
            </div>
            <div className="virtual-cell header-cell" style={{ width: '22%' }} onClick={() => handleSort('date')}>
              日期 {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </div>
          </div>
          <List
            ref={listRef}
            overscanCount={5}
            className="virtual-list"
            height={listHeight}
            itemCount={filteredData.length}
            itemSize={ROW_HEIGHT}
            width="100%"
          >
            {Row}
          </List>
        </div>
      </main>
    </div>
  );
}

export default App;
