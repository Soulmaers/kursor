const { connection, sql } = require('../../../config/db')

class ToBaseMethods {


    static async getConfigs(idw) {
        try {
            const pool = await connection
            const selectBase = `SELECT * FROM config_params WHERE idw=@idw`
            const result = await pool.request()
                .input('idw', idw)
                .query(selectBase);
            return result.recordset
        }
        catch (e) {
            console.log(e)
        }
    }

    static async setUpdateValueSensStorMeta(imei, port, data) {
        try {
            const pool = await connection;
            for (let i of data) {
                const updateQuery = `UPDATE sens_stor_meta SET value=@value, data=@data, status= @status WHERE imei=@imei AND port=@port AND params=@params`;
                const res = await pool.request()
                    .input('port', String(port))
                    .input('imei', imei)
                    .input('value', sql.VarChar, i.value)
                    .input('meta', sql.VarChar, i.key)
                    .input('params', sql.VarChar, i.params)
                    .input('data', i.data)
                    .input('status', sql.VarChar, i.status)
                    .query(updateQuery);
            }
            return 'таблица обновлена'

        } catch (error) {
            console.log(error)
        }
    }

    static async setAddDataToGlobalBase(obj) {
        try {
            const pool = await connection;
            const columns = Object.keys(obj).filter((column) => obj[column] !== null);
            const values = Object.values(obj)
                .filter(value => value !== null)
                .map(value => `'${value}'`)
                .join(', ');
            const post = `INSERT INTO globalStor (${columns.join(', ')}) VALUES (${String(values)})`;
            const result = await pool.request()
                .query(post);
            return result.recordset
        } catch (error) {
            console.log(error)
        }
    }

    static async getOil(filter, id) {
        try {
            const pool = await connection;

            // Получаем количество записей, которое необходимо, вычитая 1 из filter
            const topCount = Number(filter) - 1;
            // Формируем SQL-запрос с сортировкой по дате и ограничением по количеству записей
            const post = `SELECT TOP ${topCount} dut, last_valid_time FROM globalStor WHERE idw = @idw ORDER BY last_valid_time DESC`;
            const result = await pool.request()
                .input('idw', id)
                .query(post);
            return result.recordset;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = { ToBaseMethods }