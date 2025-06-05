// components/ReaderBookView.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';

function ReaderBookView() {
  const [books, setBooks] = useState([]);
  const readerId = JSON.parse(localStorage.getItem('user')).id;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/books').then((res) => setBooks(res.data));
  }, []);

  const handleBorrow = (bookId) => {
    axios.post('http://localhost:3001/lend', { bookId, readerId }).then(() => alert('借书成功'));
  };

  return (
    <div style={{ padding: 20 }}>
         <LogoutButton />
      <h2>图书借阅</h2>
      <button onClick={() => navigate('/lend')}>查看我的借阅记录</button>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.name} - {book.author} - {book.publish} - ISBN: {book.isbn}
            <button onClick={() => handleBorrow(book.id)}>借阅</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReaderBookView;