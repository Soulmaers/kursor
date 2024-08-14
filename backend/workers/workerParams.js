

const { parentPort } = require('worker_threads');
const databaseService = require('../services/database.service');




parentPort.on('message', (idw) => {
    processSensorData(idw)
        .then(processedData => {
            parentPort.postMessage(processedData);
        })
        .catch(error => {
            parentPort.postMessage({ error: error.message });
        });
});

async function processSensorData(idw) {
    const result = await databaseService.getSensStorMeta(idw)  //получение привязанных параметров по объекту
    return result
}