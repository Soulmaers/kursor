
const connection = require('../config/db')
const wialonService = require('../services/wialon.service.js')
const databaseService = require('../services/database.service');

exports.spisok = async (req, res) => {
    const idw = req.body.idw
    const arr = req.body.arrId

    if (arr) {
        const promises = arr.map(async (idw) => {
            const nameSensors = await databaseService.loadParamsViewList(idw, idw);
            return { result: nameSensors, idw };
        });
        // Дождаться завершения всех промисов и вернуть результат
        try {
            const result = await Promise.all(promises);
            res.json({ res: result, id: idw });
        } catch (err) {
            console.error(err);
            res.status(500).send("Произошла ошибка");
        }
    }
    else {

        const result = await databaseService.loadParamsViewList(idw, idw);
        res.json(result)
    }


}
exports.datawialon = async (req, res) => {
    const idw = req.body.idw
    const params = await databaseService.paramsToBase(idw)
    res.json(params)
}
//запрос на wialon и получение параметров по id
exports.parametrs = async (req, res) => {
    const idw = req.body.idw
    const params = await wialonService.getAllParamsIdDataFromWialon(idw)
    res.json(params)
}
//запрос на wialon и получение сенсоров по id
exports.sensors = async (req, res) => {
    const idw = req.body.idw
    //  const timeOld = req.body.timeOld
    // const timeNow = req.body.timeNow
    const params = await wialonService.getAllSensorsIdDataFromWialon(idw)
    res.json(params)
}
//запрос на wialon и получение сенсоров по id
exports.loadInterval = async (req, res) => {
    const idw = req.body.idw
    const timeOld = req.body.timeOld
    const timeNow = req.body.timeNow
    const params = await wialonService.loadIntervalDataFromWialon(idw, timeOld, timeNow)
    res.json(params)
}
//запрос на wialon и получение сенсоров по id
exports.sensorsName = async (req, res) => {
    const idw = req.body.idw
    const login = req.body.login
    const arr = req.body.arr
    if (arr) {
        const promises = arr.map(async (idw) => {
            const nameSensors = await wialonService.getAllNameSensorsIdDataFromWialon(idw, login);
            return { result: nameSensors, idw };
        });

        // Дождаться завершения всех промисов и вернуть результат
        try {
            const result = await Promise.all(promises);
            res.json({ res: result, id: idw });
        } catch (err) {
            console.error(err);
            res.status(500).send("Произошла ошибка");
        }
    }
    else {
        const params = await wialonService.getAllNameSensorsIdDataFromWialon(idw, login)
        res.json(params)
    }

}
exports.lastSensors = async (req, res) => {
    const idw = req.body.idw
    const login = req.body.login
    const arr = req.body.arr
    if (arr) {
        const promises = arr.map(async (idw) => {
            const lastSensors = await wialonService.getLastAllSensorsIdDataFromWialon(idw, login)
            return { result: lastSensors, idw };
        });

        // Дождаться завершения всех промисов и вернуть результат
        try {
            const result = await Promise.all(promises);
            res.json({ res: result, id: idw });
        } catch (err) {
            console.error(err);
            res.status(500).send("Произошла ошибка");
        }
    }
    else {
        const params = await wialonService.getLastAllSensorsIdDataFromWialon(idw, login)
        res.json(params)
    }
}


exports.updateSensors = async (req, res) => {
    const arr = req.body.arr
    try {
        const result = await wialonService.getUpdateLastAllSensorsIdDataFromWialon(arr)
        res.json({ res: result });
    } catch (err) {
        console.error(err);
        res.status(500).send("Произошла ошибка");
    }

}


module.exports.datawialonAll = (req, res) => {
    const idw = req.body.idw
    try {
        const selectBase = `SELECT name, value, status FROM params WHERE idw='${idw}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            res.json({ status: 200, result: results, message: req.body.car })
        })
    }
    catch (e) {
        console.log(e)
    }
}





exports.viewStructura = async (req, res) => {
    const idw = req.body.active
    const t1 = [req.body.tt1]
    const t2 = [req.body.tt2]
    const params = await databaseService.viewStructuraToBase(idw, t1, t2)
    res.json(params)
}
exports.viewChart = async (req, res) => {
    const idw = req.body.active
    const t1 = req.body.t1
    const t2 = req.body.t2
    const params = await databaseService.viewChartDataToBase(idw, t1, t2)
    res.json(params)
}


/*
exports.viewChartGeo = async (req, res) => {
    const arrayId = req.body.arrayId
    const t1 = req.body.nowDate
    const t2 = req.body.timeFrom
    const params = await databaseService.viewChartDataToBaseGeo(arrayId, t1, t2)
    res.json(params)
}*/

exports.shablons = async (req, res) => {
    const data = await wialonService.getAllShablonsToWialon()
    res.json(data)
}
exports.titleShablon = async (req, res) => {
    const idResourse = req.body.idResourse
    const idShablon = req.body.idShablon
    const idObject = req.body.idObject
    const interval = req.body.interval
    const data = await wialonService.getTitleShablonToWialon(idResourse, idShablon, idObject, interval)

    res.json(data)
}

exports.quantityLogs = async (req, res) => {
    const login = req.body.login;
    const data = await databaseService.quantityFindToBase(login)
    res.json(data)
}

// В контроллере:
exports.file = async (req, res) => {
    const format = req.body.format
    const formatToWialon = req.body.formatToWialon
    const fs = require('fs');
    const data = await wialonService.getFileReportsToWialon(format, formatToWialon) // это путь к PDF файлу
    const file = fs.createReadStream(data)
    res.setHeader('Content-Type', `application/${format}`);
    res.setHeader('Content-Disposition', `attachment; filename=filename.${format}`);
    file.pipe(res);
}

exports.chartData = async (req, res) => {
    const interval = req.body.interval
    const data = await wialonService.getChartDatatToWialon(interval)
    res.json(data)
}