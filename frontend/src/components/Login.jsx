import React, { useState } from 'react';
import axios from 'axios';
import styles from './Login.module.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post(`http://localhost:3001/login/${role}`, {
        username,
        password
      });
      localStorage.setItem('userType', res.data.role);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/books';
    } catch (err) {
      setError('登录失败：用户名或密码错误');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>登录系统</h2>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">管理员</option>
          <option value="reader">读者</option>
        </select>
        <input
          placeholder="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <h2><button onClick={handleLogin}>登录</button></h2>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
