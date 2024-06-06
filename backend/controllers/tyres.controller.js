const databaseService = require('../services/database.service');
const controllerTyres = require('./tyres.controller.js');
const helpers = require('../services/helpers')
const multer = require('multer');
const path = require('path');
const { connection, sql } = require('../config/db')
// Настройка хранилища multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(path.join(__dirname, '../../public/image/'));
        cb(null, path.join(__dirname, '../../public/image/'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage }).single('image');

exports.saveDataModelTyres = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка при загрузке файла.' });
        }
        const data = req.body; // Получаем данные из запроса
        console.log(data)
        const reduct = data.reduct
        const imagePath = req.file ? `/image/${req.file.filename}` : data.imagePath;
        // Здесь можно сохранить данные в базу данных
        const tyreData = {
            type_tire: data.type_tire,
            marka: data.marka,
            model: data.model,
            type_tyres: data.type_tyres,
            radius: data.radius,
            profil: data.profil,
            width: data.width,
            sezon: data.sezon,
            index_speed: data.index_speed,
            index_massa: data.index_massa,
            imagePath: imagePath
        };
        try {
            console.log(tyreData)
            const result = await databaseService.setModelTyresGuide(tyreData, reduct);
            res.status(200).json('Модель сохранена');
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при сохранении данных в базу данных.' });
        }
    });
};

exports.getModelTyresGuide = async (req, res) => {
    try {
        const pool = await connection
        const post = `SELECT * FROM tyres_model_guide`
        const result = await pool.request()
            .query(post);
        res.json(result.recordset)
    }
    catch (e) {
        res.json('Ошибка')
        console.log(e)
    }
}


exports.getHistoryTyresToID = async (req, res) => {
    const idw_tyres = req.body.idw_tyres
    console.log(idw_tyres)
    try {
        const selectBase = `SELECT  th.*, tg.* FROM tyres_history_tire 
       th JOIN tyres_model_guide tg ON th.uniqTyresID = tg.uniqTyresID 
         WHERE th.idw_tyres = @idw_tyres`
        const pool = await connection
        const results = await pool.request()
            .input('idw_tyres', idw_tyres)
            .query(selectBase)
        console.log(results.recordset)
        res.json(results.recordset.length !== 0 ? results.recordset : [])
    } catch (err) {
        console.error(err)
        throw err
    }
}

exports.getTyresPosition = async (req, res) => {
    const idObject = req.body.idObject
    const identifikator = req.body.identifikator
    try {
        const selectBase = `SELECT  th.*, tg.* FROM tyres_table_tire 
       th JOIN tyres_model_guide tg ON th.uniqTyresID = tg.uniqTyresID 
         WHERE th.idObject = @idObject AND th.identifikator = @identifikator`
        const pool = await connection
        const results = await pool.request()
            .input('idObject', idObject)
            .input('identifikator', identifikator)
            .query(selectBase)
        res.json(results.recordset.length !== 0 ? results.recordset[0] : [])
    } catch (err) {
        console.error(err)
        throw err
    }
}


exports.findLastIdTyres = async (req, res) => {
    try {
        const pool = await connection
        const selectBase = `SELECT TOP 1 idw_tyres FROM tyres_table_tire ORDER BY id DESC`;
        const results = await pool.request()
            .query(selectBase)
        res.json(results.recordset)
    }
    catch (e) {
        console.log(e)
    }
}

