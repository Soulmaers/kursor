

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const { response } = require('express')
const db = require('../settings/db')
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'jwt-key'

}


module.exports = passport => {
    passport.use(
        new JwtStrategy(options, (payload, done) => {

            try {
                db.query("SELECT `id`, `email` FROM `users` WHERE `id`='" + payload.userId + "'", (error, rows, fields) => {
                    if (error) {
                        console.log(error)
                    } else {
                        const user = rows
                        if (user) {
                            done(null, user)
                        } else {
                            done(null, false)
                        }
                    }

                })
            } catch (e) {
                console.log(e)
            }
        })
    )

}