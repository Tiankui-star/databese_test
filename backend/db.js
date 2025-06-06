const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',      
  user: 'root',           
  password: 'Sun371502!',           
  database: 'book_management', 
  multipleStatements: true 
});


db.connect((err) => {
  if (err) {
    console.error('数据库连接失败:', err);
  } else {
    console.log('已成功连接到数据库');
  }
});

module.exports = db;
