

const { parentPort } = require('worker_threads');
const databaseService = require('../services/database.service');


parentPort.on('message', (data) => {
    const { time1, time2, idw, arrayColumns, num, window } = data;
    processSensorData(time1, time2, idw, arrayColumns, num, window)
        .then(processedData => {
            parentPort.postMessage(processedData);
        })
        .catch(error => {
            console.log('ошибка', error)
            parentPort.postMessage({ error: error.message });
        });
});

async function processSensorData(time1, time2, idw, arrayColumns, num, window) {
    //   console.log(time1, time2, idw, arrayColumns, num, window)
    const result = await databaseService.getParamsToPressureAndOilToBase(time1, time2, idw, arrayColumns, num, window)
    return result
}

