const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const { response } = require('express')
const db = require('../settings/db')

const cookieExtractor = function (req) {
    console.log(req.cookies['AuthToken'])
    var token = null;
    if (req && req.cookies.AuthToken) token = req.cookies['AuthToken'];
    return token;
};

module.exports = function (passport) {
    var opts = {};
    opts.jwtFromRequest = cookieExtractor; // check token in cookie
    opts.secretOrKey = 'jwt-key'
    //  console.log('работаем')
    passport.use(
        new JwtStrategy(opts, (payload, done) => {
            // console.log(token)
            console.log('работаем')
            try {
                db.query("SELECT `id`, `name` FROM `users` WHERE `id`='" + payload.userId + "'", (error, rows, fields) => {
                    console.log('работаем')
                    if (error) {
                        console.log(error)
                    } else {
                        //  console.log(rows)
                        const user = rows
                        if (user) {
                            //   console.log(user[0].name)
                            done(null, user)
                        } else {
                            done(null, false,)
                        }
                    }

                })
            } catch (e) {
                console.log(e)
            }
        })
    )

}