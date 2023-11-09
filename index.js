
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const passport = require('passport')
const routes = require('./backend/routes/routes')
const userRoutes = require('./backend/routes/userRoutes')
const configRoutes = require('./backend/routes/configRoutes')
//const isToken = require('./middleware/auth.js')
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const app = express();
const wialonModule = require('./backend/modules/wialon.module');
const databaseService = require('./backend/services/database.service');
const globalstart = require('./backend/controllers/data.controller.js');
const WebSocket = require('ws');
const webpush = require('web-push');
require('events').EventEmitter.prototype._maxListeners = 0;

//const socked = require('./backend/services/database.services.js')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())
require('./backend/middleware/passport')(passport); // pass passport for configuration
app.use(bodyParser.json())
app.use(cookieParser());
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static(__dirname + '/public'));
app.use(routes)
app.use(userRoutes)
app.use(configRoutes)

require('dotenv').config();
const port = process.env.PORT
const initServer = () => {
    return new Promise((resolve) => {
        app.listen(port, () => {
            console.log(`Сервер запущен, порт:${port}`);
            resolve();
        });
    });
}



async function init() {
    await initServer()
    await wialon()

    globalstart.test()
    globalstart.hunterTime()
    setInterval(globalstart.test, 300000)
    setInterval(globalstart.hunterTime, 50000)

    console.log('сессия открыта')
}
init()


let session;
async function wialon() {
    const token = process.env.TOKEN// await getTokenFromDB(login)
    console.log(token)
    session = await wialonModule.login(token);

    const params = {
        'tzOffset': 0,
        "language": 'ru',
    }
    session.request('render/set_locale', params)
        .catch(function (err) {
            console.log(err);
        })
        .then(function (data) {
            console.log(data)
        });
}
exports.geSession = async () => {
    return new Promise(async (resolve, reject) => {
        if (session) { // Если сессия уже инициализирована
            resolve(session);
        } else {
            // Добавьте interval для попытки повторения, пока сессия не будет инициализирована
            const interval = setInterval(() => {
                if (session) {
                    clearInterval(interval); // Остановите interval, когда сессия будет готова
                    resolve(session);
                }
            }, 500);
        }
    });
}





























/*//oldBase
const mysql = require('mysql')
require('dotenv').config();




//newBase
const sql = require('mssql');








async function importToSqlServer(tablename, columns, row) {
    //   console.log(tablename, columns)
    try {
        let pool = await sql.connect({
            server: 'localhost',
            user: 'sa',
            password: 'Asdf2022',
            database: 'CursorMSSQL', //'CursorMSSQL',
            options: {
                trustServerCertificate: true // если используете самоподписанный сертификат SSL
            }
        });

        // Создание строки для описания колонок таблицы
        let columnsString = '';
        for (const column of columns) {
            let type = column.type;
            if (column.type === 'int(255)') {
                type = 'int'
            }
            if (column.type === 'mediumtext' || column.type === 'longtext') {
                type = 'varchar(MAX)'
            }

            columnsString += `${column.field} ${type}, `;
        }
        columnsString = columnsString.slice(0, -2); // Удаление последней запятой и пробела
        console.log(tablename)

        let result = await pool.request()
            // Создание команды SQL для создания таблицы
            .query(`CREATE TABLE ${tablename} (${columnsString})`)


    } catch (err) {
        console.error('Error on import', err);
    }
}

async function importData() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            supportBigNumbers: true,
            bigNumberStrings: true
        })
        pool.query('SHOW TABLES', (error, results, fields) => {
            if (error) throw error;
            results.forEach((row) => {
                const tableName = row[Object.keys(row)[0]];
                if (tableName !== 'chartData') {

                    pool.query(`DESCRIBE ${tableName}`, (error, results, fields) => {
                        if (error) throw error;

                        const columns = results.reduce((acc, column) => {
                            const columnName = column.Field;
                            const columnType = column.Type;
                            acc.push({ field: columnName, type: columnType })
                            return acc
                        }, []);
                        importToSqlServer(tableName, columns);
                        importRowsData(tableName)
                    });
                }
                else {
                    return
                    pool.query(`DESCRIBE ${tableName}`, (error, results, fields) => {
                        if (error) throw error;

                        const columns = results.reduce((acc, column) => {
                            const columnName = column.Field;
                            const columnType = column.Type;
                            acc.push({ field: columnName, type: columnType })
                            return acc
                        }, []);
                        // importToSqlServer(tableName, columns);
                        importRowsDataBig(tableName)
                    });
                }
            });
        })

    }
    catch (err) {
        console.error(err);
    }

}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    supportBigNumbers: true,
    bigNumberStrings: true
})

async function importRowsData(tableNames) {
    try {
        pool.query(`SELECT * FROM ${tableNames}`, function (err, result, fields) {
            if (err) throw err;

            const row = result
            importToSqlServerRows(tableNames, row);
        });

    }
    catch (err) {
        console.error(err);
    }
}

async function importRowsDataBig(tableNames) {
    try {
        let offset = 0;
        const limit = 50000;
        let hasMoreData = true;

        while (hasMoreData) {
            const query = `SELECT * FROM ${tableNames} LIMIT ${limit} OFFSET ${offset}`;

            // Делаем запрос и ожидаем результат
            const result = await new Promise((resolve, reject) => {
                pool.query(query, function (err, result, fields) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result);
                    }
                });
            });
            // Если в результате нет строк, устанавливаем hasMoreData в false и выходим из цикла
            if (result.length === 0) {
                hasMoreData = false;
            }
            else {
                // console.log(result)
                // Импортируем данные и увеличиваем смещение
                await importToSqlServerRows(tableNames, result);
                offset += limit;
                console.log(offset);
            }

            // Ждем 1 секунду перед следующим запросом
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    catch (err) {
        console.error(err);
    }
}


async function importToSqlServerRows(tableName, data) {
    let pool = await sql.connect({
        server: 'localhost',
        user: 'sa',
        password: 'Asdf2022',
        database: 'CursorMSSQL', //'CursorMSSQL',
        options: {
            trustServerCertificate: true // если используете самоподписанный сертификат SSL
        }
    });
    for (const row of data) {
        const columns = Object.keys(row).join(', ');

        const values = Object.keys(row).map((key) => `'${row[key]}'`).join(', ');

        let result = await pool.request()
            .query(`INSERT INTO ${tableName} (${columns}) VALUES (${values})`);
    }
    console.log("Import successful");
}*/