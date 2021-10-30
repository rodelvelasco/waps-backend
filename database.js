const mysql = require('mysql2');
var conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'keldb'
}); 

conn.connect((err) => {
  if (err) {
    // throw err
    console.log('Database is NOT connected successfully !');
  } else {
    console.log('Database is connected successfully !');
  }
});
module.exports = conn;