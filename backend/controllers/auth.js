const response = require('../../response')
const pool = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const express = require('express')
const databaseService = require('../services/database.service');



module.exports.update = (req, res) => {
    const id = req.body.idx
    const login = req.body.log
    const roleNew = req.body.role
    try {
        const selectBase = `UPDATE users SET  name='${login}', role='${roleNew}' WHERE idx = '${id}'`;
        pool.query(selectBase, function (err, results) {
            console.log(results)
            res.json({ status: 200, result: results, message: `Данные пользователя изменены` })
        })
    }
    catch (e) {
        console.log(e)
    }
}

module.exports.delete = (req, res) => {
    // console.log('запрос на удаление')
    // console.log(req.body.idx)
    // const id = req.body.idx
    try {
        const selectBase = `DELETE FROM users WHERE idx = '${req.body.idx}'`;
        pool.query(selectBase, function (err, results) {
            console.log(results)
            res.json({ status: 200, result: results, message: `Пользователь удален` })
        })
    }
    catch (e) {
        console.log(e)
    }
    try {
        const selectBase = `DELETE FROM userObjects WHERE login = '${req.body.log}'`;
        pool.query(selectBase, function (err, results) {

        })
    }
    catch (e) {
        console.log(e)
    }
}



module.exports.users = (req, res) => {
    console.log('запрос пришел')
    try {
        const selectBase = `SELECT  idx, name, role FROM users WHERE 1`
        pool.query(selectBase, function (err, results) {
            console.log(results)
            res.json({ status: 200, result: results })
        })
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
    pool.query("SELECT  `name`, `password` FROM `users` WHERE `name`='" + req.body.login + "'", (error, rows, field) => {
        if (error) {
            response.status(404, res)

        } else if (typeof rows !== 'undefined' && rows.length > 0) {
            // сonsole.log(rows)
            console.log('не ок2')
            const row = JSON.parse(JSON.stringify(rows))
            console.log(row)
            row.map(rw => {
                response.status(404, rw.name, { message: `Пользователь с таким Логином - ${rw.name} уже есть` }, res)
                //res.json({ status: 404, result: rw.name, message: `Пользователь с таким Логином - ${ rw.name } уже есть` })
                return true
            })
        }
        else {
            const name = req.body.login
            const password = req.body.pass;
            const role = req.body.role;
            const idx = req.body.idx;
            console.log(idx, name, password, role)
            const salt = bcrypt.genSaltSync(15)
            const pass = bcrypt.hashSync(password, salt)
            const sql = "INSERT INTO `users`(`idx`, `name`,`password`,`role`)  VALUES('" + idx + "','" + name + "','" + pass + "','" + role + "')"
            pool.query(sql, (error, result) => {
                if (error) {
                    console.log('не ок')
                    response.status(400, error, '', res)
                }
                else {
                    response.status(200, result, { message: `Пользователь зарегистрирован` }, res)
                }
            })
        }

    })
}


module.exports.page = async function (req, res) {
    res.render('form.ejs', { message: '' });

}

module.exports.sing = async function (req, res) {
    pool.query("SELECT `id`, `name`, `password` FROM `users` WHERE `name`='" + req.body.username + "'", (error, rows, fields) => {
        if (error) {
            response.status(404, error, res)
        }
        else if (rows.length <= 0) {
            res.render('form.ejs', { message: 'Пользователь не найден!' })
        }
        else {
            const row = JSON.parse(JSON.stringify(rows))
            //  console.log(row)
            row.map(rw => {
                const resulty = bcrypt.compareSync(req.body.password, rw.password)
                //req.body.password== rw.password
                if (resulty) {
                    const token = jwt.sign({
                        userId: rw.id,
                        user: rw.name
                    }, 'jwt-key', { expiresIn: '300d' })
                    //res.json(`Bearer ${token}`)
                    res.cookie('AuthToken', `${token}`)
                    // console.log(res.cookie)
                    res.cookie('name', `${rw.name}`)
                    res.redirect('/action');

                    return;
                } else {
                    res.render('form.ejs', { message: 'Не верный пароль!' })

                }
                return true
            })

        }
    })


}

module.exports.action = function (req, res) {
    console.log('экшион')
    if (req.user) {
        const login = req.user[0].name
        const role = req.user[0].role
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


module.exports.checkObject = (req, res) => {
    const login = req.body.login
    const role = req.body.role
    const objects = req.body.objects
    // console.log(objects)
    try {
        const selectBase = `SELECT id FROM userObjects WHERE 1`
        pool.query(selectBase, function (err, results) {
            if (err) console.log(err);
            if (results.length === 0) {
                objects.forEach(el => {
                    const postModel = `INSERT INTO userObjects(login, role, object, idw) VALUES('${login}','${role}','${el[0]}','${el[1]}')`
                    connection.query(postModel, function (err, results) {
                        if (err) console.log(err);
                    })
                })
            }
            else {
                const postModel = `DELETE FROM  userObjects WHERE login='${login}'`
                pool.query(postModel, function (err, results) {
                    if (err) console.log(err);
                    objects.forEach(el => {
                        const postModel = `INSERT INTO userObjects(login, role, object, idw) VALUES('${login}','${role}','${el[0]}','${el[1]}')`
                        pool.query(postModel, function (err, results) {
                            if (err) console.log(err);
                        })
                    })
                })
            }
            res.json({ message: 'Объекты добавлены' })
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.viewCheckObject = (req, res) => {
    const login = req.body.name
    try {
        const selectBase = `SELECT Object, idw FROM userObjects WHERE login='${login}'`
        pool.query(selectBase, function (err, results) {
            if (err) console.log(err);
            res.json({ result: results })
        })
    }
    catch (e) {
        console.log(e)
    }
}