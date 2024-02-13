const response = require('../../response')
//const pool = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const express = require('express')
const databaseService = require('../services/database.service');
const { connection, sql } = require('../config/db')


module.exports.update = async (req, res) => {
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

module.exports.delete = async (req, res) => {
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
        const selectBase = `DELETE FROM userObjects WHERE login = @login'`;
        await pool.input('login', req.body.log).query(selectBase)
    }
    catch (e) {
        console.log(e)
    }
}



module.exports.users = async (req, res) => {
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

exports.saveProfil = async (req, res) => {
    const mass = req.body.mass
    const params = await databaseService.saveToBaseProfil(mass)
    res.json(params)
}

exports.findProfil = async (req, res) => {
    const login = req.body.login
    const params = await databaseService.findToBaseProfil(login)
    res.json(params)
}

exports.deleteProfil = async (req, res) => {
    const uniqId = req.body.uniqId
    const params = await databaseService.deleteToBaseProfil(uniqId)
    res.json(params)
}


module.exports.signup = async function (req, res) {
    const { login, pass, role, idx } = req.body;
    try {
        const pool = await connection
        const sqlS = `SELECT * FROM users WHERE name = @name`;
        const rows = await pool.request()
            .input('name', sql.NVarChar, login).query(sqlS);
        if (rows.recordset.length > 0) {
            res.status(404).json({
                message: `Пользователь с таким Логином - ${rows.recordset[0].name} уже есть`
            });
            return;
        }
        else {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(pass, salt);
            const sqls = 'INSERT INTO users (idx, name, password, role) VALUES (@idx, @login,@password,@role)';
            const result = await pool.request()
                .input('idx', idx)
                .input('login', login)
                .input('password', hashedPassword)
                .input('role', role)
                .query(sqls, [idx, login, hashedPassword, role]);

            res.status(200).json({
                message: 'Пользователь зарегистрирован'
            });

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred'
        });
    }
};


module.exports.page = async function (req, res) {
    res.render('form.ejs', { message: '' });
}

module.exports.sing = async function (req, res) {
    try {
        const pool = await connection
        const result = await pool.query(`SELECT id, name, password FROM users WHERE name='${req.body.username}'`);
        const rows = result.recordset;
        if (rows.length <= 0) {
            res.render('form.ejs', { message: 'Пользователь не найден!' });
            return;
        }
        const row = rows[0];
        const resulty = bcrypt.compareSync(req.body.password, row.password);
        if (!resulty) {
            res.render('form.ejs', { message: 'Неверный пароль!' });
            return;
        }

        const token = jwt.sign({
            userId: row.id,
            user: row.name
        }, 'jwt-key', { expiresIn: '300d' });

        res.cookie('AuthToken', `${token}`);
        res.cookie('name', `${row.name}`);
        res.redirect('/action');
    } catch (error) {
        console.log('Ошибка: ' + error);
        res.json('error')
    }
}

module.exports.action = function (req, res) {
    console.log('экшион')
    if (req.user) {
        const login = req.user.name
        const role = req.user.role
        const device = req.headers['user-agent'];
        const platform = req.headers['sec-ch-ua-platform']
        const ip = req.ip
        logLogin(login, ip, platform, device)
        res.render('in.ejs', {
            user: login,
            role: role
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



module.exports.logout = async function (req, res, next) {
    res.redirect('/');
}


module.exports.checkObject = async (req, res) => {
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
module.exports.viewCheckObject = async (req, res) => {
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