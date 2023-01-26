const response = require('../response')
const db = require('../settings/db')
//const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.getAllUsers = (req, res) => {

    db.query('SELECT  `name`, `second_name`, `email` FROM `users`', (error, rows, fields) => {
        if (error) {
            response.status(404, error, res)
        }
        else {
            response.status(200, rows, res)
        }
    })

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
    console.log(req.body)
    db.query("SELECT `id`, `email`, `password` FROM `users` WHERE `email`='" + req.body.email + "'", (error, rows, fields) => {
        if (error) {
            response.status(404, error, res)
        }
        else if (rows.length <= 0) {
            response.status(404, { message: `Пользователь с email - ${req.body.email} не найден` }, res)
        }
        else {
            const row = JSON.parse(JSON.stringify(rows))
            row.map(rw => {
                //const password =bcrypt.compareSync(req.body.password, rw.password)
                if (req.body.password == rw.password) {
                    const token = jwt.sign({
                        userId: rw.id,
                        email: rw.email
                    }, 'jwt-key', { expiresIn: 120 * 120 })
                    response.status(200, { token: `Bearer ${token}`, message: 'Вы авторизованы' }, res)
                } else {
                    response.status(404, { message: 'Пароль не верный' }, res)
                }
                return true
            })

        }
    })


}