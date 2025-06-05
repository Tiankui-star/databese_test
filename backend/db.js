// db.js
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',       // 本地数据库地址（也可为远程IP）
  user: 'root',            // 数据库用户名
  password: 'Sun371502!',            // 数据库密码（根据你实际填写）
  database: 'book_management', // 数据库名，对应你已有的库
  multipleStatements: true // （可选）允许多语句执行
});

// 测试连接
db.connect((err) => {
  if (err) {
    console.error('数据库连接失败:', err);
  } else {
    console.log('✅ 已成功连接到数据库');
  }
});

module.exports = db;