exports.saveDataToDBTyres = async (req, res) => {
    const data = req.body.obj;
    data.dateAction = helpers.getCurrentDate();
    console.log(data);

    const inputParams = {
        idw_tyres: data.idw_tyres ?? null,
        uniqTyresID: data.uniqTyresID ?? null,
        dateAction: data.dateAction ?? null,
        flag_status: data.flag_status ?? null,
        id_bitrix: data.id_bitrix_wiew ?? null,
        login: data.login ?? null,
        dateInputSklad: data.dateInputSklad ?? null,
        protektor_passport: data.protektor_passport_wiew ?? null,
        N1: data.N1 ?? null,
        N2: data.N2 ?? null,
        N3: data.N3 ?? null,
        N4: data.N4 ?? null,
        probeg_passport: data.probeg_passport_wiew ?? null,
        probeg_now: data.probeg_now_wiew ?? null,
        probeg_last: data.probeg_last_wiew ?? null,
        ostatok: data.ostatok ?? null,
        psi: data.psi_wiew ?? null,
        bar: data.bar_wiew ?? null,
        rfid: data.rfid_cod ?? null,
        price: data.price_tyres ?? null,
        comments: data.comment ?? null,
        dateZamer: data.dateZamer ?? null,
        dateInstall: data.dateinstall ?? null,
        typeOs: data.typeOs ?? null,
        numberOs: data.numberOs ?? null,
        identifikator: data.identifikator ?? null,
        dateOutputSklad: data.dateOutputSklad ?? null,
        idObject: data.idObject ?? null,
        nameCar: data.nameCar ?? null,
        mileage: data.mileage ?? null
    };

    const queries = [
        {
            query: `
                INSERT INTO tyres_table_tire (
                    idw_tyres, uniqTyresID, dateAction, flag_status, id_bitrix, login, dateInputSklad, protektor_passport, N1, N2, N3, N4, probeg_passport, probeg_now, probeg_last, ostatok, psi, bar, rfid, price, comments, dateZamer
                ) VALUES (
                    @idw_tyres, @uniqTyresID, @dateAction, @flag_status, @id_bitrix, @login, @dateInputSklad, @protektor_passport, @N1, @N2, @N3, @N4, @probeg_passport, @probeg_now, @probeg_last, @ostatok, @psi, @bar, @rfid, @price, @comments, @dateZamer
                )`
        },
        {
            query: `
                INSERT INTO tyres_history_tire (
                    idw_tyres, uniqTyresID, dateInstall, typeOs, numberOs, identifikator, dateOutputSklad, idObject, nameCar, mileage, dateAction, flag_status, id_bitrix, login, dateInputSklad, protektor_passport, N1, N2, N3, N4, probeg_passport, probeg_now, probeg_last, ostatok, psi, bar, rfid, price, comments, dateZamer
                ) VALUES (
                    @idw_tyres, @uniqTyresID, @dateInstall, @typeOs, @numberOs, @identifikator, @dateOutputSklad, @idObject, @nameCar, @mileage, @dateAction, @flag_status, @id_bitrix, @login, @dateInputSklad, @protektor_passport, @N1, @N2, @N3, @N4, @probeg_passport, @probeg_now, @probeg_last, @ostatok, @psi, @bar, @rfid, @price, @comments, @dateZamer
                )`
        }
    ];

    try {
        const pool = await connection;
        const transaction = pool.transaction();

        await transaction.begin();

        for (const { query } of queries) {
            const request = transaction.request();
            for (const [key, value] of Object.entries(inputParams)) {
                request.input(key, value);
            }
            await request.query(query);
        }

        await transaction.commit();
        res.json('Колесо сохранено');
    } catch (e) {
        if (transaction) {
            await transaction.rollback();
        }
        res.json('Ошибка');
        console.log(e);
    }
};



exports.getAllTyres = async (req, res) => {
    try {
        const pool = await connection
        const post = `SELECT tg.*, tt.*
FROM tyres_model_guide tg
JOIN tyres_table_tire tt ON tg.uniqTyresID = tt.uniqTyresID`;
        const result = await pool.request()
            .query(post);
        res.json(result.recordset)
    }
    catch (e) {
        res.json('Ошибка')
        console.log(e)
    }
}

