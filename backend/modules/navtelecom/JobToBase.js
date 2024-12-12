const { connection, sql } = require('../../config/db')


class JobToBase {
    constructor(id) {


        //выгрузка данных из базы

        //удаление данных из базы

        //поиск данных по id Объекта
    }

    async createTable(table) {

        const tableName = table; // Имя таблицы, которую нужно создать
        const createTableQuery = `IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = '${tableName}')  CREATE TABLE ${tableName} (id int IDENTITY(1, 1) PRIMARY KEY)`
        const pool = await connection;
        try {
            // Выполняем запрос на создание таблицы (если ее еще нет) и ждем выполнения
            await pool.request().query(createTableQuery);
        } catch (e) {
            console.log(e)
        }
    }


    async fillingTableColumns(object, table) { //проверка и создание столбцов в таблице БД
        try {
            // console.log(table)
            const tableName = table;
            const columnsQuery = `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}'`;
            const pool = await connection;

            const result = await pool.request().query(columnsQuery);
            const columns = result.recordset;
            for (const key in object) {
                if (object.hasOwnProperty(key)) {
                    const value = object[key];
                    const columnExists = columns.some(column => column.COLUMN_NAME === key);
                    if (!columnExists) {
                        const dataType = 'varchar(255)'
                        const addColumnQuery = `ALTER TABLE ${tableName} ADD ${key} ${dataType}`;
                        await pool.request().query(addColumnQuery);
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    async fillingTableRows(object, table) { //запись строк в таблицу БД
        //   console.log('сроки')
        //  console.log(object)
        //  console.log(table)
        //  console.log('записьс строк в таблицу')
        try {
            const tableName = table;
            const columns = Object.keys(object).join(', ');
            const values = Object.values(object).map(value => `'${value}'`).join(', ');

            const addValueQuery = `INSERT INTO ${tableName} (${columns}) VALUES (${String(values)})`;
            const pool = await connection;
            await pool.request().query(addValueQuery);
        } catch (error) {
            console.log(error);
        }

    }
}

module.exports = JobToBase