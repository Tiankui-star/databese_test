import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageReaders() {
  const [readers, setReaders] = useState([]);
  const [form, setForm] = useState({
    username: '',
    password: '',
    realName: '',
    sex: '',
    birthday: '',
    address: '',
    tel: '',
    email: '',
  });

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
    const { username, password } = form;
    if (!username || !password) {
      alert('用户名和密码不能为空');
      return;
    }

    try {
      await axios.post('http://localhost:3001/readers', form);
      setForm({
        username: '',
        password: '',
        realName: '',
        sex: '',
        birthday: '',
        address: '',
        tel: '',
        email: '',
      });
      fetchReaders(); // 刷新列表
    } catch (err) {
      console.error('添加读者失败', err);
    }
  };

  // 删除读者
  const handleDelete = (username) => {
    console.log('删除读者 username =', username);
    axios
      .delete(`http://localhost:3001/readers/${username}`)
      .then(() => {
        alert('删除成功');
        fetchReaders();
      })
      .catch((err) => {
        console.error('删除读者失败 AxiosError', err);
        alert('删除失败');
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2> 读者管理</h2>

      <h3>新增读者</h3>
      {[
        ['用户名', 'username'],
        ['密码', 'password'],
        ['真实姓名', 'realName'],
        ['性别', 'sex'],
        ['生日', 'birthday'],
        ['地址', 'address'],
        ['电话', 'tel'],
        ['邮箱', 'email'],
      ].map(([label, key]) => (
        <div key={key}>
          <input
            placeholder={label}
            type={key === 'password' ? 'password' : key === 'birthday' ? 'date' : 'text'}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
          <br />
        </div>
      ))}

      <button onClick={handleAdd}>添加</button>

      <h3>当前读者列表</h3>
      <ul>
        {readers.map((r, index) => (
          <li key={index}>
            {r.username}（{r.realName || '未填写'}）
            <button onClick={() => handleDelete(r.username)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageReaders;
