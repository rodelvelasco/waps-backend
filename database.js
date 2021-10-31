const mysql = require('mysql2');
const Environment = require('./config/environment');
const dbConfig = Environment.db;

var conn = mysql.createConnection(dbConfig); 


conn.connect((err) => {
  if (err) {
    // throw err
    console.log('Database is NOT connected successfully !');
  } else {
    console.log('Database is connected successfully !');
  }
});
module.exports = conn;