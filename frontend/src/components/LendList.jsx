import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';

function LendList({ userType, readerId }) {
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    const url =
      userType === 'admin'
        ? 'http://localhost:3001/lend/all'
        : `http://localhost:3001/lend/${readerId}`;
    try {
      const res = await axios.get(url);
      setRecords(res.data);
    } catch (err) {
      console.error(' 获取借阅记录失败', err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [userType, readerId]);

  const getStatus = (record) => {
    if (!record.backType) return '未归还';
    switch (record.backType) {
      case 1:
        return '按时归还';
      case 2:
        return '超时归还';
      case 3:
        return '遗失';
      default:
        return '未知';
    }
  };

  const handleReturn = async (id) => {
    try {
      await axios.put(`http://localhost:3001/lend/return/${id}`);
      alert('归还成功！');
      fetchRecords(); // 刷新列表
    } catch (err) {
      console.error('归还失败:', err);
      alert('归还失败');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <LogoutButton />
      <h2>{userType === 'admin' ? '所有借阅记录' : '我的借阅记录'}</h2>
      <ul>
        {records.map((rec) => (
          <li key={rec.id}>
            图书: {rec.bookName}, 借出: {new Date(rec.lendDate).toLocaleString()},
            应还: {new Date(rec.backDate).toLocaleString()}, 状态: {getStatus(rec)}
            {userType === 'admin' && `，读者: ${rec.readerName}`}
            {/* 添加还书按钮：仅读者，未归还 */}
            {userType === 'reader' && (!rec.backType || rec.backType === 0) && (
              <button
                style={{ marginLeft: '10px' }}
                onClick={() => handleReturn(rec.id)}
              >
                归还图书
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LendList;
