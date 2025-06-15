const mysql = require('mysql'); // 引入mysql模块

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
}); //向数据库发起连接请求

module.exports = db; // 将db暴露出去,方便其他文件调用
