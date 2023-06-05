const response = require('../../response')
const { speed } = require('../settings/wialon.js')
const connection = require('../settings/db')

module.exports.deleteStatic = (req, res) => {
    try {
        const postModel = `DELETE FROM allStatic WHERE idv IN ('${req.body.id}') AND idw IN('${req.body.idw}')`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err);
            else
                response.status(200, results, '', res)
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.deleteView = (req, res) => {
    const idw = req.body.idw
    try {
        const postModel = `DELETE FROM model WHERE idw='${idw}'`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err);
            response.status(200, results, '', res)
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.paramsDeleteView = (req, res) => {
    const idw = req.body.idw
    try {
        const postModel = `DELETE FROM tyres WHERE idw='${idw}'`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err);
            response.status(200, results, '', res)
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.barDelete = (req, res) => {
    const idw = req.body.idw
    try {
        const postModel = `DELETE FROM ifBar WHERE idw='${idw}'`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err);
            response.status(200, results, '', res)
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.tarirSave = (req, res) => {
    const arr = req.body.AllarrayTarir
    try {
        const selectBase = `SELECT nameCar FROM tarir WHERE idx='${arr[0][1]}'`
        connection.query(selectBase, function (err, results) {
            if (err) {
                console.log(err)
            }
            if (results.length === 0) {
                const postModel = `INSERT INTO tarir(date, idx,nameCar, zamer, DUT,litrs) VALUES?`
                connection.query(postModel, [arr], function (err, results) {
                    if (err) console.log(err);
                    response.status(200, results, '', res)
                })
            }
            if (results.length > 0) {
                arr.forEach(el => {
                    console.log(el[0])
                    const postModel = `UPDATE tarir SET  date='${el[0]}', idx='${el[1]}', nameCar='${el[2]}', zamer='${el[3]}', DUT='${el[4]}',litrs='${el[5]}'WHERE idx='${el[1]}' AND zamer='${el[3]}'`
                    connection.query(postModel, function (err, results) {
                        if (err) {
                            console.log(err)
                        }
                    })
                })
            }
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.tarirView = (req, res) => {
    const idw = req.body.idw
    try {
        const postModel = `SELECT * FROM tarir WHERE idx='${idw}'`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err);
            res.json({ result: results })
        })
    }
    catch (e) {
        console.log(e)
    }
}
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
module.exports.updateModel = (req, res) => {
    const idw = req.body.idw
    const massiv = req.body.massModel
    const nameCar = req.body.activePost
    massiv.forEach(el => {
        el.push(req.body.gosp)
        el.push(req.body.gosp1)
        el.push(req.body.frontGosp)
        el.push(req.body.frontGosp1)
        el.unshift(nameCar)
        el.unshift(idw)

        try {
            const selectBase = `SELECT osi FROM model WHERE idw='${el[0]}' AND osi='${el[2]}'`
            connection.query(selectBase, function (err, results) {
                if (err) {
                    console.log(err)
                };
                if (results.length === 0) {
                    const selectBase = `INSERT INTO model(idw, nameCar, osi, trailer, tyres, gosp, gosp1, frontGosp, frontGosp1) VALUES?`
                    connection.query(selectBase, [[el]], function (err, results) {
                        if (err) {
                            console.log(err)
                        };
                    })
                }
                if (results.length > 0) {
                    const postModel = `UPDATE model SET idw='${el[0]}', nameCar='${el[1]}',  osi='${el[2]}', trailer='${el[3]}', tyres='${el[4]}',gosp='${req.body.gosp}',gosp1='${req.body.gosp1}', frontGosp='${req.body.frontGosp}', frontGosp1='${req.body.frontGosp1}' WHERE idw='${el[0]}' AND osi='${el[2]}'`
                    connection.query(postModel, function (err, results) {
                        if (err) {
                            console.log(err)
                        }
                    })
                }
            })
        }
        catch (e) {
            console.log(e)
        }
    })
    res.json({ message: 'успех' })
}

module.exports.savePr = async (req, res) => {
    const value = [Object.values(req.body.arr)]
    if (req.body.arr.dataAdd) {
        try {
            console.log('дата есть')
            const sql = `INSERT INTO  tyresBase(idw, dataAdd, identificator, nameCar, typeOs, numberOs, idTyres, marka,
            model,
            psi,
            changeBar,
            probegNow,
            dateInstall,
            probegPass,
            dateZamer, N1, N2, N3, N4 ,maxMM) VALUES?`;
            connection.query(sql, [value], function (err, results) {
                if (err) console.log(err);
                res.json('Данные добавлены')
            });
        }
        catch (e) {
            console.log(e)
        }
    }
    else {
        try {
            console.log('даты нет')
            const sql = `INSERT INTO  tyresBase(idw, identificator, nameCar, typeOs, numberOs, idTyres, marka,
            model,
            psi,
            changeBar,
            probegNow,
            dateInstall,
            probegPass,
            dateZamer, N1, N2, N3, N4 ,maxMM) VALUES?`;
            connection.query(sql, [value], function (err, results) {
                if (err) console.log(err);
                res.json('Данные добавлены')
            });
        }
        catch (e) {
            console.log(e)
        }
    }
}
module.exports.modalBar = (req, res) => {
    const value = [req.body.arrValue];
    // console.log(value)
    try {
        const selectBase = `SELECT nameCar, idOs FROM ifBar WHERE idw='${value[0][0]}' AND idOs='${value[0][2]}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            if (results.length === 0) {
                const sql = `INSERT INTO  ifBar(idw, nameCar, idOs, norma, dnmin, dnmax, dnn, dvn, knd, kvd) VALUES?`;
                connection.query(sql, [value], function (err, results) {
                    if (err) console.log(err);
                    else res.json("Данные добавлены");
                });
            }
            if (results.length > 0) {
                const sql = `UPDATE ifBar SET idw='${value[0][0]}', nameCar='${value[0][1]}', idOs='${value[0][2]}', norma='${value[0][3]}', dnmin='${value[0][4]}', 
                    dnmax='${value[0][5]}',dnn='${value[0][6]}', dvn='${value[0][7]}', knd='${value[0][8]}', kvd='${value[0][9]}' WHERE idw='${value[0][0]}' AND idOs='${value[0][2]}'`;
                connection.query(sql, [value], function (err, results) {
                    if (err) console.log(err);
                    else res.json("Данные обновлены");
                });
            }
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.barView = (req, res) => {
    const idw = req.body.idw
    const count = req.body.id
    if (req.body.id) {
        try {
            const selectBase = `SELECT * FROM ifBar WHERE  idw='${idw}' AND idOs='${count}'`
            connection.query(selectBase, function (err, results) {
                if (err) console.log(err)
                response.status(200, results, '', res)
            })
        }
        catch (e) {
            console.log(e)
        }
    }
    else {
        try {
            const selectBase = `SELECT * FROM ifBar WHERE  idw='${idw}'`
            connection.query(selectBase, function (err, results) {
                if (err) console.log(err)
                response.status(200, results, '', res)
            })
        }
        catch (e) {
            console.log(e)
        }
    }
}
module.exports.barViewAll = (req, res) => {
    const idw = req.body.el
    try {
        const selectBase = `SELECT * FROM ifBar WHERE idw='${idw}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            res.json({ status: 200, result: results, message: req.body.car })
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.checkObject = (req, res) => {
    const login = req.body.login
    const role = req.body.role
    const objects = req.body.objects
    try {
        const selectBase = `SELECT id FROM userObjects WHERE 1`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            if (results.length === 0) {
                objects.forEach(el => {
                    const postModel = `INSERT INTO userObjects(login, role, object) VALUES('${login}','${role}','${el}')`
                    connection.query(postModel, function (err, results) {
                        if (err) console.log(err);
                    })
                })
            }
            else {
                const postModel = `DELETE FROM  userObjects WHERE login='${login}'`
                connection.query(postModel, function (err, results) {
                    if (err) console.log(err);
                    objects.forEach(el => {
                        const postModel = `INSERT INTO userObjects(login, role, object) VALUES('${login}','${role}','${el}')`
                        connection.query(postModel, function (err, results) {
                            if (err) console.log(err);
                        })
                    })
                })
            }
            res.json({ message: 'Объекты добавлены' })
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.viewCheckObject = (req, res) => {
    const login = req.body.name
    try {
        const selectBase = `SELECT Object FROM userObjects WHERE login='${login}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            res.json({ result: results })
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.icon = (req, res) => {
    try {
        const selectBase = `SELECT icons FROM icon WHERE idw='${req.body.idw}' AND icons='${req.body.id}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            if (results.length === 0) {
                const postModel = `INSERT INTO icon(idw, nameCar, params, coef, icons) VALUES('${req.body.idw}', '${req.body.activePost}','${req.body.param}','${req.body.coef}','${req.body.id}')`
                connection.query(postModel, function (err, results) {
                    if (err) console.log(err + 'ошибка26')
                    response.status(200, results, '', res)
                })
            }
            else {
                const sql = `UPDATE icon SET  idw='${req.body.idw}', nameCar='${req.body.activePost}', params='${req.body.param}', coef='${req.body.coef}', icons='${req.body.id}'WHERE  idw='${req.body.idw}' AND icons='${req.body.id}'`;
                connection.query(sql, function (err, results) {
                    if (err) console.log(err)
                    else response.status(200, results, '', res)
                });
            }
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.iconWindows = (req, res) => {
    try {
        const selectBase = `SELECT id FROM allStatic  WHERE idw='${req.body.idw}' AND idv='${req.body.id}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            if (results.length === 0) {
                const postModel = `INSERT INTO allStatic(idw, nameCar, params, coef, nameInput, idv) VALUES('${req.body.idw}', '${req.body.activePost}','${req.body.param}','${req.body.coef}','${req.body.nameInput}','${req.body.id}')`
                connection.query(postModel, function (err, results) {
                    if (err) console.log(err)
                    response.status(200, results, '', res)
                })
            }
            else {
                const sql = `UPDATE allStatic SET idw='${req.body.idw}', nameCar='${req.body.activePost}', params='${req.body.param}', coef='${req.body.coef}', nameInput='${req.body.nameInput}', idv='${req.body.id}' WHERE idw='${req.body.idw}'AND idv='${req.body.id}'`;
                connection.query(sql, function (err, results) {
                    if (err) console.log(err)
                    else response.status(200, results, '', res)
                });
            }
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.iconFind = (req, res) => {
    const idw = req.body.idw
    try {
        const postModel = `SELECT params, coef, icons FROM icon WHERE idw='${idw}'`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err)
            res.json({ status: 200, result: results, name: idw })
        })
    }
    catch (e) {
        console.log(e)
    }
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
module.exports.iconFindWindows = (req, res) => {
    try {
        const postModel = `SELECT params, coef, nameInput, idv FROM allStatic WHERE nameCar='${req.body.activePost}'`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err)
            res.json({ status: 200, result: results, name: req.body.activePost })
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
module.exports.tyres = (req, res) => {
    const nameCar = req.body.activePost
    const tyres = req.body.tyres
    const idw = req.body.idw
    tyres.forEach(el => {
        el.unshift(nameCar)
        el.unshift(idw)
        try {
            const selectBase = `SELECT tyresdiv FROM tyres WHERE idw='${el[0]}' AND tyresdiv='${el[2]}'`
            connection.query(selectBase, function (err, results) {
                if (err) {
                    console.log(err)
                };
                if (results.length === 0) {
                    const selectBase = `INSERT INTO tyres(idw, nameCar, tyresdiv, pressure,temp, osNumber) VALUES?`
                    connection.query(selectBase, [[el]], function (err, results) {
                        if (err) {
                            console.log(err)
                        };
                    })
                }
                if (results.length > 0) {
                    const postModel = `UPDATE tyres SET idw='${el[0]}', nameCar='${el[1]}', tyresdiv='${el[2]}', pressure='${el[3]}', temp='${el[4]}', osNumber='${el[5]}' WHERE idw='${el[0]}' AND tyresdiv='${el[2]}'`
                    connection.query(postModel, function (err, results) {
                        if (err) {
                            console.log(err)
                        }
                    })
                }
            })
        }
        catch (e) {
            console.log(e)
        }
    })
    res.json({ message: 'успех' })
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
module.exports.techView = (req, res) => {
    const nameCar = req.body.activePost
    const count = req.body.id
    //  console.log(req.body.idw)
    try {
        const selectBase = `SELECT marka,
        model,
        identificator,
        psi,
        changeBar,
        probegNow,
        dateInstall,
        probegPass,
        dateZamer,
        N1,
        N2,
        N3,
        N4,
        maxMM FROM tyresBase WHERE idw='${req.body.idw}' AND idTyres='${count}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            //   console.log(results)
            response.status(200, results, '', res)
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.techViewAll = (req, res) => {
    try {
        const selectBase = `SELECT * FROM tyresBase WHERE idw='${req.body.idw}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            response.status(200, results, '', res)
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.modelView = (req, res) => {
    const idw = req.body.idw
    try {
        const selectBase = `SELECT idw, nameCar, osi, trailer,tyres, gosp, gosp1, frontGosp, frontGosp1 FROM model WHERE  idw ='${idw}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            if (results === undefined) {
                response.status(200, results, '', res)
            }
            else {
                response.status(200, results, '', res)
            }
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.tyresView = (req, res) => {
    const idw = req.body.idw
    try {
        const selectBase = `SELECT tyresdiv, pressure,temp, osNumber FROM tyres WHERE idw='${idw}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            if (results === undefined) {
                response.status(200, results, req.body.activePost, res)
            }
            else {
                response.status(200, results, req.body.activePost, res)
            }
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.listModel = (req, res) => {
    const idw = req.body.el
    try {
        const selectBase = `SELECT osi, trailer,tyres FROM model WHERE idw='${idw}'`
        connection.query(selectBase, function (err, results) {
            console.log(err)
            res.json({ status: 200, result: results, message: req.body.car })
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.listTyres = (req, res) => {
    const idw = req.body.el
    try {
        const selectBase = `SELECT tyresdiv, pressure, temp, osNumber FROM tyres WHERE idw='${idw}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            if (results === undefined) {
                res.json({ status: 200, result: results, message: req.body.car })
            }
            else {
                res.json({ status: 200, result: results, message: req.body.car })
            }
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.alarmFind = (req, res) => {
    const idw = req.body.idw
    const tyresp = req.body.tyresP
    try {
        const sqls1 = `SELECT data, senspressure, bar, temp, alarm  FROM alarms WHERE idw='${idw}' AND senspressure='${tyresp}'`
        connection.query(sqls1, function (err, results) {
            if (err) console.log(err)
            if (results.length === 0) {
                res.json([])
            }
            else {
                res.json(results)
            }
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.speedData = async (req, res) => {
    try {
        speed(req.body.t1, req.body.t2, req.body.int, req.body.id, res)
    }
    catch (e) {
        console.log(e)
    }
}
