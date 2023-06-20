const response = require('../../response')
const connection = require('../config/db')
const wialonService = require('../services/wialon.service.js')
const databaseService = require('../services/database.service');
const { getSess } = require('./data.controller.js')
const wialonModule = require('../modules/wialon.module');



//получаем логин, запрашиваем данные  по всем группам,
//далее запрашиваем параметры по id объекта, 
//после достаем из базы нужные таблицы с моделями, 
//колесами и параметрами, 
//готовим данные и отправляем ответ на клиент который отрисовывает список
/*exports.dataSpisok = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    res.setHeader('ETag', Math.random().toString(36).substring(2))
    const login = req.body.login
    let kluch;
    if (login == 'Ромакс') {
        kluch = '7d21706dbf99ed8dd9257b8b1fcc5ab3FDEAE2E1E11A17F978AC054411BB0A0CBD9051B3';
    }
    else {
        kluch = '0f481b03d94e32db858c7bf2d8415204289C57FB5B35C22FC84E9F4ED84D5063558E1178';
    }

    try {
        const session = await wialonModule.login(kluch);
        let getSession = await getSess();
        getSession = session
        console.time('getAllGroupDataFromWialon');
        const data = await wialonService.getAllGroupDataFromWialon(login);
        console.timeEnd('getAllGroupDataFromWialon');
        const aLLmassObject = [];
        const arrName = [];
        for (const elem of data.items) {
            const nameGroup = elem.nm;
            const nameObject = elem.u;
            const massObject = [];
            await Promise.all(nameObject.map(async (el, index) => {
                console.time(`getAllParamsIdDataFromWialon${index}`);
                const all = await wialonService.getAllParamsIdDataFromWialon(el, login);
                console.timeEnd(`getAllParamsIdDataFromWialon${index}`);
                if (!all.item.nm) {
                    return;
                }
                const objects = all.item.nm;
                arrName.push(objects)
                console.time(`loadParamsViewList${index}`);
                const prob = await databaseService.loadParamsViewList(objects, el);
                console.timeEnd(`loadParamsViewList${index}`);
                console.time(`dostupObject${index}`);
                const massObjectCar = await databaseService.dostupObject(login);
                console.timeEnd(`dostupObject${index}`);
                if (massObjectCar.includes(prob[0].message.replace(/\s+/g, ''))) {
                    prob.group = nameGroup;
                    massObject.push(prob);
                }
            }));
            const objectsWithGroup = massObject.map(obj => (Object.values({ ...obj, group: nameGroup })));
            aLLmassObject.push(objectsWithGroup);
            aLLmassObject.reverse();
        }
        await res.json({ response: { aLLmassObject, arrName } });
    }
    catch (e) {
        console.log(e)
    }
}*/

exports.spisok = async (req, res) => {
    const idw = req.body.idw
    const result = await databaseService.loadParamsViewList(idw, idw);
    res.json(result)
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
    const params = await wialonService.getAllNameSensorsIdDataFromWialon(idw)
    res.json(params)
}

exports.lastSensors = async (req, res) => {
    const idw = req.body.idw
    const params = await wialonService.getLastAllSensorsIdDataFromWialon(idw)
    res.json(params)
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



/*
async function fnsortTest() {
    console.log('два')
    const test = await wialonLongRequest()
    console.log(test)
}

fnsortTest()*/
