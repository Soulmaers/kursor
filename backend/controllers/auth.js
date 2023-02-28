const response = require('../../response')
const db = require('../settings/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const authTokens = {};
const { init } = require('../settings/wialon.js')
const express = require('express')
const app = express();



module.exports.page = async function (req, res) {
    res.render('form.ejs');
}

module.exports.sing = async function (req, res) {
    db.query("SELECT `id`, `name`, `password` FROM `users` WHERE `name`='" + req.body.username + "'", (error, rows, fields) => {
        if (error) {
            response.status(404, error, res)
        }
        else if (rows.length <= 0) {
            res.render('form.ejs')
            //  response.status(404, { message: `Пользователь с именем - ${req.body.username} не найден` }, '', res)
        }
        else {
            const row = JSON.parse(JSON.stringify(rows))
            row.map(rw => {
                if (req.body.password == rw.password) {
                    const token = jwt.sign({
                        userId: rw.id,
                        user: rw.name
                    }, 'jwt-key', { expiresIn: 120 * 120 })
                    //res.json(`Bearer ${token}`)
                    res.cookie('AuthToken', `${token}`)
                    //  console.log(res.cookies)
                    res.cookie('name', `${rw.name}`)
                    res.redirect('/action');

                    return;
                } else {
                    res.render('form.ejs')
                }
                return true
            })

        }
    })


}

module.exports.action = function (req, res) {
    console.log('работаем')
    console.log(req.cookies.AuthToken)
    if (req.user) {
        const login = req.user[0].name
        res.render('in.ejs', {
            user: login
        })
        init(login)
    }
    else {
        console.log('ошибка')
    }
}


module.exports.logout = async function (req, res, next) {
    res.redirect('/');
}
