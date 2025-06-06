import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import './AdminBookList.css';

function AdminBookList() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    name: '', author: '', publish: '', isbn: '', introduction: '', language: '',
    price: '', publish_date: '', type_id: '', status: 0, stock: ''
  });
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:3001/books');
      setBooks(res.data);
    } catch (err) {
      console.error('获取图书失败:', err);
      alert('!! 获取图书失败');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const addBook = async () => {
    try {
      await axios.post('http://localhost:3001/books', {
        ...form,
        price: parseFloat(form.price) || 0,
        type_id: parseInt(form.type_id) || null,
        status: parseInt(form.status) || 0,
        stock: parseInt(form.stock) || 0,
        publish_date: form.publish_date || null
      });
      alert('图书添加成功!');
      setForm({
        name: '', author: '', publish: '', isbn: '', introduction: '', language: '',
        price: '', publish_date: '', type_id: '', status: 0, stock: ''
      });
      fetchBooks();
    } catch (err) {
      console.error('添加图书失败:', err.response?.data || err.message);
      alert('!! 添加图书失败，请检查输入格式');
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/books/${id}`);
      fetchBooks();
    } catch (err) {
      console.error('删除失败:', err);
      alert('删除失败');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <LogoutButton />
      

      <h2>管理员图书管理</h2>
      <button onClick={() => navigate('/lend')}>查看借阅记录</button>
      <button onClick={() => navigate('/readers')}>管理读者</button>
      <button onClick={() => navigate('/types')}>查看图书分类</button>

      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th>ID</th>
            <th>书名</th>
            <th>作者</th>
            <th>出版社</th>
            <th>ISBN</th>
            <th>简介</th>
            <th>语言</th>
            <th>价格</th>
            <th>出版日期</th>
            <th>类型ID</th>
            <th>状态</th>
            <th>库存</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.name}</td>
              <td>{book.author}</td>
              <td>{book.publish}</td>
              <td>{book.isbn}</td>
              <td>{book.introduction || '—'}</td>
              <td>{book.language || '—'}</td>
              <td>￥{book.price?.toFixed(2) || '0.00'}</td>
              <td>{book.publish_date ? new Date(book.publish_date).toLocaleDateString() : '—'}</td>
              <td>{book.type_id ?? '—'}</td>
              <td>{book.status === 0 ? '可借' : '借出中'}</td>
              <td>{book.stock ?? 0}</td>
              <td>
                <button onClick={() => deleteBook(book.id)} style={{ color: 'red' }}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>添加图书</h3>
      <input placeholder="书名" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /><br />
      <input placeholder="作者" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} /><br />
      <input placeholder="出版社" value={form.publish} onChange={e => setForm({ ...form, publish: e.target.value })} /><br />
      <input placeholder="ISBN" value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} /><br />
      <input placeholder="简介" value={form.introduction} onChange={e => setForm({ ...form, introduction: e.target.value })} /><br />
      <input placeholder="语言" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} /><br />
      <input placeholder="价格" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /><br />
      <input placeholder="出版日期 (yyyy-mm-dd)" value={form.publish_date} onChange={e => setForm({ ...form, publish_date: e.target.value })} /><br />
      <input placeholder="类型ID" type="number" value={form.type_id} onChange={e => setForm({ ...form, type_id: e.target.value })} /><br />
      <input placeholder="库存" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} /><br />
      <button onClick={addBook}>添加图书</button>
    </div>
  );
}

export default AdminBookList;
