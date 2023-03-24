const response = require('../../response')
const db = require('../settings/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const authTokens = {};
const { init } = require('../settings/wialon.js')
const express = require('express')
const app = express();

module.exports.users = (req, res) => {
    console.log('запрос пришел')
    try {
        const selectBase = `SELECT name, role FROM users WHERE 1`
        db.query(selectBase, function (err, results) {
            console.log(results)
            res.json({ status: 200, result: results })
        })
    }
    catch (e) {
        console.log(e)
    }
}

module.exports.page = async function (req, res) {
    res.render('form.ejs', { message: '' });
}



module.exports.signup = async function (req, res) {

    console.log(req.body)
    db.query("SELECT `id`, `name`, `password` FROM `users` WHERE `name`='" + req.body.login + "'", (error, rows, field) => {
        if (error) {
            response.status(404, res)

        } else if (typeof rows !== 'undefined' && rows.length > 0) {
            // сonsole.log(rows)
            const row = JSON.parse(JSON.stringify(rows))
            console.log(row)
            row.map(rw => {
                response.status(404, rw.name, { message: `Пользователь с таким Логином - ${rw.name} уже есть` }, res)
                //res.json({ status: 404, result: rw.name, message: `Пользователь с таким Логином- ${rw.name} уже есть` })
                return true
            })
        }
        else {

            const name = req.body.login
            const password = req.body.pass;
            const role = req.body.role;

            const salt = bcrypt.genSaltSync(15)
            const pass = bcrypt.hashSync(password, salt)
            const sql = "INSERT INTO `users`(`name`,`password`,`role`)  VALUES('" + name + "','" + pass + "','" + role + "')"
            db.query(sql, (error, result) => {
                if (error) {
                    response.status(400, error, res)
                }
                else {
                    response.status(200, result, { message: `Пользователь зарегистрирован` }, res)
                }
            })
        }

    })
}




module.exports.sing = async function (req, res) {
    db.query("SELECT `id`, `name`, `password` FROM `users` WHERE `name`='" + req.body.username + "'", (error, rows, fields) => {
        if (error) {
            response.status(404, error, res)
        }
        else if (rows.length <= 0) {
            res.render('form.ejs', { message: 'Пользователь не найден!' })

            //  response.status(404, { message: `Пользователь с именем - ${req.body.username} не найден` }, '', res)
        }
        else {
            const row = JSON.parse(JSON.stringify(rows))
            console.log(row)
            row.map(rw => {
                const resulty = bcrypt.compareSync(req.body.password, rw.password)
                if (resulty) {
                    console.log(rw.name)
                    const token = jwt.sign({
                        userId: rw.id,
                        user: rw.name
                    }, 'jwt-key', { expiresIn: '30d' })
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
