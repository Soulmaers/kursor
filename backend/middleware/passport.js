
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'jwt-key'
}


const mysql = require('mysql');
const connection = require('../settings/db.js');

// expose this function to our app using module.exports
module.exports = function (passport) {
       passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        //connection.connect();
        connection.query("SELECT * FROM users WHERE id = ? ", [id], function (err, rows) {
            done(err, rows[0]);
        });
        //    connection.end();
    });

        passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
            function (req, username, password, done) { // callback with email and password from our form
                // connection.connect();
               // console.log('РАБОТАЕМ')
                connection.query("SELECT * FROM users WHERE name = ?", [username], function (err, rows) {
                    console.log(rows[0])
                    if (err)
                        return done(err);
                    if (!rows.length) {
                        return done(null, false, req.flash('loginMessage', 'Пользователь не найден!')); // req.flash is the way to set flashdata using connect-flash
                    }
                    // if the user is found but the password is wrong
                    if (password !== rows[0].password)
                        return done(null, false, req.flash('loginMessage', 'Не верный пароль!')); // create the loginMessage and save it to session as flashdata

                    // all is well, return successful user
                    return done(null, rows[0]);
                });
                //connection.end();
            })
    );
};































    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    /*
        passport.use(
            'local-signup',
            new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'name',
                passwordField: 'password',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
                function (req, name, password, done) {
                    console.log('запуск')
                    // find a user whose email is the same as the forms email
                    // we are checking to see if the user trying to login already exists
                    //  connection.connect();
                    connection.query("SELECT * FROM users WHERE name = ?", [name], function (err, rows) {
                        if (err)
                            return done(err);
                        if (rows.length) {
                            return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                        } else {
                            // if there is no user with that username
                            // create the user
                            var newUserMysql = {
                                username: username,
                                password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                            };
    
                            var insertQuery = "INSERT INTO users ( name, password ) values (?,?)";
                            //   connection.connect();
                            connection.query(insertQuery, [newUserMysql.username, newUserMysql.password], function (err, rows) {
                                newUserMysql.id = rows.insertId;
    
                                return done(null, newUserMysql);
                            });
                            //  connection.end();
                        }
                    });
                    // connection.end();
                })
        );
    */
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'