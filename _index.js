/*
* ############## DEPENDENCIES ##############
* */
require('dotenv-safe').config();
const Koa = require('koa');
const mongoose = require('mongoose');
const serve = require('koa-static');
const restify = require('./middlewares/index');
const { App } = require('./modules/initializators');
const { serverConfig } = require('./config');
const verifyCorsOrigin = require('./utils/verifyCorsOrigin');

// application instances
const app = new Koa();
/*
app.proxy = true;
*/

const server = new App({
  app
});

/**
 * ############## MIDDLEWARES ##############
 */

app.use(require('@koa/cors')({
  otigin: verifyCorsOrigin
}));


app.use(serve('./front'));
app.use(restify());

/**
 * ############## ROUTES ##############
 */
require('./routes')(app);

/**
 * ############## RUN SERVER ##############
 */

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'keldb'
});

const { port } = serverConfig;
server.run({ port }).catch((err) => {
  console.error(err);
});

