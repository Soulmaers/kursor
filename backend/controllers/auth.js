const response = require('../../response')
//const pool = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const express = require('express')
const databaseService = require('../services/database.service');
const { connection, sql } = require('../config/db')


module.exports.update = async (req, res) => { //обновление пользовательских данных
    const id = req.body.idx
    const login = req.body.log
    const roleNew = req.body.role

    try {
        const selectBase = `UPDATE users SET name=@name, role=@roleNew WHERE idx = @id`;
        const pool = await connection;
        const results = await pool.request()
            .input('id', id)
            .input('name', login)
            .input('roleNew', roleNew)
            .query(selectBase);
        res.json({ status: 200, result: results, message: 'Данные пользователя изменены' });
    } catch (e) {
        console.log(e);
        // Consider sending back an error response here
    }
}

module.exports.delete = async (req, res) => { //удаление пользователя
    const pool = await connection;
    try {

        const selectBase = `DELETE FROM users WHERE idx =@id`;
        const results = await pool.request().input('id', req.body.idx).query(selectBase)
        res.json({ status: 200, result: results.recordset, message: `Пользователь удален` })
    }
    catch (e) {
        console.log(e)
    }
    try {
        const selectBase = `DELETE FROM userObjects WHERE login = @login`;
        await pool.request().input('login', req.body.log).query(selectBase)
    }
    catch (e) {
        console.log(e)
    }
}



module.exports.users = async (req, res) => { //получение данных пользователей
    console.log('запрос пришел')
    try {
        const pool = await connection
        const selectBase = `SELECT  idx, name, role FROM users`
        const results = await pool.query(selectBase)
        res.json(results.recordset)
    }
    catch (e) {
        console.log(e)
    }
}

exports.saveProfil = async (req, res) => { //сохранение контактов
    const mass = req.body.mass
    const params = await databaseService.saveToBaseProfil(mass)
    res.json(params)
}
exports.findLastIdUser = async (req, res) => { //сохранение контактов
    const table = req.body.table
    try {
        const pool = await connection
        const selectBase = `SELECT TOP 1 idx FROM ${table} ORDER BY incriment DESC`;
        const results = await pool.request()
            .query(selectBase)
        res.json(results.recordset)
    }
    catch (e) {
        console.log(e)
    }
}

exports.addAccount = async (req, res) => { //сохранение контактов
    const { idx, name, uniqCreater, uniqTP } = req.body;
    try {
        const pool = await connection
        const sqlS = `SELECT * FROM accounts WHERE name = @name AND uniqCreater=@uniqCreater`;
        const rows = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('uniqCreater', sql.NVarChar, uniqCreater)
            .query(sqlS);
        if (rows.recordset.length > 0) {
            res.json({
                message: `Учетная запись с таким именем - ${rows.recordset[0].name} уже есть`, flag: false
            });

        }
        else {

            const sqls = 'INSERT INTO accounts (idx, name, uniqCreater, uniqTP)  OUTPUT INSERTED.incriment VALUES (@idx, @name,@uniqCreater,@uniqTP)';
            const result = await pool.request()
                .input('idx', idx)
                .input('name', name)
                .input('uniqCreater', uniqCreater)
                .input('uniqTP', uniqTP)
                .query(sqls);
            const userIncriment = result.recordset[0].incriment;
            // Вставка записи в таблицу accountUsers
            const insertAccountUserQuery = `
                  INSERT INTO accountUsers (uniqAccountID, uniqUsersID)
                  VALUES (@AccountIncriment, @UserIncriment)
              `;
            await pool.request()
                .input('AccountIncriment', sql.Int, userIncriment)
                .input('UserIncriment', sql.Int, uniqCreater)
                .query(insertAccountUserQuery);
            res.json({
                message: 'Учетная запись создана', flag: true
            });

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred'
        });
    }
}



const path = require('path');
exports.tests = async (req, res) => {
    const filePath = path.join(__dirname, 'test.html'); // Укажите путь к файлу
    res.sendFile(filePath);
};

exports.findProfil = async (req, res) => { //получение контактов
    const login = req.body.login
    const params = await databaseService.findToBaseProfil(login)
    res.json(params)
}

exports.deleteProfil = async (req, res) => { //удаление контактов
    const uniqId = req.body.uniqId
    const params = await databaseService.deleteToBaseProfil(uniqId)
    res.json(params)
}

