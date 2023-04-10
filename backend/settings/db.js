const mysql = require('mysql')
require('dotenv').config();
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})
/*
var pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});*/
connection.connect((error) => {
    if (error) {
        return console.log('Ошибка подключения к базе')
    }
    else {
        return console.log('Подключение к БД выполнено')
    }
})

module.exports = connection