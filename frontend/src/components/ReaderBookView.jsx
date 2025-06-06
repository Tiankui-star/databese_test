// components/ReaderBookView.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';

function ReaderBookView() {
  const [books, setBooks] = useState([]);
  const readerId = JSON.parse(localStorage.getItem('user')).id;
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:3001/books');
      setBooks(res.data);
    } catch (err) {
      console.error('获取图书失败:', err);
      alert('获取图书失败，请稍后重试');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBorrow = async (bookId, stock) => {
    if (stock <= 0) {
      alert('该图书库存为 0，无法借阅');
      return;
    }

    try {
      await axios.post('http://localhost:3001/lend', { bookId, readerId });
      alert('借书成功');
      fetchBooks(); // 重新获取库存
    } catch (err) {
      console.error('借阅失败:', err);
      alert(err.response?.data?.error || '借阅失败，请稍后重试');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      

      <LogoutButton />
      <h2>图书借阅</h2>
      <button onClick={() => navigate('/lend')}>查看我的借阅记录</button>
      <button onClick={() => navigate('/types')}>查看图书分类</button>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.name} - {book.author} - {book.publish} - ISBN: {book.isbn} - 库存: {book.stock}
            <button
              onClick={() => handleBorrow(book.id, book.stock)}
              disabled={book.stock <= 0}
              style={{ marginLeft: 10 }}
            >
              借阅
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReaderBookView;