exports.updateDataInDB = async (req, res) => {
    const data = req.body.obj
    console.log(data)
    data.dateAction = helpers.getCurrentDate()
    try {
        const pool = await connection
        const updateQuery = `
            UPDATE tyres_table_tire
            SET 
                flag_status = @flag_status,
                login = @login,
                dateInputSklad = @dateInputSklad,
                dateOutputSklad = @dateOutputSklad,
                dateInstall = @dateInstall,
                idObject = @idObject,
                mileage = @mileage,
                identifikator = @identifikator,
                typeOs = @typeOs,
                numberOs = @numberOs,
                nameCar = @nameCar,
                dateAction=@dateAction
            WHERE idw_tyres = @idw_tyres
        `;
        await pool.request()
            .input('idw_tyres', data.idw_tyres)
            .input('flag_status', data.flag_status)
            .input('login', data.login)
            .input('dateInputSklad', data.dateInputSklad)
            .input('dateOutputSklad', data.dateOutputSklad)
            .input('dateInstall', data.dateInstall)
            .input('idObject', data.idObject)
            .input('mileage', data.mileage)
            .input('identifikator', data.identifikator)
            .input('typeOs', data.typeOs)
            .input('numberOs', data.numberOs)
            .input('nameCar', data.nameCar)
            .input('dateAction', data.dateAction)
            .query(updateQuery);
        // Запрос обновленных данных
        const selectQuery = `
            SELECT TOP 1 * FROM tyres_table_tire 
            WHERE idw_tyres = @idw_tyres
            ORDER BY id DESC
        `;
        const result = await pool.request()
            .input('idw_tyres', data.idw_tyres)
            .query(selectQuery);
        const updatedData = result.recordset[0];
        console.log(updatedData)
        // Вставка данных в другую таблицу
        const mess = await controllerTyres.saveDataHistoryToDBTyres(updatedData)
        res.json('Колесо установлено');

    }
    catch (e) {
        res.json('Ошибка')
        console.log(e)
    }
}

exports.updateWheel = async (req, res) => {
    const data = req.body.obj
    //console.log(data)
    data.dateAction = helpers.getCurrentDate()
    try {
        const pool = await connection
        const updateQuery = `
            UPDATE tyres_table_tire
            SET 
                N1 = @N1,
                N2 = @N2,
                N3 = @N3,
                N4 = @N4,
                login = @login,
                ostatok = @ostatok,
                price = @price,
                id_bitrix = @id_bitrix,
                comments = @comments,
                rfid = @rfid,
                psi = @psi,
                bar=@bar,
                protektor_passport=@protektor_passport,
                probeg_passport=@probeg_passport,
                probeg_now=@probeg_now,
                probeg_last=@probeg_last,
                dateZamer=@dateZamer,
                flag_status=@flag_status,
                mileage=@mileage,
                dateAction=@dateAction
            WHERE idw_tyres = @idw_tyres
        `;
        await pool.request()
            .input('idw_tyres', data.idw_tyres)
            .input('N1', data.N1)
            .input('N2', data.N2)
            .input('N3', data.N3)
            .input('N4', data.N4)
            .input('login', data.login)
            .input('ostatok', data.ostatok)
            .input('flag_status', data.flag_status)
            .input('id_bitrix', data.id_bitrix_wiew)
            .input('price', data.price_tyres)
            .input('comments', data.comment)
            .input('rfid', data.rfid_cod)
            .input('psi', data.psi_wiew)
            .input('bar', data.bar_wiew)
            .input('protektor_passport', data.protektor_passport_wiew)
            .input('probeg_passport', data.probeg_passport_wiew)
            .input('probeg_now', data.probeg_now_wiew)
            .input('probeg_last', data.probeg_last_wiew)
            .input('dateZamer', data.dateZamer)
            .input('mileage', data.mileage)
            .input('dateAction', data.dateAction)
            .query(updateQuery);

        // Запрос обновленных данных
        const selectQuery = `
            SELECT TOP 1 * FROM tyres_table_tire 
            WHERE idw_tyres = @idw_tyres
            ORDER BY id DESC
        `;
        const result = await pool.request()
            .input('idw_tyres', data.idw_tyres)
            .query(selectQuery);
        const updatedData = result.recordset[0];
        console.log(updatedData)
        // Вставка данных в другую таблицу
        const mess = await controllerTyres.saveDataHistoryToDBTyres(updatedData)
        res.json('Данные обновлены');
    }
    catch (e) {
        res.json('Ошибка')
        console.log(e)
    }
}

