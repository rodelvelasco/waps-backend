const envConfigs = require('dotenv');

envConfigs.config({ path: `${__dirname}/../.env` });


const serverConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'keldb',
  port: 3001
};


const whiteList = 'http://localhost:3001' ;

module.exports.backendServer = 'https://node.sensortransport.com';

module.exports.logLevel = 'info';

module.exports = {
  serverConfig,
  dbConfig,
  whiteList
};
