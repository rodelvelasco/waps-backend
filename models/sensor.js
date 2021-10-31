const mysql = require('mysql2');
const Environment = require('../config/environment');
const db = require('../database');
const Common = require('./common');

const logger = require('log4js').getLogger('sensor');
logger.level = Environment.logLevel; // 'debug';


module.exports.getLatestReading = (callback) => {
    let sqlQuery = `SELECT * from  env_data`;
    sqlQuery += ` order by created desc limit 1;`;

    console.log('sqlQuery', sqlQuery);

    db.query(sqlQuery, function (err, result, fields) {
        if (err) {
            logger.error('Error on listAll');
            callback(err,null);
        } else {
            logger.info('result here', result);
            callback(null,result);
        }
    });
};


module.exports.getChartDataByRange = async (dtgrp, callback) => {
    logger.info('getChartDataByRange', dtgrp);
    let sqlQuery = `SELECT * from  env_data`;
    if (dtgrp === 'thisweek') {
        // sqlQuery += ` order by created;`;
    } else if (dtgrp === 'lastweek') {

    } else if (dtgrp === 'thismonth') {

    } else if (dtgrp === 'lastmonth') {

    } else if (dtgrp === 'thisyear') {

    }
    sqlQuery += ` order by created;`;

    console.log('sqlQuery', sqlQuery);

    let dataSet = {
        Nitrogen: [],
        Phosphorous: [],
        Potassium: [],
        Light: [],
        SoilMoisture: [],
        Temperature: [],
        Pressure: [],
        Altitude: [],
        Humidity: [],
        WaterFlow: []
    };

    let dateSet = {
        Nitrogen: [],
        Phosphorous: [],
        Potassium: [],
        Light: [],
        SoilMoisture: [],
        Temperature: [],
        Pressure: [],
        Altitude: [],
        Humidity: [],
        WaterFlow: []
    };

    db.query(sqlQuery, async function (err, result, fields) {
        if (err) {
            logger.error('Error on getChartDataByRange', err);
            callback(err,null);
        } else {
            logger.info('getChartDataByRange result', result.length);
            
            if (result && result.length) {
                const formatData = true;
                if (formatData) {
                    let ctr = 0;
                    for (const d of result) {
                        // logger.debug(d);
                        const rslt = await setDataAndDateSet(d, dataSet, dateSet);
                        dataSet = rslt.dataSet;
                        dateSet = rslt.dateSet;
                        ctr++;
                        if (ctr >= result.length) {
                            logger.debug('dataSet', dataSet);
                            logger.debug('dateSet', dateSet);
                            logger.warn('Calling chartSetData...');
                            // const chartSetData = [];
                            const chartSetData = await setChartDataSet(dataSet, dateSet);
                            logger.warn('chartSetData', chartSetData);
                            callback(null,chartSetData);
                        }
                    }
                } else {
                    callback(null,result);
                }
                
            } else {
                callback(null,null);
            }
        }
    });
};

module.exports.listAllV2 = (callback) => {
    let sqlQuery = `SELECT * from  env_data`;
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
                logger.info('result here', result);
                callback(null,result);
            }
          });
      });
};


// name: 'Temperature',
// series: [30, 40, 45, 50, 49, 60, 70, 91],
// seriesName: '',
// categories: [1633833600001, 1633833600000, 1633833660000, 1633833720000, 1633833780000, 1633833780000,1633833840000, 1633834200000],
// maxVal: 600,
// label: ['Temperature'],
// unit:'Farenheiht',
// avg: 33,
// max: 91,
// min: 30,
// color: '#FF0000'
function setChartDataSet(dataSet, dateSet) {
    return new Promise(resolve => {
        let chartDataSet = [];
        try {
            let ctr = 0;
            for (const [key, value] of Object.entries(dataSet)) {
                let newObj = {
                    name: key,
                    series: value,
                    seriesName: '',
                    categories: [],
                    label: key
                };
                const sum = value.reduce((a, b) => a + b, 0);
                const avg = (sum / value.length) || 0;
                // value.max = function() { return  Math.max.apply(Math, this); }; //attach max funct
                // value.min = function() { return  Math.min.apply(Math, this); }; //attach min funct
                newObj.min = Math.min.apply(null, value);   // 1
                newObj.max = Math.max.apply(null, value);
                newObj.sum = sum;
                newObj.avg = avg;
                // logger.info('key', key);
                // logger.info('newObj', newObj);
                // logger.info('dateSet[key]', dateSet[key]);
                newObj.categories = dateSet[key];
                const chartDef = Common.getCharDefinition(key);
                newObj.color = chartDef.color;
                newObj.maxVal = chartDef.max;
                newObj.unit = chartDef.unit;
                chartDataSet.push(newObj);
                ctr++;
                logger.info,('ctr', ctr);
                if (ctr >= Object.entries(dataSet).length) {
                    resolve(chartDataSet);
                }
            }
            // resove(chartDataSet);
        } catch (error) {
            logger.error('ERROR on setChartDataSet', error);
            resolve(chartDataSet);
        }
    })
}

function setDataAndDateSet(data, dataSet, dateSet) {
    return new Promise(resolve => {
        try {
            // set.Nitrogen.push(data.Nitrogen);
            // set.Phosphorous.push(data.Phosphorous);
            // set.Potassium.push(data.Potassium);
            // set.Light.push(data.Light);
            // set.SoilMoisture.push(data.SoilMoisture);
            // set.Temperature.push(data.Temperature);
            // set.Pressure.push(data.Pressure);
            // set.Altitude.push(data.Altitude);
            // set.Humidity.push(data.Humidity);
            // set.WaterFlow.push(data.WaterFlow);
            logger.warn(Object.entries(data).length);
            logger.warn(Object.entries(data).size);
            let oCtr = 0;
            for (const [key, value] of Object.entries(data)) {
                // logger.debug(key + ' = ' + value);
                if (key !== 'id' && key !== 'Created') {
                    dataSet[key].push(value);
                    dateSet[key].push(data.Created.getTime());
                }
                oCtr++
                if (oCtr >= Object.entries(dataSet).length) {
                    resolve({dataSet: dataSet, dateSet: dateSet});
                }
            }
        } catch (error) {
            logger.error('ERROR on setDataAndDateSet', error);
            resolve({dataSet: dataSet, dateSet: dateSet});
        }
    })
}

function formatDate(dayt){
    let dt = new Date(dayt);
    var date = '' 
    // + dt.getFullYear() + '-'
    + ('0' + (dt.getMonth() + 1)).slice(-2) + '/'
    + ('0' + dt.getDate()).slice(-2);

    var
        hour = dt.getHours(),
        minute = dt.getMinutes(),
        second = dt.getSeconds(),
        hourFormatted1 = hour % 12 || 12, 
        hourFormatted = hour < 10 ? "0" + hour : hour,
        minuteFormatted = minute < 10 ? "0" + minute : minute,
        morning = hour < 12 ? "AM" : "PM";

    var tm = hourFormatted + ":" + minuteFormatted + " " + morning;
    tm = hourFormatted + ":" + minuteFormatted ;

    return date + ' ' + tm ;
}