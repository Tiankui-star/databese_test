import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';
const BookList = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    name: '',
    author: '',
    publish: '',
    isbn: '',
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const role = localStorage.getItem('userType');

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:3001/books');
      setBooks(res.data);
    } catch (err) {
      console.error('ERROR!! 获取图书失败', err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAdd = async () => {
    try {
      await axios.post('http://localhost:3001/books', form);
      setForm({ name: '', author: '', publish: '', isbn: '' });
      fetchBooks();
    } catch (err) {
      console.error('ERROR!! 添加失败', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/books/${id}`);
      fetchBooks();
    } catch (err) {
      console.error('ERROR!! 删除失败', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div style={{ padding: 20 }}>
      <LogoutButton />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2> 图书列表</h2>
        <div>
          <span>👤 欢迎：{user?.username}（{role === 'admin' ? '管理员' : '读者'}）</span>
          <button onClick={handleLogout} style={{ marginLeft: 10 }}>退出登录</button>
        </div>
      </div>

      <ul>
        {books.map(book => (
          <li key={book.id}>
            {book.name} - {book.author} ({book.publish}) ISBN: {book.isbn}
            {role === 'admin' && (
              <button onClick={() => handleDelete(book.id)} style={{ marginLeft: 10 }}>删除</button>
            )}
          </li>
        ))}
      </ul>

      {role === 'admin' && (
        <>
          <h3> 添加新图书</h3>
          <input placeholder="书名" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="作者" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
          <input placeholder="出版社" value={form.publish} onChange={e => setForm({ ...form, publish: e.target.value })} />
          <input placeholder="ISBN" value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} />
          <button onClick={handleAdd}>添加</button>
        </>
      )}
    </div>
  );
};

export default BookList;
