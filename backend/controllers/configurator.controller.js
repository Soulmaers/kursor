const databaseService = require('../services/database.service');

exports.updateModel = async (req, res) => {
    const idw = req.body.idw
    const massiv = req.body.massModel
    const nameCar = req.body.activePost
    const gosp = req.body.gosp
    const gosp1 = req.body.gosp1
    const frontGosp = req.body.frontGosp
    const frontGosp1 = req.body.frontGosp1
    const message = await databaseService.updateModelSaveToBase(idw, massiv, nameCar, gosp, gosp1, frontGosp, frontGosp1) //добавление, обновление модели объекта в БД
    res.json({ message: 'успех' })
}
exports.tyres = async (req, res) => {
    const nameCar = req.body.activePost
    const tyres = req.body.tyres
    const idw = req.body.idw
    const message = await databaseService.tyresSaveToBase(nameCar, tyres, idw) //добавление, обновление датчиков с колес объекта в БД
    res.json({ message: 'успех' })
}

exports.modalBar = async (req, res) => {
    const value = [req.body.arrValue];
    const message = await databaseService.modalBarSaveToBase(value) // добавление, обновление  пороговых значений давления на колеса осей
    res.json(message)
}

exports.deleteModel = async (req, res) => {
    const idw = req.body.idw
    const message = await databaseService.deleteModelToBase(idw) //удаление модели из БД
    res.json({ message: 'Модель удалена' })
}

exports.deleteTyres = async (req, res) => {
    const idw = req.body.idw
    const message = await databaseService.deleteTyresToBase(idw) //удаление датчиков с колес из БД
    res.json({ message: 'Датчики с колес удалены' })
}
exports.deleteBar = async (req, res) => {
    const idw = req.body.idw
    const message = await databaseService.deleteBarToBase(idw) //удаление пороговых значений давления на колеса осей
    res.json({ message: 'Условия подсветки удалены' })
}

exports.modelView = async (req, res) => {
    const idw = req.body.idw
    const result = await databaseService.modelViewToBase(idw) //получение модели из БД
    res.json({ result: result })
}


exports.tyresView = async (req, res) => {
    const idw = req.body.idw
    const result = await databaseService.tyresViewToBase(idw)//получение датчиков с колес из БД
    res.json({ result: result })
}

exports.barView = async (req, res) => {
    const idw = req.body.idw
    const count = req.body.id
    const result = await databaseService.barViewToBase(idw, count)//получение  пороговых значений давления на колеса осей как все так и по конкретной оси
    res.json(result)
}


exports.lastIdObject = async (req, res) => {
    //   const login = req.body.login
    const result = await databaseService.lastIdObject() //получение id последнего созданного объекта
    res.json(result)
}

exports.lastIdGroup = async (req, res) => {
    //   const login = req.body.login
    const result = await databaseService.lastIdGroup() //получение id последней созданной группы
    res.json(result)
}

exports.saveObject = async (req, res) => {
    const object = req.body.object
    const result = await databaseService.saveObject(object) //сохранение нового объекта в БД
    res.json(result)
}
exports.updateObject = async (req, res) => {
    const object = req.body.object
    const result = await databaseService.updateObject(object) //обновление объекта в БД
    res.json(result)
}


exports.setGroup = async (req, res) => {
    const object = req.body.object
    const result = await databaseService.setGroup(object) //сохранение новой группы в БД
    res.json(result)
}

exports.uniqImeiAndPhone = async (req, res) => {
    const col = req.body.col
    const value = req.body.value
    const table = req.body.table
    const login = req.body.login
    const id = req.body.id
    const result = await databaseService.uniqImeiAndPhone(col, value, table, login, id) //получение совпадающих значений из БД при сохранении нового объекта
    res.json(result)
}
exports.validationCloneGroupName = async (req, res) => {
    const id = req.body.id
    const name = req.body.name
    const login = req.body.login
    const result = await databaseService.validationCloneGroupName(id, name, login) //получение совпадающих имен групп из БД при сохранении новой группы
    res.json(result)
}

exports.updateGroup = async (req, res) => {
    const object = req.body.object
    const result = await databaseService.updateGroup(object) //обновление состава группы в БД
    res.json(result)
}

exports.getObjects = async (req, res) => {
    const login = req.body.login
    const result = await databaseService.getObjects(login) //получение объектов из БД
    res.json(result)
}
exports.getGroups = async (req, res) => {
    const login = req.body.login
    const result = await databaseService.getGroups(login) //получение групп из БД
    res.json(result)
}
exports.getIdGroup = async (req, res) => {
    const id = req.body.id
    const result = await databaseService.getIdGroup(id) //полчение группы по id
    res.json(result)
}

exports.setSubGroups = async (req, res) => {
    const subgroups = req.body.subgroups
    const object = req.body.object
    const result = await databaseService.setSubGroups(subgroups, object) //обновление состава подгрупп в БД
    res.json(result)
}
