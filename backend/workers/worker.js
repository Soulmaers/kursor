const { parentPort } = require('worker_threads');
const databaseService = require('../services/database.service.js')



parentPort.on('message', (data) => {
    const { id, lastUpdateTime, dailyDataStorage } = data;
    processSensorData(id, lastUpdateTime, dailyDataStorage)
        .then(processedData => {
            parentPort.postMessage(processedData);
        })
        .catch(error => {
            parentPort.postMessage({ error: error.message });
        });
});

async function processSensorData(id, lastUpdateTime, dailyDataStorage) {
    const currentTime = Date.now();
    let itognew = [];
    if (lastUpdateTime < currentTime) {
        //  itognew = await databaseService.getTemporaryData(Math.floor(lastUpdateTime / 1000), Math.floor(currentTime / 1000), id[0])  //получение параметров за интервал
        const arrayColumns = ['dut', 'last_valid_time', 'lift', 'liftBoolean', 'speed', 'lat', 'lon', 'engineOn', 'pwr', 'oil', 'summatorOil', 'mileage', 'sats', 'engine']

        itognew = await databaseService.getParamsToPressureAndOilToBase(Math.floor(lastUpdateTime / 1000), Math.floor(currentTime / 1000), id[0], arrayColumns, 0)
        itognew.sort((a, b) => {
            return new Date(a.last_valid_time) - new Date(b.last_valid_time);
        });
        //   console.log(itognew)

        dailyDataStorage[id] = dailyDataStorage[id] ? [...dailyDataStorage[id], ...itognew] : itognew;
        lastUpdateTime = currentTime;
    }
    // console.log(dailyDataStorage[id])
    const alt = dailyDataStorage[id] || [] //quickly(dailyDataStorage[id] || []);


    return alt;
}




