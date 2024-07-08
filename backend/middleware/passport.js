const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
//const db = require('../config/db')
const { connection, sql } = require('../config/db')


const cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies.AuthToken) token = req.cookies['AuthToken'];
    return token;
};

module.exports = function (passport) { //натсройка аутентификации пользователя
    var opts = {};
    opts.jwtFromRequest = cookieExtractor; // проверяем токен в куке
    opts.secretOrKey = 'jwt-key';

    passport.use(
        new JwtStrategy(opts, async (payload, done) => {
            try {
                //  console.log(payload)
                const pool = await connection;
                const post = `SELECT idx, name, role, incriment FROM users WHERE idx='${payload.userId}'`
                const result = await pool.request().query(post);
                const user = result.recordset[0];
                if (user.name) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } catch (error) {
                console.log('Ошибка: ' + error);
                done(error, false);
            } finally {
                sql.close();
            }
        })
    )
}