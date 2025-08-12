
const connection = require('../config/db')
const wialonService = require('../services/wialon.service.js')
const databaseService = require('../services/database.service');
const PDFClassReports = require('../modules/downFile/PDFClassReport.js')

exports.spisok = async (req, res) => {
    const idw = req.body.idw
    const datas = req.body.uniqData
    if (datas) {
        const promises = datas.map(async (idw) => {
            const nameSensors = await databaseService.loadParamsViewList(idw.nameCar, Number(idw), idw); //получение основных данных по объектам из БД
            return { result: nameSensors, idw };
        });
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

exports.wialonObjects = async (req, res) => {
    const params = await databaseService.getWialonObjects() //получение всех объектов wialon из БД
    res.json(params)
}
exports.objectsId = async (req, res) => {
    const idw = req.body.idw
    const params = await databaseService.getObjectsId(idw) //получение объектов wialon по id из БД
    res.json(params)
}

exports.fileDown = async (req, res) => {
    const fs = require('fs');
    const path = require('path');

    try {
        const data = req.body.globalObject;
        const titleName = req.body.selectedText
        const nameObjects = req.body.nameObjects
        console.log('gla')
        //  console.log(nameObjects)
        // Уникальное имя файла
        const filePath = path.join(__dirname, `rep_${Date.now()}.pdf`);
        const instance = new PDFClassReports(nameObjects, titleName, data, filePath);
        console.time('пдф')
        const report = await instance.init();
        console.log('репорт?')
        console.log(report)
        console.timeEnd('пдф')
        // Проверка, что файл создан
        if (!fs.existsSync(report)) {
            return res.status(500).send('Файл не создан');
        }

        // Заголовки
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=filename.pdf');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        // Поток + удаление после отправки
        const fileStream = fs.createReadStream(report);
        fileStream.pipe(res);

        fileStream.on('close', () => {
            fs.unlink(report, (err) => {
                if (err) console.error('Ошибка при удалении файла:', err);
                else console.log('PDF успешно удалён:');
            });
        });

    } catch (error) {
        console.error('Ошибка при создании отчета:', error);
        res.status(500).send('Ошибка генерации PDF');
    }
};

exports.shablons = async (req, res) => {
    const data = await wialonService.getAllShablonsToWialon() //получание шаблонов отчетов wialona
    res.json(data)
}
exports.titleShablon = async (req, res) => {
    const idResourse = req.body.idResourse
    const idShablon = req.body.idShablon
    const idObject = req.body.idObject
    const interval = req.body.interval
    const data = await wialonService.getTitleShablonToWialon(idResourse, idShablon, idObject, interval) //получение названий заголовков отчетом wialona
    res.json(data)
}

exports.quantityLogs = async (req, res) => {
    const login = req.body.login;
    const data = await databaseService.quantityFindToBase(login) // получени счетчика прочитанных логов из БД
    res.json(data)
}

// В контроллере:
exports.file = async (req, res) => {
    const format = req.body.format
    const formatToWialon = req.body.formatToWialon
    const fs = require('fs');
    const data = await wialonService.getFileReportsToWialon(format, formatToWialon) // это путь к PDF файлу //получание файла отчета pdf wialona
    const file = fs.createReadStream(data)
    res.setHeader('Content-Type', `application/${format}`);
    res.setHeader('Content-Disposition', `attachment; filename=filename.${format}`);
    file.pipe(res);
}

exports.chartData = async (req, res) => {
    const interval = req.body.interval
    const idChart = req.body.att
    const data = await wialonService.getChartDatatToWialon(interval, idChart) //получаем данные для отрисовки графика в отчету wialona
    res.json(data)
}


exports.getEventMarkers = async (req, res) => {
    const id = req.body.id
    const t1 = req.body.nowDate
    const t2 = req.body.timeFrom
    const result = await wialonService.getEventFromToDayWialon(id, t1, t2)
    res.json(result)
}