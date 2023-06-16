const connection = require('../config/db')

module.exports.viewStatus = (req, res) => {
    try {
        const postModel = `SELECT * FROM statusObj WHERE idw='${req.body.idw}'`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err);
            res.json({ result: results })
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.saveStatus = (req, res) => {
    if (req.body.status !== undefined) {
        const mass = [req.body.idw, req.body.activePost, req.body.todays, req.body.statusTSI, req.body.todays, req.body.status]
        try {
            const postModel = `SELECT * FROM statusObj WHERE idw='${req.body.idw}'`
            connection.query(postModel, function (err, results) {
                if (err) console.log(err);
                if (results.length === 0) {
                    const selectBase = `INSERT INTO statusObj(idw, nameCar, time, status, timeIng, statusIng) VALUES?`
                    connection.query(selectBase, [[mass]], function (err, results) {
                        if (err) {
                            console.log(err)
                        };
                    })
                }
                else {
                    if (results[0].status !== req.body.statusTSI) {
                        const postModel = `UPDATE statusObj SET time='${req.body.todays}',status='${req.body.statusTSI}' WHERE idw='${req.body.idw}'`
                        connection.query(postModel, function (err, results) {
                            if (err) {
                                console.log(err)
                            }
                        })
                    }
                    if (results[0].statusIng !== req.body.status) {
                        const postModel = `UPDATE statusObj SET timeIng='${req.body.todays}',statusIng='${req.body.status}' WHERE idw='${req.body.idw}'`
                        connection.query(postModel, function (err, results) {
                            if (err) {
                                console.log(err)
                            }
                        })
                    }
                }
            })
        }
        catch (e) {
            console.log(e)
        }
    }
    res.json({ message: 'выполнено' })
}

module.exports.to = (req, res) => {
    try {
        const selectBase = `SELECT id FROM toChange  WHERE nameCar='${req.body.activePost}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            if (results.length === 0) {
                const postModel = `INSERT INTO toChange(nameCar, value) VALUES('${req.body.activePost}', '${req.body.valueTO}')`
                connection.query(postModel, function (err, results) {
                    if (err) console.log(err)
                    else res.json({ message: 'запись есть' })
                })
            }
            else {
                const sql = `UPDATE toChange SET nameCar='${req.body.activePost}',  value='${req.body.valueTO}' WHERE nameCar='${req.body.activePost}'`;
                connection.query(sql, function (err, results) {
                    if (err) console.log(err)
                    else res.json({ message: 'запись обновлена' })
                });
            }
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.toView = (req, res) => {
    try {
        const postModel = `SELECT nameCar, value FROM toChange WHERE nameCar='${req.body.activePost}'`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err)
            res.json({ status: 200, result: results, name: req.body.activePost })
        })
    }
    catch (e) {
        console.log(e)
    }
}
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
module.exports.listTyresId = (req, res) => {
    try {
        const selectBase = `SELECT * FROM tyresBase WHERE idw='${req.body.idw}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            res.json({ status: 200, result: results })
        })
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




