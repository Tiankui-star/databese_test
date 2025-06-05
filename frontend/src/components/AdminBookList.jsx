import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import './AdminBookList.css';
function AdminBookList() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ name: '', author: '', publish: '', isbn: '' });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/books')
      .then((res) => setBooks(res.data))
      .catch((err) => {
        console.error('获取图书失败:', err);
        alert('!! 获取图书失败');
      });
  }, []);

  const addBook = async () => {
    const { name, author, publish, isbn } = newBook;

    // 添加字段校验
    if (!name.trim() || !author.trim() || !publish.trim() || !isbn.trim()) {
      alert('!! 所有字段都不能为空');
      return;
    }

    try {
      await axios.post('http://localhost:3001/books', newBook);
      alert(' 图书添加成功!!!!');
      window.location.reload();
    } catch (err) {
      console.error('添加图书失败:', err.response?.data || err.message);
      alert('!! 添加图书失败，请检查输入格式');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <LogoutButton />
      <h2> 管理员图书管理</h2>
      <button onClick={() => navigate('/lend')}>查看借阅记录</button>
      <h2><button onClick={() => navigate('/readers')}>管理读者</button></h2>

      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.name} - {book.author} - {book.publish} - ISBN: {book.isbn}
          </li>
        ))}
      </ul>
      <h3>添加图书</h3>
      <input
        placeholder="书名"
        value={newBook.name}
        onChange={(e) => setNewBook({ ...newBook, name: e.target.value })}
      /><br />
      <input
        placeholder="作者"
        value={newBook.author}
        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
      /><br />
      <input
        placeholder="出版社"
        value={newBook.publish}
        onChange={(e) => setNewBook({ ...newBook, publish: e.target.value })}
      /><br />
      <input
        placeholder="ISBN"
        value={newBook.isbn}
        onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
      /><br />
      <button onClick={addBook}>添加图书</button>
    </div>
  );
}

export default AdminBookList;
