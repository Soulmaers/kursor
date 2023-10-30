const mysql = require('mysql')
require('dotenv').config();
/*const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})*/
const sql = require('mssql');



const config = {
    user: 'sa', // ваше имя пользователя
    password: 'Asdf2022', // ваш пароль
    server: 'localhost', // имя вашего сервера
    database: 'CursorMSSQL', // имя вашей базы данных
    options: {
        trustServerCertificate: true // если используете самоподписанный сертификат SSL
    }
}



const pool = new sql.ConnectionPool(config);
const connection = pool.connect()

module.exports.sql = sql;
module.exports.connection = connection;