require('dotenv').config();
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    pool: {
        max: 100,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        trustServerCertificate: true
    },
    requestTimeout: 600000,      // ⬅️ до 60 сек на выполнение запроса
    connectionTimeout: 15000    // ⬅️ до 15 сек на подключение
};
const pool = new sql.ConnectionPool(config);
const connection = pool.connect();

let session;

const getSession = () => {
    return new Promise((resolve, reject) => {
        if (session) {
            resolve(session);
        } else {
            const checkInterval = setInterval(() => {
                if (session) {
                    clearInterval(checkInterval);
                    resolve(session);
                }
            }, 500);
        }
    });
};

const setSession = (newSession) => {
    session = newSession;
};

module.exports = {
    sql,
    connection,
    getSession,
    setSession
};