// components/LendList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';
function LendList({ userType, readerId }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const url = userType === 'admin' ? 'http://localhost:3001/lend/all' : `http://localhost:3001/lend/${readerId}`;
    axios.get(url).then((res) => setRecords(res.data));
  }, [userType, readerId]);

  const getStatus = (record) => {
    if (!record.backType) return '未归还';
    switch (record.backType) {
      case 1: return '按时归还';
      case 2: return '超时归还';
      case 3: return '遗失';
      default: return '未知';
    }
  };

  return (
    <div style={{ padding: 20 }}>
        <LogoutButton />
      <h2>{userType === 'admin' ? ' 所有借阅记录' : ' 我的借阅记录'}</h2>
      <ul>
        {records.map((rec) => (
          <li key={rec.id}>
             图书: {rec.bookName}, 借出: {new Date(rec.lendDate).toLocaleString()},
            应还: {new Date(rec.backDate).toLocaleString()}, 状态: {getStatus(rec)}
            {userType === 'admin' && `，读者: ${rec.readerName}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LendList;
