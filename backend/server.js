// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db'); // 引入数据库连接配置

const app = express();

app.use(cors());
app.use(express.json());

console.log('🟢 正在启动服务...');

// 获取所有图书信息
app.get('/books', (req, res) => {
  const sql = 'SELECT * FROM book_info';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ 查询图书失败:', err);
      return res.status(500).send('查询失败');
    }
    res.json(results);
  });
});

// 添加图书
app.post('/books', (req, res) => {
  const { name, author, publish, isbn } = req.body;
  if (!name || !author || !publish || !isbn) {
    return res.status(400).send('参数不完整');
  }

  const sql = 'INSERT INTO book_info (name, author, publish, isbn) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, author, publish, isbn], (err, result) => {
    if (err) {
      console.error('❌ 插入图书失败:', err);
      return res.status(500).send('插入失败');
    }
    res.json({ id: result.insertId, message: '图书添加成功' });
  });
});

// 删除图书
app.delete('/books/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM book_info WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) {
      console.error('❌ 删除图书失败:', err);
      return res.status(500).send('删除失败');
    }
    res.json({ message: '图书删除成功' });
  });
});

// ✅ 管理员登录接口
app.post('/login/admin', (req, res) => {
  const username = req.body.username.trim();
  const password = req.body.password.trim();

  console.log('🔐 管理员登录尝试:', `'${username}'`, `'${password}'`);

  const sql = 'SELECT * FROM admin WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('❌ 管理员登录失败:', err);
      return res.status(500).send('数据库错误');
    }
    console.log('🪵 查询结果:', results);
    if (results.length > 0) {
      res.json({ status: 'success', role: 'admin', user: results[0] });
    } else {
      res.status(401).json({ status: 'fail', message: '用户名或密码错误' });
    }
  });
});

// ✅ 读者登录接口
app.post('/login/reader', (req, res) => {
  const username = req.body.username.trim();
  const password = req.body.password.trim();

  console.log('🔐 登录尝试:', username, password);

  const sql = 'SELECT * FROM reader_info WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('❌ 读者登录失败:', err);
      return res.status(500).send('数据库错误');
    }
    if (results.length > 0) {
      res.json({ status: 'success', role: 'reader', user: results[0] });
    } else {
      res.status(401).json({ status: 'fail', message: '用户名或密码错误' });
    }
  });
});

// 📚 获取所有借阅记录（管理员）
app.get('/lend/all', (req, res) => {
  const sql = `
    SELECT lend_list.*, book_info.name AS bookName, reader_info.username AS readerName
    FROM lend_list
    JOIN book_info ON lend_list.bookId = book_info.id
    JOIN reader_info ON lend_list.readerId = reader_info.id
    ORDER BY lend_list.id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ 查询借阅记录失败:', err);
      return res.status(500).send('查询失败');
    }
    res.json(results);
  });
});

// 📖 获取指定读者的借阅记录
app.get('/lend/:readerId', (req, res) => {
  const readerId = req.params.readerId;
  const sql = `
    SELECT lend_list.*, book_info.name AS bookName
    FROM lend_list
    JOIN book_info ON lend_list.bookId = book_info.id
    WHERE readerId = ?
    ORDER BY lend_list.id DESC
  `;
  db.query(sql, [readerId], (err, results) => {
    if (err) {
      console.error('❌ 查询个人借阅记录失败:', err);
      return res.status(500).send('查询失败');
    }
    res.json(results);
  });
});

// ➕ 借书
app.post('/lend', (req, res) => {
  const { bookId, readerId } = req.body;
  const lendDate = new Date();
  const backDate = new Date();
  backDate.setDate(backDate.getDate() + 30); // 默认30天归还期

  const sql = `INSERT INTO lend_list (bookId, readerId, lendDate, backDate) VALUES (?, ?, ?, ?)`;
  db.query(sql, [bookId, readerId, lendDate, backDate], (err, result) => {
    if (err) {
      console.error('❌ 借书失败:', err);
      return res.status(500).send('借书失败');
    }
    res.json({ id: result.insertId, message: '借书成功' });
  });
});

// 🔄 归还图书
app.put('/lend/return/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'UPDATE lend_list SET backType = 1 WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) {
      console.error('❌ 归还失败:', err);
      return res.status(500).send('归还失败');
    }
    res.json({ message: '归还成功' });
  });
});

// 启动服务器
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 服务器运行中： http://localhost:${PORT}`);
});
