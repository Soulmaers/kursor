const { connection, sql } = require('../../../config/db')

class ToBaseMethods {

    static async getConfigs(idw) {
        try {
            const pool = await connection
            const selectBase = `SELECT * FROM config_params WHERE idw=@idw AND param=@param`
            const result = await pool.request()
                .input('idw', idw)
                .input('param', 'oil')
                .query(selectBase);
            return result.recordset ? result.recordset[0] : null
        }
        catch (e) {
            console.log(e)
        }
    }

}

module.exports = { ToBaseMethods }