exports.getAccountUsers = async function (req, res) {
    try {
        const pool = await connection;

        // SQL-запрос для получения пользователей и информации о создателе
        const sqlS = `
            SELECT
                u.*,
                cu.name AS creator_name,
                cu.role AS creator_role
            FROM users AS u
            JOIN accountUsers AS au ON u.incriment = au.uniqUsersID
            JOIN accounts AS a ON au.uniqAccountID = a.incriment
            LEFT JOIN users AS cu ON a.uniqCreater = cu.incriment;`;

        // Выполнение запроса и получение результатов
        const result = await pool.request().query(sqlS);

        // Отправка результата в формате JSON
        res.json(result.recordset);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: 'Ошибка при получении данных'
        });
    }
};



module.exports.getUsers = async function (req, res) { //сохранение учетных данных нового пользователя
    const prava = req.body.role
    const creator = req.body.creater
    try {
        const pool = await connection
        let sqlS = '';
        if (prava === 'Интегратор') {
            sqlS = `
                SELECT * FROM users 
                WHERE role = 'Сервис-инженер' AND creater=${creator}
            `;
        } else {
            sqlS = `
                SELECT * FROM users 
                WHERE role = 'Интегратор' OR role = 'Сервис-инженер'
            `;
        }
        const rows = await pool.request()
            .query(sqlS);
        res.json(rows.recordset)

    } catch (e) {
        console.log(e)
    }
}

exports.getAccounts = async function (req, res) { //сохранение учетных данных нового пользователя
    const creator = req.body.creater
    try {
        const pool = await connection
        const sqlS = `SELECT * FROM accounts`;

        const rows = await pool.request()
            .query(sqlS);
        res.json(rows.recordset)

    } catch (e) {
        console.log(e)
    }
}

exports.deleteAccount = async function (req, res) {
    const incriment = req.body.id;
    const index = req.body.index;
    console.log(incriment, index)
    const pool = await connection; // Получение подключения к базе данных

    try {
        if (index == 0) {
            // Удаляем связи из accountUsers
            const sqlS = `DELETE FROM accountUsers WHERE uniqAccountID = @incriment;`;
            await pool.request()
                .input('incriment', incriment)
                .query(sqlS);

            // Удаляем сам аккаунт из accounts
            const sqlS2 = `DELETE FROM accounts WHERE incriment = @incriment`;
            await pool.request()
                .input('incriment', incriment)
                .query(sqlS2);
        }
        else {  // Удаляем связи из accountUsers
            const sqlS = `DELETE FROM accountUsers WHERE uniqUsersID = @incriment;`;
            await pool.request()
                .input('incriment', incriment)
                .query(sqlS);

            // Удаляем сам аккаунт из accounts
            const sqlS2 = `DELETE FROM users WHERE incriment = @incriment`;
            await pool.request()
                .input('incriment', incriment)
                .query(sqlS2);

        }
        // Отправка успешного ответа клиенту
        res.json({
            message: 'Аккаунт успешно удален'
        });
    } catch (e) {
        // В случае ошибки откат транзакции и отправка сообщения об ошибке клиенту
        console.error(e);
        res.status(500).json({
            message: 'Произошла ошибка при удалении аккаунта'
        });
    }

};




module.exports.signup = async function (req, res) { //сохранение учетных данных нового пользователя
    const { login, password, role, idx, uz, creater } = req.body;

    try {
        const pool = await connection
        const sqlS = `SELECT * FROM users WHERE name = @name AND uz=@uz`;
        const rows = await pool.request()
            .input('name', sql.NVarChar, login)
            .input('uz', sql.NVarChar, uz)
            .query(sqlS);
        if (rows.recordset.length > 0) {
            res.json({
                message: `Пользователь с таким Логином - ${rows.recordset[0].name} уже есть`, flag: false
            });
            //  return;
        }
        else {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            const insertUserQuery = `
                INSERT INTO users (idx, name, password, role, uz, creater)
                OUTPUT INSERTED.incriment
                VALUES (@idx, @login, @password, @role, @uz, @creater)
            `;
            const userResult = await pool.request()
                .input('idx', idx)
                .input('login', login)
                .input('password', hashedPassword)
                .input('role', role)
                .input('uz', uz)
                .input('creater', creater)
                .query(insertUserQuery);

            if (uz) {
                const userIncriment = userResult.recordset[0].incriment;

                // Вставка записи в таблицу accountUsers
                const insertAccountUserQuery = `
                  INSERT INTO accountUsers (uniqAccountID, uniqUsersID)
                  VALUES (@AccountIncriment, @UserIncriment)
              `;
                await pool.request()
                    .input('AccountIncriment', sql.Int, uz)
                    .input('UserIncriment', sql.Int, userIncriment)
                    .query(insertAccountUserQuery);
            }
            res.json({
                message: 'Пользователь зарегистрирован', flag: true
            });

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred'
        });
    }
};


