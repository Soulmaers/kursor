//const connection = require('../config/db')
const { connection, sql } = require('../config/db')


module.exports.generate = (req, res) => {
    const id = req.body.newId
    const arr = [req.body.arrNameColId]
    try {
        const selectBase = `SELECT identificator FROM tyresBase WHERE  identificator='${id}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err + 'ошибка33')
            if (results.length > 0) {
                res.json({ boolean: false, message: 'Такой ID есть' })
            }
            else {
                const sql = `INSERT INTO  tyresBase (idw, dataAdd, identificator, nameCar, typeOs, numberOs, idTyres, marka, model, psi,changeBar,
                    probegNow, dateInstall, probegPass, dateZamer, N1, N2, N3, N4, maxMM) VALUES?`;
                connection.query(sql, [arr], function (err, results) {
                    if (err) console.log(err)
                    res.json({ boolean: true, result: id, message: `Колесо установлено` })
                });
            }
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.listTyresId = async (req, res) => {
    try {
        const pool = await connection
        const selectBase = `SELECT * FROM tyresBase WHERE idw=@idw`
        const results = await pool.request().input('idw', req.body.idw).query(selectBase)
        res.json({ result: results.recordset })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.rotate = (req, res) => {
    const id1 = req.body.relArr[0]
    const id2 = req.body.relArr[1]
    try {
        const selectBase = `SELECT * FROM tyresBase WHERE identificator IN('${id1}', '${id2}')`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            res.json({ status: 200, result: results })
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.findId = (req, res) => {
    try {
        const selectBase = `SELECT idw_tyres FROM tyres_table WHERE 1`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            res.json({ status: 200, result: results })
        })
    }
    catch (e) {
        console.log(e)
    }
}


module.exports.findLastId = async (req, res) => {
    try {
        const pool = await connection
        const selectBase = `SELECT TOP 1 idw_tyres FROM tyres_table ORDER BY id DESC`;
        const results = await pool.request()
            .query(selectBase)
        res.json(results.recordset)
    }
    catch (e) {
        console.log(e)
    }
}

module.exports.setModelTyres = async (req, res) => {
    const arrayTyres = req.body.arrayWheel;
    const model = arrayTyres[1]; // Предполагаем, что arrayTyres[1] - это модель

    try {
        const pool = await connection;
        // Проверяем, существует ли уже такая модель в базе данных
        const checkModelQuery = `SELECT uniqTyresID FROM tyres_guide WHERE model = @model`;
        const modelExist = await pool.request()
            .input('model', model)
            .query(checkModelQuery);

        if (modelExist.recordset.length !== 0) {
            // Если модель найдена, обновляем запись
            const updateQuery = `UPDATE tyres_guide
                                 SET marka = @marka, type = @type, size = @size, sezon = @sezon, 
                                     serial = @serial, pasportMileage = @pasportMileage, passportProtektor = @passportProtektor, 
                                     index_speed = @index_speed, index_massa = @index_massa
                                 WHERE model = @model
                                 SELECT uniqTyresID FROM tyres_guide WHERE model = @model`;
            const updateResult = await pool.request()
                .input('marka', arrayTyres[0])
                .input('model', model)
                .input('type', arrayTyres[2])
                .input('size', arrayTyres[3])
                .input('sezon', arrayTyres[4])
                .input('serial', arrayTyres[5])
                .input('pasportMileage', arrayTyres[6])
                .input('index_speed', arrayTyres[7])
                .input('index_massa', arrayTyres[8])
                .input('passportProtektor', arrayTyres[9])
                .query(updateQuery);
            res.json(updateResult.recordset[0].uniqTyresID);
        } else {
            // Если модель не найдена, добавляем новую запись
            const insertQuery = `INSERT INTO tyres_guide(marka, model, type, size, sezon, serial, pasportMileage, passportProtektor, index_speed, index_massa)
                                 OUTPUT INSERTED.uniqTyresID
                                 VALUES(@marka, @model, @type, @size, @sezon, @serial, @pasportMileage, @passportProtektor, @index_speed, @index_massa)`;
            const insertResult = await pool.request()
                .input('marka', arrayTyres[0])
                .input('model', model)
                .input('type', arrayTyres[2])
                .input('size', arrayTyres[3])
                .input('sezon', arrayTyres[4])
                .input('serial', arrayTyres[5])
                .input('pasportMileage', arrayTyres[6])
                .input('index_speed', arrayTyres[7])
                .input('index_massa', arrayTyres[8])
                .input('passportProtektor', arrayTyres[9])
                .query(insertQuery);
            res.json(insertResult.recordset[0].uniqTyresID);
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
};

module.exports.setTyres = async (req, res) => {
    const obj = req.body.object
    console.log('объект?')
    console.log(obj)
    try {
        const pool = await connection;

        const checkModelQuery = `SELECT idw_tyres FROM tyres_table WHERE idw_tyres = @idw_tyres`;
        const modelExist = await pool.request()
            .input('idw_tyres', obj.id)
            .query(checkModelQuery);

        console.log(modelExist.recordset)
        if (modelExist.recordset.length !== 0) {
            // Если модель найдена, обновляем запись
            const updateQuery = `UPDATE tyres_table
                                 SET id_bitrix = @id_bitrix, idw_tyres = @idw_tyres, flag_sklad = @flag_sklad, idObject = @idObject,
                                     nameCar = @nameCar, probegNow = @probegNow, dateZamer = @dateZamer,
                                     N1 = @N1, N2 = @N2, N3 = @N3, N4 = @N4, ostatok = @ostatok, dateInputSklad = @dateInputSklad,
                                     dateOutputSklad = @dateOutputSklad, mileage = @mileage,probegVal = @probegVal,identificator = @identificator,
typeOs = @typeOs,dateInstall = @dateInstall,comment = @comment,uniqTyresID = @uniqTyresID WHERE idw_tyres = @idw_tyres`;
            const updateResult = await pool.request()
                .input('id_bitrix', obj.idBitrix)
                .input('idw_tyres', obj.id)
                .input('flag_sklad', obj.haveOnSklad)
                .input('idObject', obj.idObject)
                .input('nameCar', obj.nameCar)
                .input('probegNow', obj.probegNow)
                .input('dateZamer', obj.dateZamer)
                .input('N1', obj.N1)
                .input('N2', obj.N2)
                .input('N3', obj.N3)
                .input('N4', obj.N4)
                .input('ostatok', obj.ostatok)
                .input('dateInputSklad', obj.dateInputSklad)
                .input('dateOutputSklad', obj.dateOutputSklad)
                .input('mileage', obj.mileage)
                .input('probegVal', obj.probegVal)
                .input('identificator', obj.identificator)
                .input('typeOs', obj.typeOs)
                .input('dateInstall', obj.dateInstall)
                .input('comment', obj.comment)
                .input('uniqTyresID', obj.uniqTyresID)
                .query(updateQuery);
            res.json('Данные обновлены');
        } else {
            // Если модель не найдена, добавляем новую запись
            const insertQuery = `INSERT INTO tyres_table(id_bitrix, idw_tyres, flag_sklad, idObject, nameCar, probegNow, dateZamer, N1, N2, N3,N4,ostatok,dateInputSklad,
                dateOutputSklad,mileage,probegVal,uniqTyresID,identificator,typeOs,dateInstall,comment)
                   VALUES(@id_bitrix, @idw_tyres, @flag_sklad, @idObject, @nameCar, @probegNow, @dateZamer, @N1, @N2, @N3,@N4,@ostatok,
                    @dateInputSklad,@dateOutputSklad,@mileage,@probegVal,@uniqTyresID,@identificator,@typeOs,@dateInstall,@comment)`;
            const insertResult = await pool.request()
                .input('id_bitrix', obj.idBitrix)
                .input('idw_tyres', obj.id)
                .input('flag_sklad', obj.haveOnSklad)
                .input('idObject', obj.idObject)
                .input('nameCar', obj.nameCar)
                .input('probegNow', obj.probegNow)
                .input('dateZamer', obj.dateZamer)
                .input('N1', obj.N1)
                .input('N2', obj.N2)
                .input('N3', obj.N3)
                .input('N4', obj.N4)
                .input('ostatok', obj.ostatok)
                .input('dateInputSklad', obj.dateInputSklad)
                .input('dateOutputSklad', obj.dateOutputSklad)
                .input('mileage', obj.mileage)
                .input('probegVal', obj.probegVal)
                .input('uniqTyresID', obj.uniqTyresID)
                .input('identificator', obj.identificator)
                .input('typeOs', obj.typeOs)
                .input('dateInstall', obj.dateInstall)
                .input('comment', obj.comment)
                .query(insertQuery);

            res.json('Данные добавлены');
        }
    } catch (e) {
        console.log(e);
        res.status(500).json('Ошибка выполнения запроса');
    }
};

module.exports.setTyresHistory = async (req, res) => {
    const date = new Date(); // Получаем текущую дату и время
    const year = date.getFullYear(); // Получаем год
    const month = date.getMonth() + 1; // Получаем месяц (getMonth возвращает месяцы от 0 до 11)
    const day = date.getDate(); // Получаем день
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    const dataAdd = `${year}-${formattedMonth}-${formattedDay}`;
    const unix = Math.floor(date.getTime() / 1000)
    const obj = req.body.object
    if (obj.id === null) {
        res.json('Пустой объект')
        return
    }
    try {
        const pool = await connection
        const post = `INSERT INTO tyres_history(login,id_bitrix,id,idObject,nameCar,identificator,typeOs, numberOs,uniqTyresID, 
            psi,bar,probegNow,probegVal,dateInstall,dateZamer,N1,N2,N3,N4,ostatok,rfid,comment,dateInputSklad,
            dateOutputSklad,haveOnSklad,dataAdd ,unix, mileage)
                    VALUES(@login,@id_bitrix,@id,@idObject,@nameCar,@identificator,@typeOs, @numberOs,@uniqTyresID,
            @psi,@bar,@probegNow,@probegVal,@dateInstall,@dateZamer,@N1,@N2,@N3,@N4,@ostatok,@rfid,@comment,@dateInputSklad,
            @dateOutputSklad,@haveOnSklad, @dataAdd,@unix,@mileage)`
        const result = await pool.request()
            .input('login', obj.login)
            .input('id_bitrix', obj.idBitrix)
            .input('id', obj.id)
            .input('idObject', obj.idObject)
            .input('nameCar', obj.nameCar)
            .input('identificator', obj.identificator)
            .input('typeOs', obj.typeOs)
            .input('numberOs', obj.numberOs)
            .input('uniqTyresID', obj.uniqTyresID)
            .input('psi', obj.psi)
            .input('bar', obj.bar)
            .input('probegNow', obj.probegNow)
            .input('probegVal', obj.probegVal)
            .input('dateInstall', obj.dateInstall)
            .input('dateZamer', obj.dateZamer)
            .input('N1', obj.N1)
            .input('N2', obj.N2)
            .input('N3', obj.N3)
            .input('N4', obj.N4)
            .input('ostatok', obj.ostatok)
            .input('rfid', obj.rfid)
            .input('comment', obj.comment)
            .input('dateInputSklad', obj.dateInputSklad)
            .input('dateOutputSklad', obj.dateOutputSklad)
            .input('haveOnSklad', obj.haveOnSklad)
            .input('dataAdd', dataAdd)
            .input('unix', unix)
            .input('mileage', obj.mileage)
            .query(post);
        res.json('История сохранена')
    }
    catch (e) {
        res.json('Ошибка')
        console.log(e)
    }
}


module.exports.getModelTyres = async (req, res) => {
    try {
        const pool = await connection
        const post = `SELECT * FROM tyres_guide`
        const result = await pool.request()
            .query(post);
        res.json(result.recordset)
    }
    catch (e) {
        res.json('Ошибка')
        console.log(e)
    }
}

module.exports.updateTyres = async (req, res) => {
    const idw = req.body.id;
    const flag = req.body.flag;
    const date = req.body.date
    try {
        const pool = await connection;
        // Сначала проверяем наличие записи
        const checkQuery = `SELECT COUNT(1) as count FROM tyres_table WHERE idw_tyres=@idw_tyres`;
        let checkResult = await pool.request()
            .input('idw_tyres', idw)
            .query(checkQuery);
        // Проверяем, найдена ли запись
        if (checkResult.recordset[0].count > 0) {
            // Если запись найдена, обновляем
            const updateQuery = `
                UPDATE tyres_table
                SET flag_sklad = @flag_sklad, dateOutputSklad=@dateOutputSklad
                WHERE idw_tyres=@idw_tyres`;
            await pool.request()
                .input('idw_tyres', idw)
                .input('flag_sklad', flag)
                .input('dateOutputSklad', date)
                .query(updateQuery);
            res.json('Колесо установлено со склада');
        } else {
            // Если запись не найдена, отправляем сообщение
            res.json('Установите колесо');
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json('Ошибка выполнения запроса');
    }
}

module.exports.updateFilterTable = async (req, res) => {
    const idObject = req.body.idObject
    const idBitrix = req.body.idBitrix
    const id_tyres = req.body.id
    const param = req.body.pressure
    try {
        const pool = await connection
        const post = `UPDATE sens_stor_meta SET idBitrix = @idBitrix, idTyres = @idTyres WHERE idw=@idw AND params=@params`;
        const result = await pool.request()
            .input('idBitrix', idBitrix)
            .input('idTyres', id_tyres)
            .input('idw', idObject)
            .input('params', param)
            .query(post);
        res.json('Фильтрующая таблица обновлена')
    }
    catch (e) {
        res.json('Ошибка')
        console.log(e)
    }
}



module.exports.getTyresToSlad = async (req, res) => {
    try {
        const pool = await connection
        const post = `SELECT tg.*, tt.*
FROM tyres_guide tg
JOIN tyres_table tt ON tg.uniqTyresID = tt.uniqTyresID
WHERE tt.flag_sklad = 0;`;
        const result = await pool.request()
            .query(post);
        res.json(result.recordset)
    }
    catch (e) {
        res.json('Ошибка')
        console.log(e)
    }
}











