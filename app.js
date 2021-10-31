
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const compression = require('compression')
const Environment = require('./config/environment');
const sensors = require('./routes/sensors');

const dbConfig = Environment.db;

const log4js = require('log4js');
log4js.configure({
	pm2: true,
	appenders: {
		out: { type: "stdout" }
	},
	categories: {
		default: {
			appenders: [ "out" ],
			level: Environment.logLevel // "debug"
		}
	}
});
const appName = 'app';
const logger = log4js.getLogger(appName);

// Port Number
const port = 3001;

const connection = mysql.createConnection(dbConfig);

const app = express();

// compress all responses
app.use(compression())

// CORS Middleware
app.use(cors());

// Set Static Folder
// app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

app.use('/sensors', sensors);

// One off for testing purposes only
app.get('/theform.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/theform.html'));
});

// Catch all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Be sure to place favicon.ico in /favicon
// app.use(favicon(path.join(__dirname, 'favicon', 'favicon.ico')));


app.use( [handleError] );
/**
 * Create HTTP server
 */

var server = require('http').Server(app);
// var server = http.createServer(app);
// app.io.attach(server);
/**
 * Listen on provided port, on all network interfaces.
 */


// Start Server
logger.info("Start server on port", port);
server.listen(port);
server.on('error', () => {
  logger.error('Server error detected!');
});

server.on('listening', () => {
  logger.info('Server started on port ' + port);
});


function handleError(err,req,res,next){
  var statusCode = err.status || 500;
  var output = {
      status: statusCode,
      success: false,
      msg: err.message,
      errName: err.name,
      errText: err.toString()
    };
    res.status(statusCode).json(output);
}