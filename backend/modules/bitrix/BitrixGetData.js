
const { connection, sql } = require('../../config/db')
class BitrixGetData {

    static getProtektorBitrix = async (idw) => {
        try {
            const selectBase = `SELECT TOP 1 th.*, tg.*
FROM tyres_history th
JOIN tyres_guide tg ON th.uniqTyresID = tg.uniqTyresID
WHERE th.id_bitrix = @id_bitrix
ORDER BY th.incriment DESC`
            const pool = await connection
            const results = await pool.request()
                .input('id_bitrix', idw)
                .query(selectBase)
            return results.recordset.length !== 0 ? results.recordset[0] : []
        } catch (err) {
            console.error(err)
            throw err
        }
    }


    static getDataBitrix = async (idw) => {
        console.log(idw)
        try {
            const selectBase = `SELECT * FROM sens_stor_meta WHERE idBitrixObject=@idBitrixObject`
            const pool = await connection
            const results = await pool.request()
                .input('idBitrixObject', idw)
                .query(selectBase)
            return results.recordset.length !== 0 ? results.recordset : []
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    static getIdObject = async (id_bitrix) => {
        console.log(id_bitrix)
        try {
            const selectBase = `SELECT idObject FROM object_table WHERE id_bitrix=@id_bitrix`
            const pool = await connection
            const results = await pool.request()
                .input('id_bitrix', id_bitrix)
                .query(selectBase)
            return results.recordset.length !== 0 ? results.recordset : []
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    static setIDBitrixEvent = async (idBitrix, idObject) => {
        console.log(idBitrix, idObject)
        console.log('тут?')
        try {

            const selectBase = `INSERT INTO bitrix_table_events(idBitrix, idObject) VALUES(@idBitrix,@idObject)`
            const pool = await connection
            const results = await pool.request()
                .input('idBitrix', idBitrix)
                .input('idObject', idObject)
                .query(selectBase)
            return 'подписка'
        } catch (err) {
            console.error(err)
            throw err
        }

    }
    static deleteIDBitrixEvent = async (idBitrix, idObject) => {
        console.log(idBitrix, idObject)
        console.log('не тут')
        try {

            const selectBase = `DELETE FROM bitrix_table_events WHERE idBitrix=@idBitrix`
            const pool = await connection
            const results = await pool.request()
                .input('idBitrix', idBitrix)
                .query(selectBase)
            return 'отписка'
        } catch (err) {
            console.error(err)
            throw err
        }

    }
}


module.exports = {
    BitrixGetData
}