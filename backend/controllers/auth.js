const response = require('../../response')
const db = require('../settings/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const authTokens = {};
const { init } = require('../settings/wialon.js')
const express = require('express')
const app = express();



module.exports.update = (req, res) => {
    console.log('запрос на обновление')
    console.log(req.body.idx)
    const id = req.body.idx
    const login = req.body.log
    const roleNew = req.body.role
    try {
        const selectBase = `UPDATE users SET  name='${login}', role='${roleNew}' WHERE idx = '${id}'`;
        db.query(selectBase, function (err, results) {
            console.log(results)
            res.json({ status: 200, result: results, message: `Данные пользователя изменены` })
        })
    }
    catch (e) {
        console.log(e)
    }
}




module.exports.delete = (req, res) => {
    console.log('запрос на удаление')
    console.log(req.body.idx)
    // const id = req.body.idx
    try {
        const selectBase = `DELETE FROM users WHERE idx = '${req.body.idx}'`;
        db.query(selectBase, function (err, results) {
            console.log(results)
            res.json({ status: 200, result: results, message: `Пользователь удален` })
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
        db.query(selectBase, function (err, results) {
            console.log(results)
            res.json({ status: 200, result: results })
        })
    }
    catch (e) {
        console.log(e)
    }
}


module.exports.signup = async function (req, res) {
    console.log('сигнап')
    console.log(req.body)
    db.query("SELECT  `name`, `password` FROM `users` WHERE `name`='" + req.body.login + "'", (error, rows, field) => {
        if (error) {
            console.log('не ок1')
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
            console.log('все ок')
            const name = req.body.login
            const password = req.body.pass;
            const role = req.body.role;
            const idx = req.body.idx;
            console.log(idx, name, password, role)
            const salt = bcrypt.genSaltSync(15)
            const pass = bcrypt.hashSync(password, salt)
            const sql = "INSERT INTO `users`(`idx`, `name`,`password`,`role`)  VALUES('" + idx + "','" + name + "','" + pass + "','" + role + "')"
            db.query(sql, (error, result) => {
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
    db.query("SELECT `id`, `name`, `password` FROM `users` WHERE `name`='" + req.body.username + "'", (error, rows, fields) => {
        if (error) {
            response.status(404, error, res)
        }
        else if (rows.length <= 0) {
            res.render('form.ejs', { message: 'Пользователь не найден!' })


        }
        else {
            const row = JSON.parse(JSON.stringify(rows))
            console.log(row)
            row.map(rw => {
                const resulty = bcrypt.compareSync(req.body.password, rw.password)
                //req.body.password== rw.password
                if (resulty) {
                    console.log(rw.name)
                    const token = jwt.sign({
                        userId: rw.id,
                        user: rw.name
                    }, 'jwt-key', { expiresIn: '300d' })
                    //res.json(`Bearer ${token}`)
                    res.cookie('AuthToken', `${token}`)
                    console.log(res.cookie)
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
    console.log('юзер')
    console.log(req.user)
    if (req.user) {
        const login = req.user[0].name
        const role = req.user[0].role
        console.log(login)
        res.render('in.ejs', {
            user: login,
            role: role
        })
        init(login)
    }
    else {
        res.render('form.ejs')
    }
}


module.exports.logout = async function (req, res, next) {
    res.redirect('/');
}