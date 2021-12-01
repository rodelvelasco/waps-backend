const mysql = require('mysql2');
const Environment = require('./config/environment');
const dbConfig = Environment.db;
// const mariadb = require('mariadb');
// const dbConfigMaria = Environment.dbMaria;

var conn = mysql.createConnection(dbConfig); 
conn.connect((err) => {
  if (err) {
    // throw err
    console.error('err', err);
    console.log('Database is NOT connected successfully !');
  } else {
    console.log('Database is connected successfully !');
  }
});
module.exports = conn;




// const pool = mariadb.createPool(dbConfigMaria);
// // var conn = pool.getConnection();
// pool.getConnection((err) => {
//   if (err) {
//     // throw err
//     console.log('Database is NOT connected successfully !');
//   } else {
//     console.log('Database is connected successfully !');
//   }
// });

// module.exports = pool;

// var mariadb = require('mariadb');
 
// // Create a connection pool
// const pool = mariadb.createPool(dbConfigMaria);
 
// // Expose a method to establish connection with MariaDB SkySQL
// module.exports = Object.freeze({
//   pool: pool
// });

// var conn = mariadb.createConnection(dbConfigMaria);
// module.exports = conn;

// module.exports = {
//   getConnection: function(){
//     return new Promise(function(resolve,reject){
//       pool.getConnection().then(function(connection){
//         resolve(connection);
//       }).catch(function(error){
//         reject(error);
//       });
//     });
//   }
// } 

