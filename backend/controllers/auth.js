//const response = require('../../response')
//const db = require('../settings/db')
//const bcrypt = require('bcryptjs')
//const jwt = require('jsonwebtoken')
const { init } = require('../settings/wialon.js')



module.exports.page = async function (req, res) {
    res.render('form.ejs', { message: req.flash('loginMessage') }); // load the index.ejs file

}

module.exports.profile = async function (req, res) {
    // console.log(req.user)
    res.render('in.ejs', {
        user: req.user // get the user out of session and pass to template
    })
}


module.exports.spisok = async function (req, res) {
    console.log(req.user)
    res.render('in.ejs', {
        user: req.user // get the user out of session and pass to template
    })
    init(req.user)
}


module.exports.logout = async function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    })
}






/*
exports.getAllUsers = (req, res) => {
    console.log(req.body)
    db.query('SELECT  `name` FROM `users`', (error, rows, fields) => {
        if (error) {
            response.status(404, error, res)
        }

        else {
            res.redirect('/cont');
        }
    })
    //  res.redirect('/cont')
}

exports.signup = (req, res) => {
    console.log(req.body)
    db.query("SELECT `id`, `email`, `name` FROM `users` WHERE `email`='" + req.body.email + "'", (error, rows, field) => {
        if (error) {
            response.status(404, res)
        } else if (typeof rows !== 'undefined' && rows.length > 0) {
            // сonsole.log(rows)
            const row = JSON.parse(JSON.stringify(rows))
            row.map(rw => {
                response.status(404, { message: `Пользователь с таким email- ${rw.email} уже есть` }, res)
                return true
            })
        }
        else {
            const email = req.body.email
            const name = req.body.name
            const secondName = req.body.second_name !== '' ? req.body.second_name : ''
            const password = req.body.password;
            //const salt = bcrypt.genSaltSync(15)
            // const password = bcrypt.hashSync(req.body.password, salt)
            const sql = "INSERT INTO `users`(`name`, `second_name`,`email`, `password`) VALUES('" + name + "', '" + secondName + "', '" + email + "', '" + password + "')"
            db.query(sql, (error, result) => {
                if (error) {
                    response.status(400, error, res)
                }
                else {
                    response.status(200, { message: `Регистрация прошла успешно`, result }, res)
                }
            })
        }

    })
}


exports.signin = (req, res) => {
    console.log(req.body.login)
    console.log(req.body.pass)
    db.query("SELECT `id`, `name`, `password` FROM `users` WHERE `name`='" + req.body.login + "'", (error, rows, fields) => {
        if (error) {
            response.status(404, error, res)
        }
        else if (rows.length <= 0) {
            response.status(404, { message: `Пользователь с name - ${req.body.login} не найден` }, res)
        }
        else {
            const row = JSON.parse(JSON.stringify(rows))
            row.map(rw => {
                //const password =bcrypt.compareSync(req.body.password, rw.password)
                if (req.body.pass == rw.password) {
                    const token = jwt.sign({
                        userId: rw.id,
                        email: rw.email
                    }, 'jwt-key', { expiresIn: 120 * 120 })
                    response.status(200, { token: `Bearer ${token}`, message: 'Вы авторизованы' }, res);
                } else {
                    response.status(404, { message: 'Пароль не верный' }, res)
                }
                return true
            })

        }
    })


}*/