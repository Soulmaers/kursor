const response = require('../../response')
const connection = require('../config/db')
const wialonService = require('../services/wialon.service.js')
const databaseService = require('../services/database.service');
const { getLog, getSess } = require('./data.controller.js')



let log;
//получаем логин, запрашиваем данные  по всем группам,
//далее запрашиваем параметры по id объекта, 
//после достаем из базы нужные таблицы с моделями, 
//колесами и параметрами, 
//готовим данные и отправляем ответ на клиент который отрисовывает список
exports.dataSpisok = async (req, res) => {
    if (!log) {
        const login = await getLog();
        log = login
    }
    const login = log
    console.log(login + ' ' + 'rrrr');
    const data = await wialonService.getAllGroupDataFromWialon();
    const aLLmassObject = [];
    const arrName = [];
    for (const elem of data.items) {
        const nameGroup = elem.nm;
        const nameObject = elem.u;
        const massObject = [];

        await Promise.all(nameObject.map(async (el) => {
            const all = await wialonService.getAllParamsIdDataFromWialon(el);
            if (!all.item.nm) {
                return;
            }
            const objects = all.item.nm;
            arrName.push(objects)
            const prob = await databaseService.loadParamsViewList(objects, el);
            const massObjectCar = await databaseService.dostupObject(login);
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
};

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
    console.log(idw)
    const idw = req.body.active
    const params = await wialonService.getAllSensorsIdDataFromWialon(idw)
    console.log(params)
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
