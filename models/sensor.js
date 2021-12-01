const Environment = require('../config/environment');
const db = require('../database');
const Common = require('./common');


const logger = require('log4js').getLogger('sensor');
logger.level = 'error'; // Environment.logLevel; // 'debug';


const chartSetDataEmpty = [
    {
      name: 'Nitrogen (No Data)',
      series: [
      ],
      seriesName: '',
      categories: [],
      label: 'Nitrogen (No Data)',
      min: 0,
      max: 0,
      sum: 0,
      avg: 0,
      color: '#a52a2a',
      maxVal: 600,
      unit: 'mg/dL'
    },
    {
      name: 'Phosphorous (No Data)',
      series: [],
      seriesName: '',
      categories: [],
      label: 'Phosphorous (No Data)',
      min: 0,
      max: 0,
      sum: 0,
      avg: 0,
      color: '#d2b48c',
      maxVal: 600,
      unit: 'mg/dL'
    },
    {
      name: 'Potassium (No Data)',
      series: [],
      seriesName: '',
      categories: [],
      label: 'Potassium (No Data)',
      min: 0,
      max: 0,
      sum: 0,
      avg: 0,
      color: '#00ffff',
      maxVal: 600,
      unit: 'ppm'
    },
    {
      name: 'Light (No Data)',
      series: [],
      seriesName: '',
      categories: [],
      label: 'Light (No Data)',
      min: 0,
      max: 0,
      sum: 0,
      avg: 0,
      color: '#ffff00',
      maxVal: 600,
      unit: 'lux'
    },
    {
      name: 'SoilMoisture (No Data)',
      series: [],
      seriesName: '',
      categories: [],
      label: 'SoilMoisture (No Data)',
      min: 0,
      max: 0,
      sum: 0,
      avg: 0,
      color: '#778899',
      maxVal: 600,
      unit: 'percent'
    },
    {
      name: 'Temperature (No Data)',
      series: [],
      seriesName: '',
      categories: [],
      label: 'Temperature (No Data)',
      min: 0,
      max: 0,
      sum: 0,
      avg: 0,
      color: '#ff0000',
      maxVal: 600,
      unit: 'Farenheiht'
    },
    {
      name: 'Pressure (No Data)',
      series: [],
      seriesName: '',
      categories: [],
      label: 'Pressure (No Data)',
      min: 0,
      max: 0,
      sum: 0,
      avg: 0,
      color: '#808080',
      maxVal: 100,
      unit: 'psi'
    },
    {
      name: 'Altitude (No Data)',
      series: [],
      seriesName: '',
      categories: [],
      label: 'Altitude (No Data)',
      min: 0,
      max: 0,
      sum: 0,
      avg: 0,
      color: '#0000ff',
      maxVal: 600,
      unit: 'mbar'
    },
    {
      name: 'Humidity (No Data)',
      series: [],
      seriesName: '',
      categories: [],
      label: 'Humidity (No Data)',
      min: 0,
      max: 0,
      sum: 0,
      avg: 0,
      color: '#00ffff',
      maxVal: 600,
      unit: ''
    },
    {
      name: 'WaterFlow (No Data)',
      series: [],
      seriesName: '',
      categories: [],
      label: 'WaterFlow (No Data)',
      min: 0,
      max: 0,
      sum: 0,
      avg: 0,
      color: '#008000',
      maxVal: 600,
      unit: 'per min'
    }
  ]


module.exports.getLatestReading =  async (callback) => {
    let sqlQuery = `SELECT * from  env_data`;
    sqlQuery += ` order by timestamp desc limit 1;`;

    logger.info('sqlQuery', sqlQuery);

    db.query(sqlQuery, function (err, result, fields) {
        if (err) {
            logger.error('Error on getLatestReading', err);
            callback(err,null);
        } else {
            logger.info('result here', result);
            callback(null,result);
        }
    });
};

