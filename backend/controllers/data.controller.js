

const databaseService = require('../services/database.service');
const getDataObjectsToList = require('../services/GetDataObjectsToList')


//готовим данные и отправляем ответ на клиент который отрисовывает список
exports.dannie = async (req, res) => {
    const role = req.body.role
    const incriment = req.body.incriment
       let datas;
    let result;
    try {
        switch (role) {
            case 'Курсор':
                datas = await getDataObjectsToList.getAccountsAddListKursor() //получем данные из БД по объектам wialona
                result = await getDataObjectsToList.getAccountGroupsAndObjects(datas) //получем данные из БД по объектам wialona
                res.json({ result });
                break;
            case 'Интегратор':
                datas = await getDataObjectsToList.getAccountsAddListIntegrator(incriment) //получем данные из БД по объектам wialona
                result = await getDataObjectsToList.getAccountGroupsAndObjects(datas) //получем данные из БД по объектам wialona
                res.json({ result });
                break;
            case 'Сервис-инженер':
                datas = await getDataObjectsToList.getAccountsAddListIngener(incriment) //получем данные из БД по объектам wialona
                result = await getDataObjectsToList.getAccountGroupsAndObjects(datas) //получем данные из БД по объектам wialona
                res.json({ result });
                break;

            default: result = await getDataObjectsToList.getUserGroupsAndObjects(incriment) //получем данные из БД по объектам wialona
                               res.json({ result });
        }

    }
    catch (e) {
        console.log(e)
    }
}


exports.viewLogs = async (req, res) => {
    const login = req.body.login;
    const data = req.body.quantity ? await databaseService.quantitySaveToBase(login, req.body.quantity) : await databaseService.quantitySaveToBase(login) //сохраняем в БД счетчик просмотренных логов
    res.json(data)
}




