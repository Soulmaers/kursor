
const databaseService = require('../services/database.service');

exports.iconFind = async (req, res) => {
    const idw = req.body.idw
    const login = req.body.login
    const icons = await databaseService.iconFindtoBase(idw) //получение назначенных параметров на иконки
    res.json({ result: icons, name: idw, login })
}

exports.icon = async (req, res) => {
    const id = req.body.id
    const param = req.body.param
    const activePost = req.body.activePost
    const idw = req.body.idw
    const coef = req.body.coef
    const icons = await databaseService.iconSaveToBase(activePost, param, coef, id, idw) //сохранение в БД назначенных параметров на иконки
    res.json({ icons })
}


exports.saveList = async (req, res) => {
    const obj = req.body.mass
    const login = req.body.login
    console.log(obj)
    const okey = await databaseService.saveListToBase(obj, login) //сохранение настроек отображения списка
    res.json({ message: okey })
}

exports.viewList = async (req, res) => {
    const login = req.body.login
    const result = await databaseService.viewListToBase(login) //получение настроек отображения списка
    res.json({ res: result })
}

