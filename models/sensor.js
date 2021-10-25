const mysql = require('mysql2');
const Environment = require('../config/environment');

const logger = require('log4js').getLogger('sensor');
logger.level = Environment.logLevel; // 'debug';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'keldb'
  });

module.exports.listAll = (callback) => {
    let sqlQuery = `SELECT * from  waps_data`;
    sqlQuery += ` order by created desc limit 1;`;

    console.log('sqlQuery', sqlQuery);

    connection.connect((err) => {
        if (err) throw err;
        connection.query(sqlQuery, function (err, result, fields) {
            if (err) {
                logger.error('Error on listAll', error);
                callback(err,null);
            } else {
                logger.info('result', result);
                callback(null,result);
            }
          });
      });
};

module.exports.getSensorByName = (firstname, callback) => {
    logger.info('getSensorByName', firstname);
    let sqlQuery = `SELECT * from test_table where first_name = '${firstname}'`;
    sqlQuery += ` order by first_name;`;

    console.log('sqlQuery', sqlQuery);

    connection.connect((err) => {
        if (err) throw err;
        connection.query(sqlQuery, function (err, result, fields) {
            if (err) {
                logger.error('Error on listAll', error);
                callback(err,null);
            } else {
                logger.info('result', result);
                callback(null,result);
            }
          });
      });
};