module.exports.page = async function (req, res) { //получение страницы с формой авторизации
    res.render('form.ejs', { message: '' });
}

module.exports.sing = async function (req, res) { // авторизация
    try {
        const pool = await connection;
        // Используем параметризованный запрос для получения пользователя по имени и email
        const result = await pool.request()
            .input('username', req.body.username)
            .query('SELECT * FROM users WHERE name = @username');

        if (result.recordset.length === 0) {
            res.render('form.ejs', { message: 'Пользователь не найден!' });
            return;
        }
        // Ищем первого пользователя с совпадающим паролем
        const matchedUser = await result.recordset.find(async user => {
            return await bcrypt.compare(req.body.password, user.password);
        });
        if (!matchedUser) {
            res.render('form.ejs', { message: 'Неверный пароль!' });
            return;
        }

        const token = jwt.sign({
            userId: matchedUser.idx,
            user: matchedUser.name
        }, process.env.JWT_SECRET || 'jwt-key', { expiresIn: '300d' });

        res.cookie('AuthToken', token);
        res.cookie('name', matchedUser.name);
        res.redirect('/action');
    } catch (error) {
        console.error('Ошибка: ' + error);
        res.status(500).json({ error: 'Произошла ошибка при авторизации.' });
    }
};

module.exports.action = function (req, res) { //получение стартовой страницы приложения после авторизации
    console.log('экшион')

    if (req.user) {
        const login = req.user.name
        const role = req.user.role
        const incriment = req.user.incriment
        const device = req.headers['user-agent'];
        const platform = req.headers['sec-ch-ua-platform']
        const ip = req.ip
        // logLogin(login, ip, platform, device) //сохранение логов входа пользователя
        console.log(login, role)
        res.render('in.ejs', {
            user: login,
            role: role,
            uniqIDCreater: incriment
        })
        //  res.redirect(`/data/${login}/${role}`);
    }
    else {
        res.render('form.ejs')
    }
}


const fs = require('fs');


// Функция для записи логов
function logLogin(username, ip, platform, device) {
    // Получение текущей даты и времени
    const currentDate = new Date();
    // Формирование строки с данными для записи
    const logEntry = `Username: ${username}\nip: ${ip}\nLogin time: ${currentDate}\nPlatform: ${platform}\nDevice: ${device}\n\n`;

    // Запись строки в файл логов
    fs.appendFile('log.txt', logEntry, (err) => {
        if (err) {
            console.error('Ошибка записи лога:', err);
        } else {
            null//  console.log('Лог успешно записан');
        }
    });
}



module.exports.logout = async function (req, res, next) { //получение страницы с формой авторизации при выходе
    res.redirect('/');
}


module.exports.checkObject = async (req, res) => { //сохранение, удаление, обновление объектов wialon пользователя
    const { login, role, objects } = req.body;
    try {
        const pool = await connection;
        const selectBase = `SELECT id FROM userObjects`;
        const results = await pool.query(selectBase);

        if (results.recordset.length === 0) {
            for (const el of objects) {
                const postModel = `INSERT INTO userObjects(login, role, object, idw) VALUES('${login}','${role}','${el[0]}','${el[1]}')`;
                await pool.query(postModel);
            }
        } else {
            // await pool.beginTransaction();

            const deleteModel = `DELETE FROM  userObjects WHERE login='${login}'`;
            await pool.query(deleteModel);

            for (const el of objects) {
                const postModel = `INSERT INTO userObjects(login, role, object, idw) VALUES('${login}','${role}','${el[0]}','${el[1]}')`;
                await pool.query(postModel);
            }
        }

        res.json({ message: 'Объекты добавлены' })
    } catch (e) {
        console.log(e);

    }
}
module.exports.viewCheckObject = async (req, res) => { //получение названий и id объектов wialon пользователя
    const login = req.body.name
    try {
        const pool = await connection
        const selectBase = `SELECT Object, idw FROM userObjects WHERE login=@login`
        const results = await pool.request()
            .input('login', login)
            .query(selectBase)
        res.json(results.recordset)
    }
    catch (e) {
        console.log(e)
    }
}