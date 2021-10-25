const express = require('express');
const router = express.Router();
const Environment = require('../config/environment');

const Sensor = require('../models/sensor');

const logger = require('log4js').getLogger('sensors');
logger.level = Environment.logLevel; // 'debug';


router.get('/all', function (req, res) {
    logger.info('req', req);
    Sensor.listAll((err, sensors) => {
        if (err) {
            return res.status(500).json({ status: 500, success: false, msg: err });
        } else {
            res.json(sensors);
        }
    });
});

router.get('/byname', function (req, res) {
    logger.info('byname req', req.query);
    Sensor.getSensorByName(req.query.firstname,(err, sensors) => {
        if (err) {
            return res.status(500).json({ status: 500, success: false, msg: err });
        } else {
            res.json(sensors);
        }
    });
});

router.get('/name/:firstname', function (req, res) {
    logger.info('req', req.params);
    Sensor.getSensorByName(req.params.firstname,(err, sensors) => {
        if (err) {
            return res.status(500).json({ status: 500, success: false, msg: err });
        } else {
            res.json(sensors);
        }
    });
});

module.exports = router;