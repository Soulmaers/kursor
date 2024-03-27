//const connection = require('../config/db')
const { connection, sql } = require('../config/db')


module.exports.generate = (req, res) => {
    const id = req.body.newId
    const arr = [req.body.arrNameColId]
    try {
        const selectBase = `SELECT identificator FROM tyresBase WHERE  identificator='${id}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err + 'ошибка33')
            if (results.length > 0) {
                res.json({ boolean: false, message: 'Такой ID есть' })
            }
            else {
                const sql = `INSERT INTO  tyresBase (idw, dataAdd, identificator, nameCar, typeOs, numberOs, idTyres, marka, model, psi,changeBar,
                    probegNow, dateInstall, probegPass, dateZamer, N1, N2, N3, N4, maxMM) VALUES?`;
                connection.query(sql, [arr], function (err, results) {
                    if (err) console.log(err)
                    res.json({ boolean: true, result: id, message: `Колесо установлено` })
                });
            }
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.listTyresId = async (req, res) => {
    try {
        const pool = await connection
        const selectBase = `SELECT * FROM tyresBase WHERE idw=@idw`
        const results = await pool.request().input('idw', req.body.idw).query(selectBase)
        res.json({ result: results.recordset })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.rotate = (req, res) => {
    const id1 = req.body.relArr[0]
    const id2 = req.body.relArr[1]
    try {
        const selectBase = `SELECT * FROM tyresBase WHERE identificator IN('${id1}', '${id2}')`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            res.json({ status: 200, result: results })
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.findId = (req, res) => {
    try {
        const selectBase = `SELECT identificator FROM tyresBase WHERE 1`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            res.json({ status: 200, result: results })
        })
    }
    catch (e) {
        console.log(e)
    }
}




