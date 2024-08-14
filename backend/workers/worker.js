const { parentPort } = require('worker_threads');
const helpers = require('../services/helpers.js')




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
        //  itognew = await helpers.getDataToInterval(id[0], Math.floor(lastUpdateTime / 1000), Math.floor(currentTime / 1000));
        itognew = await helpers.getDataTemporaryToInterval(id[0], Math.floor(lastUpdateTime / 1000), Math.floor(currentTime / 1000));
        dailyDataStorage[id] = dailyDataStorage[id] ? [...dailyDataStorage[id], ...itognew] : itognew;
        lastUpdateTime = currentTime;
    }
    const alt = quickly(dailyDataStorage[id] || []);
    return alt;
}


function quickly(data) {
    // console.log(data)
    data.sort((a, b) => Number(a.last_valid_time) - Number(b.last_valid_time)); // Упрощённая сортировка
    const allsens = {
        time: [],
        speed: [],
        sats: [],
        geo: [],
        oil: [],
        mileage: [],
        engine: [],
        pwr: [],
        engineOn: [],
        dvs: []
    };
    for (let i = 0; i < data.length; i++) {
        const el = data[i];
        const timestamp = Number(el.last_valid_time);
        allsens.time.push(new Date(timestamp * 1000)); // Напрямую создаём Date
        allsens.speed.push(parseInt(el.speed)); // Предполагаем, что el.speed уже число
        allsens.sats.push(parseInt(el.sats));
        allsens.dvs.push(parseInt(el.engineOn));
        allsens.geo.push([parseFloat(el.lat), parseFloat(el.lon)]);
        el.oil !== null && el.oil !== 'Н/Д' ? allsens.oil.push(Number(Number(el.oil).toFixed(0))) : null;
        el.mileage !== null && el.mileage !== 'Н/Д' ? allsens.mileage.push(Number(Number(el.mileage).toFixed(1))) : null;
        el.engine !== null && el.engine !== 'Н/Д' ? allsens.engine.push(parseInt(el.engine)) : null;
        el.pwr !== null && el.pwr !== 'Н/Д' ? allsens.pwr.push(Number(Number(el.pwr).toFixed(1))) : null;
        el.engineOn !== null && el.engineOn !== 'Н/Д' ? allsens.engineOn.push(parseInt(el.engineOn)) : null;
    }
    const datas = Object.keys(allsens).map(key => ({
        time: allsens.time,
        speed: allsens.speed,
        sats: allsens.sats,
        geo: allsens.geo,
        dvs: allsens.dvs,
        sens: key, // Название сенсора
        params: key, // Параметры
        value: allsens[key] // Значения
    }));
    return datas
}