exports.updateTyreSklad = async (req, res) => {
    const data = req.body.obj;
    data.dateAction = helpers.getCurrentDate();

    try {
        const pool = await connection;
        // Обновление данных
        const updateQuery = `
            UPDATE tyres_table_tire
            SET 
                flag_status = @flag_status,
                login = @login,
                dateInputSklad = @dateInputSklad,
                dateOutputSklad = @dateOutputSklad,
                dateInstall = @dateInstall,
                idObject = @idObject,
                mileage = @mileage,
                identifikator = @identifikator,
                typeOs = @typeOs,
                numberOs = @numberOs,
                nameCar = @nameCar,
                probeg_now = @probeg_now,
                probeg_last = @probeg_last,
                comments = @comments,
                dateAction = @dateAction
            WHERE idw_tyres = @idw_tyres
        `;
        await pool.request()
            .input('idw_tyres', data.idw_tyres ?? null)
            .input('flag_status', data.flag_status ?? null)
            .input('login', data.login ?? null)
            .input('dateInputSklad', data.dateInputSklad ?? null)
            .input('dateOutputSklad', data.dateOutputSklad ?? null)
            .input('dateInstall', data.dateInstall ?? null)
            .input('idObject', data.idObject ?? null)
            .input('mileage', data.mileage ?? null)
            .input('identifikator', data.identifikator ?? null)
            .input('typeOs', data.typeOs ?? null)
            .input('numberOs', data.numberOs ?? null)
            .input('nameCar', data.nameCar ?? null)
            .input('probeg_now', String(data.probeg_now) ?? null)
            .input('probeg_last', String(data.probeg_last) ?? null)
            .input('dateAction', String(data.dateAction) ?? null)
            .input('comments', data.comments ?? null)
            .query(updateQuery);

        // Запрос обновленных данных
        const selectQuery = `
            SELECT TOP 1 * FROM tyres_table_tire 
            WHERE idw_tyres = @idw_tyres
            ORDER BY id DESC
        `;
        const result = await pool.request()
            .input('idw_tyres', data.idw_tyres)
            .query(selectQuery);
        const updatedData = result.recordset[0];
        console.log(updatedData)
        // Вставка данных в другую таблицу
        const mess = await controllerTyres.saveDataHistoryToDBTyres(updatedData)

        res.json('Выполнено');
    } catch (e) {
        res.json('Ошибка');
        console.log(e);
    }
};

exports.saveDataHistoryToDBTyres = async (data) => {
    //  const data = req.body.obj
    data.dateAction = helpers.getCurrentDate()
    console.log(data)
    try {
        const pool = await connection
        const insertQuery = `
            INSERT INTO tyres_history_tire (
                idw_tyres, uniqTyresID, dateInstall,typeOs,numberOs,identifikator,dateOutputSklad,idObject,nameCar,mileage,dateAction,flag_status, id_bitrix, login, dateInputSklad, protektor_passport, N1, N2, N3, N4, probeg_passport, probeg_now, probeg_last, ostatok, psi, bar, rfid, price, comments,dateZamer
            ) VALUES (
                 @idw_tyres, @uniqTyresID, @dateInstall, @typeOs,@numberOs,@identifikator,@dateOutputSklad,@idObject,@nameCar,@mileage,@dateAction, @flag_status, @id_bitrix, @login, @dateInputSklad, @protektor_passport, @N1, @N2, @N3, @N4, @probeg_passport, @probeg_now, @probeg_last, @ostatok, @psi, @bar, @rfid, @price, @comments, @dateZamer
            )`;
        await pool.request()
            .input('idw_tyres', data.idw_tyres)
            .input('uniqTyresID', data.uniqTyresID)
            .input('flag_status', data.flag_status)
            .input('id_bitrix', data.id_bitrix)
            .input('login', data.login)
            .input('dateInputSklad', data.dateInputSklad)
            .input('dateInstall', data.dateinstall ?? null)
            .input('protektor_passport', data.protektor_passport)
            .input('N1', data.N1)
            .input('N2', data.N2)
            .input('N3', data.N3)
            .input('N4', data.N4)
            .input('probeg_passport', data.probeg_passport)
            .input('probeg_now', data.probeg_now)
            .input('probeg_last', data.probeg_last)
            .input('ostatok', data.ostatok)
            .input('psi', data.psi)
            .input('bar', data.bar)
            .input('rfid', data.rfid)
            .input('price', data.price)
            .input('comments', data.comments)
            .input('dateZamer', data.dateZamer)
            .input('dateAction', data.dateAction)
            .input('typeOs', data.typeOs ?? null)
            .input('numberOs', data.numberOs ?? null)
            .input('identifikator', data.identifikator ?? null)
            .input('dateOutputSklad', data.dateOutputSklad ?? null)
            .input('idObject', data.idObject ?? null)
            .input('nameCar', data.nameCar ?? null)
            .input('mileage', data.mileage ?? null)
            .query(insertQuery);
        return ('Колесо сохранено')
    }
    catch (e) {
        return ('Ошибка')
    }
}









