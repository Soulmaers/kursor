const databaseService = require('../services/database.service');
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
    const data = req.body.obj
    console.log(data)
    try {
        const pool = await connection
        const insertQuery = `
            INSERT INTO tyres_table_tire (
                idw_tyres, uniqTyresID, flag_status, id_bitrix, login, dateInputSklad, protektor_passport, N1, N2, N3, N4, probeg_passport, probeg_now, probeg_last, ostatok, psi, bar, rfid, price, comments,dateZamer
            ) VALUES (
                 @idw_tyres, @uniqTyresID, @flag_status, @id_bitrix, @login, @dateInputSklad, @protektor_passport, @N1, @N2, @N3, @N4, @probeg_passport, @probeg_now, @probeg_last, @ostatok, @psi, @bar, @rfid, @price, @comments, @dateZamer
            )`;
        await pool.request()
            .input('idw_tyres', data.idw_tyres)
            .input('uniqTyresID', data.uniqTyresID)
            .input('flag_status', data.flag_status)
            .input('id_bitrix', data.id_bitrix_wiew)
            .input('login', data.login)
            .input('dateInputSklad', data.dateInputSklad)
            .input('protektor_passport', data.protektor_passport_wiew)
            .input('N1', data.N1)
            .input('N2', data.N2)
            .input('N3', data.N3)
            .input('N4', data.N4)
            .input('probeg_passport', data.probeg_passport_wiew)
            .input('probeg_now', data.probeg_now_wiew)
            .input('probeg_last', data.probeg_last_wiew)
            .input('ostatok', data.ostatok)
            .input('psi', data.psi_wiew)
            .input('bar', data.bar_wiew)
            .input('rfid', data.rfid_cod)
            .input('price', data.price_tyres)
            .input('comments', data.comment)
            .input('dateZamer', data.dateZamer)
            .query(insertQuery);
        res.json('Колесо сохранено')
    }
    catch (e) {
        res.json('Ошибка')
        console.log(e)
    }
}
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
                nameCar = @nameCar
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
            .query(updateQuery);
        res.json('Данные обновлены')
    }
    catch (e) {
        res.json('Ошибка')
        console.log(e)
    }
}

exports.updateTyreSklad = async (req, res) => {
    const data = req.body.obj
    console.log(data)
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
                probeg_now=@probeg_now,
                probeg_last=@probeg_last
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
            .input('probeg_now', String(data.probeg_now))
            .input('probeg_last', String(data.probeg_last))
            .query(updateQuery);
        res.json('Данные обновлены')
    }
    catch (e) {
        res.json('Ошибка')
        console.log(e)
    }
}



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