module.exports.getChartDataByRange = async (dtgrp, callback) => {

    let nowDt = Common.addDays(new Date(), 0);
    let dtStart = new Date();
    let dtEnd = new Date();

    logger.info('getChartDataByRange', dtgrp);
    let sqlQuery = `SELECT * from  env_data`;
    if (dtgrp === 'today') {
        // sqlQuery += ` order by created;`;
        dtStart.setHours(0);
        dtStart.setMinutes(0);
        dtEnd.setHours(23);
        dtEnd.setMinutes(59);
        logger.info('THIS WEEK', dtStart, dtEnd)
    } else if (dtgrp === 'thiswk') {
        // sqlQuery += ` order by created;`;
        let firstDayOfWeek = dtStart.getDate() - dtStart.getDay();
        dtStart.setDate(firstDayOfWeek);
        dtStart.setHours(0);
        dtStart.setMinutes(0);
        dtEnd.setHours(23);
        dtEnd.setMinutes(59);
        logger.info('THIS WEEK', dtStart, dtEnd)
    } else if (dtgrp === 'lastwk') {
        logger.info('dtStart', dtStart);
        dtStart = Common.addDays(dtStart, -7);
        logger.info('dtStart', dtStart);
        logger.info('dtStart.getDate()', dtStart.getDate());
        logger.info('dtStart.getDay()', dtStart.getDay());
        let firstDayOfWeek = dtStart.getDate() - dtStart.getDay();
        logger.info('firstDayOfWeek', firstDayOfWeek);
        dtStart.setDate(firstDayOfWeek); 
        dtStart.setHours(0);
        dtStart.setMinutes(0);
        dtEnd = Common.addDays(dtStart, +6);
        console.log(dtEnd);
        dtEnd.setHours(23);
        dtEnd.setMinutes(59);
        logger.info('LAST WEEK', dtStart, dtEnd)
    } else if (dtgrp === 'thismonth') {
        dtStart.setDate(1);
        dtStart.setHours(0);
        dtStart.setMinutes(0);
        dtEnd.setHours(23);
        dtEnd.setMinutes(59);
        logger.info('THIS MONTH', dtStart, dtEnd)
    } else if (dtgrp === 'lastmonth') {
        dtStart.setDate(0);
        dtStart.setHours(0);
        dtStart.setMinutes(0);
        dtStart.setDate(1);
        dtEnd.setDate(0);
        dtEnd.setHours(0);
        dtEnd.setHours(23);
        dtEnd.setMinutes(59);
        logger.info('LAST MONTH', dtStart, dtEnd)
    } else if (dtgrp === 'thisyear') {
        dtStart.setMonth(0);
        dtStart.setDate(1);
        dtStart.setHours(0);
        dtStart.setMinutes(0);
        dtEnd.setHours(23);
        dtEnd.setMinutes(59);
        logger.info('THIS YEAR', dtStart, dtEnd)
    }

    const dtStart_ = formatDateDb(dtStart);
    const dtEnd_ = formatDateDb(dtEnd);
    logger.info('dtStart_', dtStart_, 'dtEnd_', dtEnd_ );
    logger.info('dtStart_', dtStart, 'dtEnd_', dtEnd, dtgrp);
    sqlQuery += ` where TimeStamp >  '${dtStart_}' and TimeStamp < '${dtEnd_}' `;
    sqlQuery += ` order by timestamp;`;

    logger.info('sqlQuery', sqlQuery);

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
            // logger.info('getChartDataByRange result', result);
            
            if (result && result.length) {
                // logger.error('#RESULT1', result);
                // result.sort(function (a, b) {
                //     if (a['TimeStamp'] > b['TimeStamp']) {
                //       return 1;
                //     }
                // });
                result.sort(function (a, b) { return new Date(a.TimeStamp).getTime() - new Date(b.TimeStamp).getTime(); });
                // logger.error('#RESULT2', result);
                const formatData = true;
                if (formatData) {
                    let ctr = 0;
                    for (const d of result) {
                        // logger.info(d.TimeStamp);
                        const rslt = await setDataAndDateSet(d, dataSet, dateSet);
                        dataSet = rslt.dataSet;
                        dateSet = rslt.dateSet;
                        ctr++;
                        if (ctr >= result.length) {
                            // logger.debug('dataSet', dataSet);
                            // logger.debug('dateSet', dateSet);
                            logger.warn('Calling chartSetData...');
                            // const chartSetData = [];
                            const chartSetData = await setChartDataSet(dataSet, dateSet);
                            // logger.warn('chartSetData', chartSetData);
                            callback(null,chartSetData);
                        }
                    }
                } else {
                    callback(null,result);
                }
            } else {
                callback(null,chartSetDataEmpty);
            }
        }
    });
};

module.exports.listAllV2 = (callback) => {
    let sqlQuery = `SELECT * from  env_data`;
    sqlQuery += ` order by timestamp desc limit 1;`;

    logger.info('sqlQuery', sqlQuery);

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

    logger.info('sqlQuery', sqlQuery);

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
                avg = (sum / value.length) || 0;
                avg = Math.round(avg * 100) / 100
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
                // logger.info,('ctr', ctr);
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
            let oCtr = 0;
            for (const [key, value] of Object.entries(data)) {
                if (key !== 'id' && key !== 'TimeStamp') {
                    dataSet[key].push(value);
                    dateSet[key].push(new Date(data.TimeStamp.getTime()));
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

function formatDateDb(dayt){
    let dt = new Date(dayt);
    var date = '' 
    + dt.getFullYear() + '-'
    + ('0' + (dt.getMonth() + 1)).slice(-2) + '-'
    + ('0' + dt.getDate()).slice(-2) + ' '
    + ('0' + dt.getHours()).slice(-2) + ':'
    + ('0' + dt.getMinutes()).slice(-2);

    return date ;
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