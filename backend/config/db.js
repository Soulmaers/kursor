
require('dotenv').config();

const sql = require('mssql');


const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    options: {
        trustServerCertificate: true // если используете самоподписанный сертификат SSL
    }
}



const pool = new sql.ConnectionPool(config);
const connection = pool.connect()

module.exports.sql = sql;
module.exports.connection = connection;