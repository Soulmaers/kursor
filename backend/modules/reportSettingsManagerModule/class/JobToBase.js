const { connection, sql } = require('../../../config/db')



class JobToBase {

    static setToBaseSettings = async (idw, json) => {
        const sqls = `INSERT INTO setReports(idw, jsonsetAttribute) VALUES (@idw, @json)`;
        const pool = await connection;
        try {
            const res = await pool.request()
                .input('idw', idw)
                .input('json', json)
                .query(sqls);

            return 'Настройки сохранены'
        }
        catch (error) {
            console.log(error);
            return error
        }
    };

    static updateSettingsDefaultToBase = async (idw, json) => {
        const sqls = `UPDATE setReports SET jsonsetAttribute=@json WHERE idw=@idw`;
        const pool = await connection;
        try {
            const res = await pool.request()
                .input('idw', idw)
                .input('json', json)
                .query(sqls);

            return 'Настройки обновлены'
        }
        catch (error) {
            console.log(error);
            return error
        }
    };

    static getSettingsToBase = async (idw) => {
        console.log(idw)
        const sqls = `SELECT * FROM setReports WHERE idw=@idw`;
        const pool = await connection;
        try {
            const res = await pool.request()
                .input('idw', String(idw))
                .query(sqls);
            return res.recordset
        }
        catch (error) {
            console.log(error);
            return error
        }
    };

    static updateAttributes = async (idw, data) => {
        try {
            const pool = await connection
            const postModel = `UPDATE  setReports SET jsonsetAttribute=@jsonsetAttribute WHERE idw=@idw`
            const result = await pool.request()
                .input('idw', idw)
                .input('jsonsetAttribute', data)
                .query(postModel)
            return 'Настройки обновлены'
        }

        catch (e) {
            console.log(e)
            return error
        }

    }

    static testdut = async (idw, time1, time2) => {
        try {
            const pool = await connection
            const postModel = `SELECT rs485fuel_level1, last_valid_time FROM wialon_origin WHERE idObject=@idw AND last_valid_time >= @time1 AND last_valid_time <= @time2 `
            const result = await pool.request()
                .input('idw', idw)
                .input('time2', String(time2))
                .input('time1', String(time1))
                .query(postModel)
            if (result.recordset.length === 0) {
                return []
            }
            else {
                return result.recordset
            }
        }
        catch (e) {
            console.log(e)
        }
    }
}


module.exports = { JobToBase }