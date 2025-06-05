// components/ManageReaders.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageReaders() {
  const [readers, setReaders] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 获取读者列表
  const fetchReaders = async () => {
    try {
      const res = await axios.get('http://localhost:3001/readers');
      setReaders(res.data);
    } catch (err) {
      console.error('获取读者失败', err);
    }
  };

  useEffect(() => {
    fetchReaders();
  }, []);

  // 添加读者
  const handleAdd = async () => {
    try {
      await axios.post('http://localhost:3001/readers', { username, password });
      setUsername('');
      setPassword('');
      fetchReaders(); // 刷新列表
    } catch (err) {
      console.error('添加读者失败', err);
    }
  };

  // 删除读者（可选）
  const handleDelete = (id) => {
  console.log('🧪 handleDelete id =', id);

  axios.delete(`http://localhost:3001/readers/${id}`)
    .then(() => {
      alert('删除成功');
      fetchReaders(); // 删除后刷新列表
    })
    .catch(err => {
      console.error('删除读者失败 AxiosError', err);
      alert('删除失败');
    });
};



  return (
    <div style={{ padding: 20 }}>
      <h2>📋 读者管理</h2>

      <h3>新增读者</h3>
      <input
        placeholder="用户名"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="密码"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={handleAdd}>添加</button>

      <h3>当前读者列表</h3>
      <ul>
        {readers.map((r) => (
          <li key={r.id}>
            {r.username}
            <button onClick={() => handleDelete(r.id)}>删除</button>


          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageReaders;
