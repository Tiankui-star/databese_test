import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';

function TypeTabView() {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/book-types')
      .then(res => setTypes(res.data))
      .catch(err => {
        console.error('获取分类失败', err);
        alert('获取分类失败');
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <LogoutButton />
      <h2>图书分类</h2>
      {types.map((type) => (
        <div key={type.typeId} style={{ marginBottom: 20 }}>
          <h3>{type.typeName}{": "}{type.typeRemark}</h3>
          <ul>
            {type.books.map((book) => (
              <li key={book.id}>
                {book.name} - {book.author} - 库存: {book.stock}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default TypeTabView;
