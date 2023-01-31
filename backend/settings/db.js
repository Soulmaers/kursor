const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'new'
})

connection.connect((error) => {
    if (error) {
        return console.log('Ошибка подключения к базе')
    }
    else {
        return console.log('Подключение к БД выполнено')
    }
})

module.exports = connection