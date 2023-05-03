const response = require('../../response')
//const wialon = require('wialon');
const { speed } = require('../settings/wialon.js')
const connection = require('../settings/db')



module.exports.deleteStatic = (req, res) => {

    try {
        const postModel = `DELETE FROM allStatic WHERE idv IN ('${req.body.id}') AND nameCar IN('${req.body.activePost}')`
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
    const nameCar = req.body.name
    try {
        const postModel = `DELETE FROM model WHERE nameCar='${nameCar}'`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err);
            //console.log(results)
            response.status(200, results, '', res)
        })
    }
    catch (e) {
        console.log(e)
    }
}



module.exports.paramsDeleteView = (req, res) => {
    console.log(req.body.name)
    console.log('удаляем!')
    const nameCar = req.body.name
    try {
        const postModel = `DELETE FROM tyres WHERE nameCar='${nameCar}'`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err);
            //console.log(results)
            response.status(200, results, '', res)
        })
    }
    catch (e) {
        console.log(e)
    }

}

module.exports.barDelete = (req, res) => {
    console.log(req.body.name)
    console.log('удаляем!!!!')
    const nameCar = req.body.name
    try {
        const postModel = `DELETE FROM ifBar WHERE nameCar='${nameCar}'`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err);
            //console.log(results)
            response.status(200, results, '', res)
        })
    }
    catch (e) {
        console.log(e)
    }

}



module.exports.tarirSave = (req, res) => {
    const arr = req.body.AllarrayTarir
    //  console.log(arr[0][1])
    try {

        const selectBase = `SELECT nameCar FROM tarir WHERE nameCar='${arr[0][1]}'`
        connection.query(selectBase, function (err, results) {
            if (err) {
                console.log(err)
            }
            //console.log(results)
            if (results.length === 0) {
                //   console.log('1')
                const postModel = `INSERT INTO tarir(date, nameCar, zamer, DUT,litrs) VALUES?`
                connection.query(postModel, [arr], function (err, results) {
                    if (err) console.log(err);
                    //console.log(results)
                    response.status(200, results, '', res)
                })
            }
            if (results.length > 0) {
                // console.log('2')
                const postModel = `UPDATE tarir SET  date='${arr[0][0]}', nameCar='${arr[0][1]}', zamer='${arr[0][2]}', DUT='${arr[0][3]}',litrs='${arr[0][4]}' WHERE nameCar='${arr[0][1]}' AND zamer='${arr[0][2]}'`
                connection.query(postModel, function (err, results) {
                    if (err) {
                        console.log(err)
                    }
                    response.status(200, results, '', res)
                })
            }
        })
    }
    catch (e) {
        console.log(e)
    }
}

module.exports.tarirView = (req, res) => {
    try {
        const postModel = `SELECT * FROM tarir WHERE nameCar='${req.body.activePost}'`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err);
            //console.log(results)
            res.json({ result: results })
        })
    }
    catch (e) {
        console.log(e)
    }

}
module.exports.viewStatus = (req, res) => {
    //  console.log('запрос работа')
    try {
        const postModel = `SELECT * FROM statusObj WHERE idw='${req.body.idw}'`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err);
            //  console.log(results)
            res.json({ result: results })
        })
    }
    catch (e) {
        console.log(e)
    }

}

module.exports.saveStatus = (req, res) => {

    // console.log(req.body)
    //  console.log(req.body.idw, req.body.activePost, req.body.todays, req.body.statusTSI, req.body.status)
    if (req.body.status !== undefined) {
        const mass = [req.body.idw, req.body.activePost, req.body.todays, req.body.statusTSI, req.body.todays, req.body.status]
        try {
            const postModel = `SELECT * FROM statusObj WHERE idw='${req.body.idw}'`
            connection.query(postModel, function (err, results) {
                if (err) console.log(err);
                //  console.log(results[0].status)
                if (results.length === 0) {
                    //  console.log('оно?')
                    const selectBase = `INSERT INTO statusObj(idw, nameCar, time, status, timeIng, statusIng) VALUES?`
                    connection.query(selectBase, [[mass]], function (err, results) {
                        if (err) {
                            console.log(err)

                        };

                    })
                    //  res.json({ message: 'выполнена запись' })
                }
                else {
                    if (results[0].status !== req.body.statusTSI) {
                        const postModel = `UPDATE statusObj SET time='${req.body.todays}',status='${req.body.statusTSI}' WHERE idw='${req.body.idw}'`
                        connection.query(postModel, function (err, results) {
                            if (err) {
                                console.log(err)
                            }
                            //  res.json({ message: 'выполнено обновление' })
                        })
                    }
                    if (results[0].statusIng !== req.body.status) {
                        const postModel = `UPDATE statusObj SET timeIng='${req.body.todays}',statusIng='${req.body.status}' WHERE idw='${req.body.idw}'`
                        connection.query(postModel, function (err, results) {
                            if (err) {
                                console.log(err)
                            }
                            //  res.json({ message: 'выполнено обновление' })
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
    //  console.log('обновляем')
    //  console.log(req.body.massModel)
    const massiv = req.body.massModel
    const nameCar = req.body.activePost
    //  console.log(req.body.gosp)
    const tableModel = 'model' + req.body.activePost
    massiv.forEach(el => {
        el.push(req.body.gosp)
        el.unshift(nameCar)
        //  console.log(el)
        try {
            const selectBase = `SELECT osi FROM model WHERE nameCar='${el[0]}' AND osi='${el[1]}'`
            connection.query(selectBase, function (err, results) {
                if (err) {
                    console.log(err)
                };

                if (results.length === 0) {
                    //    console.log(el + '   ' + '2')
                    const selectBase = `INSERT INTO model(nameCar, osi, trailer, tyres, gosp) VALUES?`
                    connection.query(selectBase, [[el]], function (err, results) {
                        if (err) {
                            console.log(err)

                        };
                    })
                }
                if (results.length > 0) {
                    //  console.log(el + '   ' + '3')
                    const postModel = `UPDATE model SET nameCar='${el[0]}', osi='${el[1]}', trailer='${el[2]}', tyres='${el[3]}',gosp='${req.body.gosp}' WHERE nameCar='${el[0]}' AND osi='${el[1]}'`
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
    // const value = [req.body.arr]
    // console.log(req.body.arr.dataAdd)
    const value = [Object.values(req.body.arr)]
    // console.log(value)
    if (req.body.arr.dataAdd) {
        try {
            const sql = `INSERT INTO  tyresBase(dataAdd, identificator, nameCar, typeOs, numberOs, idTyres, marka,
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
            const sql = `INSERT INTO  tyresBase(identificator, nameCar, typeOs, numberOs, idTyres, marka,
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
    //  console.log(value)

    try {
        const selectBase = `SELECT nameCar, idOs FROM ifBar WHERE nameCar='${value[0][0]}' AND idOs='${value[0][1]}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            //    console.log(results)
            if (results.length === 0) {
                //  console.log('запусккк')
                const sql = `INSERT INTO  ifBar(nameCar, idOs, norma, dnmin, dnmax, dnn, dvn, knd, kvd) VALUES?`;
                connection.query(sql, [value], function (err, results) {
                    if (err) console.log(err);
                    else res.json("Данные добавлены");
                });
            }
            if (results.length > 0) {
                //   console.log('БОЛЬШЕ 0')
                const sql = `UPDATE ifBar SET nameCar='${value[0][0]}', idOs='${value[0][1]}', norma='${value[0][2]}', dnmin='${value[0][3]}', 
                    dnmax='${value[0][4]}',dnn='${value[0][5]}', dvn='${value[0][6]}', knd='${value[0][7]}', kvd='${value[0][8]}' WHERE nameCar='${value[0][0]}' AND idOs='${value[0][1]}'`;
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
    //  console.log(req.body.activePost)
    const tableModelView = 'bar' + req.body.activePost
    // console.log('работаем')
    const count = req.body.id
    // console.log(count)
    if (req.body.id) {
        try {
            const selectBase = `SELECT * FROM ifBar WHERE  nameCar='${req.body.activePost}' AND idOs='${count}'`
            connection.query(selectBase, function (err, results) {
                if (err) console.log(err)
                //  console.log(results)
                response.status(200, results, '', res)
            })
        }
        catch (e) {
            console.log(e)
        }

    }
    else {
        try {
            const selectBase = `SELECT * FROM ifBar WHERE  nameCar='${req.body.activePost}'`
            connection.query(selectBase, function (err, results) {
                if (err) console.log(err)
                //  console.log(results)
                response.status(200, results, '', res)
            })
        }
        catch (e) {
            console.log(e)
        }
    }

}


module.exports.barViewAll = (req, res) => {
    const nameCar = req.body.car.replace(/\s+/g, '')
    try {
        const selectBase = `SELECT * FROM ifBar WHERE nameCar='${nameCar}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            //  console.log(results)
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
                //   console.log('ноль')
                objects.forEach(el => {
                    const postModel = `INSERT INTO userObjects(login, role, object) VALUES('${login}','${role}','${el}')`
                    connection.query(postModel, function (err, results) {
                        if (err) console.log(err);
                    })
                })
            }
            else {
                //   console.log('не ноль')
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
        const selectBase = `SELECT icons FROM icon WHERE nameCar='${req.body.activePost}' AND icons='${req.body.id}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            if (results.length === 0) {
                const postModel = `INSERT INTO icon(nameCar, params, coef, icons) VALUES('${req.body.activePost}','${req.body.param}','${req.body.coef}','${req.body.id}')`
                connection.query(postModel, function (err, results) {
                    if (err) console.log(err + 'ошибка26')
                    // console.log(results)
                    response.status(200, results, '', res)
                })
            }
            else {
                const sql = `UPDATE icon SET nameCar='${req.body.activePost}', params='${req.body.param}', coef='${req.body.coef}', icons='${req.body.id}'WHERE nameCar='${req.body.activePost}' AND icons='${req.body.id}'`;
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
        const selectBase = `SELECT id FROM allStatic  WHERE nameCar='${req.body.activePost}' AND idv='${req.body.id}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            if (results.length === 0) {
                const postModel = `INSERT INTO allStatic(nameCar, params, coef, nameInput, idv) VALUES('${req.body.activePost}','${req.body.param}','${req.body.coef}','${req.body.nameInput}','${req.body.id}')`
                connection.query(postModel, function (err, results) {
                    if (err) console.log(err)
                    //   console.log(results)
                    response.status(200, results, '', res)
                })
            }
            else {
                const sql = `UPDATE allStatic SET nameCar='${req.body.activePost}', params='${req.body.param}', coef='${req.body.coef}', nameInput='${req.body.nameInput}', idv='${req.body.id}' WHERE nameCar='${req.body.activePost}' AND idv='${req.body.id}'`;
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
    //  console.log(req.body.activePost)
    try {
        const postModel = `SELECT params, coef, icons FROM icon WHERE nameCar='${req.body.activePost}'`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err)
            //   console.log(results)
            res.json({ status: 200, result: results, name: req.body.activePost })
        })
    }
    catch (e) {
        console.log(e)
    }
}

module.exports.to = (req, res) => {
    // console.log(req.body.activePost)
    // console.log(req.body.valueTO)
    try {
        const selectBase = `SELECT id FROM toChange  WHERE nameCar='${req.body.activePost}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            //   console.log(results)
            if (results.length === 0) {
                //  console.log('0да')
                const postModel = `INSERT INTO toChange(nameCar, value) VALUES('${req.body.activePost}', '${req.body.valueTO}')`
                connection.query(postModel, function (err, results) {
                    if (err) console.log(err)
                    //   console.log(results)
                    else res.json({ message: 'запись есть' })
                })
            }
            else {
                //   console.log('обновляем')
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
    // console.log(req.body.activePost)
    try {
        const postModel = `SELECT params, coef, nameInput, idv FROM allStatic WHERE nameCar='${req.body.activePost}'`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err)
            //  console.log(results)
            res.json({ status: 200, result: results, name: req.body.activePost })
        })
    }
    catch (e) {
        console.log(e)
    }
}


module.exports.toView = (req, res) => {
    // console.log(req.body.activePost)
    try {
        const postModel = `SELECT nameCar, value FROM toChange WHERE nameCar='${req.body.activePost}'`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err)
            //  console.log(results)
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
    tyres.forEach(el => {
        el.unshift(nameCar)
        // console.log(el)
        try {
            const selectBase = `SELECT tyresdiv FROM tyres WHERE nameCar='${el[0]}' AND tyresdiv='${el[1]}'`
            connection.query(selectBase, function (err, results) {
                if (err) {
                    console.log(err)
                };

                if (results.length === 0) {
                    //      console.log(el + '   ' + '2')
                    const selectBase = `INSERT INTO tyres(nameCar, tyresdiv, pressure,temp, osNumber) VALUES?`
                    connection.query(selectBase, [[el]], function (err, results) {
                        if (err) {
                            console.log(err)

                        };
                    })
                }
                if (results.length > 0) {
                    //  console.log(el + '   ' + '3')
                    const postModel = `UPDATE tyres SET nameCar='${el[0]}', tyresdiv='${el[1]}', pressure='${el[2]}', temp='${el[3]}', osNumber='${el[4]}' WHERE nameCar='${el[0]}' AND tyresdiv='${el[1]}'`
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
    // console.log(arr)

    try {
        const selectBase = `SELECT identificator FROM tyresBase WHERE  identificator='${id}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err + 'ошибка33')
            //  console.log(results)
            if (results.length > 0) {
                //   console.log(results)
                res.json({ boolean: false, message: 'Такой ID есть' })
            }
            else {
                // console.log(id)
                const sql = `INSERT INTO  tyresBase (dataAdd, identificator, nameCar, typeOs, numberOs, idTyres, marka, model, psi,changeBar,
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
    const nameCar = req.body.activePost
    try {
        const selectBase = `SELECT * FROM tyresBase WHERE nameCar='${nameCar}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            //  console.log(results)
            res.json({ status: 200, result: results })
        })
    }
    catch (e) {
        console.log(e)
    }

}



module.exports.rotate = (req, res) => {
    const data1 = req.body.allArray1
    const data2 = req.body.allArray2
    const nameCar = req.body.activePost
    const id1 = req.body.relArr[0]
    const id2 = req.body.relArr[1]
    //  console.log(id1, id2)
    try {
        const selectBase = `SELECT * FROM tyresBase WHERE identificator IN('${id1}', '${id2}')`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            //    console.log(results)
            res.json({ status: 200, result: results })
        })
    }
    catch (e) {
        console.log(e)
    }

}
// const selectBase = `SELECT * FROM tyresBase WHERE nameCar='${nameCar}' AND idTyres IN (${data1[0]},${data2[0]}) AND numberOs IN (${data1[1]},${data2[1]}) AND typeOs IN ('${data1[2]}','${data2[2]}')`




module.exports.findId = (req, res) => {
    try {
        const selectBase = `SELECT identificator FROM tyresBase WHERE 1`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            //  console.log(results)
            res.json({ status: 200, result: results })
        })
    }
    catch (e) {
        console.log(e)
    }
}

module.exports.techView = (req, res) => {
    //  console.log(req.body.activePost)
    const nameCar = req.body.activePost
    // console.log('работаем')
    const count = req.body.id
    // console.log(count)
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
        maxMM FROM tyresBase WHERE nameCar='${nameCar}' AND idTyres='${count}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            //  console.log(results)
            response.status(200, results, '', res)
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.techViewAll = (req, res) => {
    //  console.log(req.body.activePost)
    const tableModelView = 'tech' + req.body.activePost
    //console.log('работаем')

    try {
        const selectBase = `SELECT * FROM tyresBase WHERE nameCar='${req.body.activePost}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            //  console.log(results)
            response.status(200, results, '', res)
        })
    }
    catch (e) {
        console.log(e)
    }
}





module.exports.modelView = (req, res) => {
    //console.log(req.body.activePost)
    const nameCar = req.body.activePost
    try {
        const selectBase = `SELECT nameCar, osi, trailer,tyres,gosp FROM model WHERE nameCar='${nameCar}'`
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
    // console.log(req.body.activePost)
    const nameCar = req.body.activePost
    try {
        const selectBase = `SELECT tyresdiv, pressure,temp, osNumber FROM tyres WHERE nameCar='${nameCar}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            if (results === undefined) {
                response.status(200, results, req.body.activePost, res)
            }
            else {
                response.status(200, results, req.body.activePost, res)
            }
            //console.log(results)

        })
    }
    catch (e) {
        console.log(e)
    }
}






module.exports.listModel = (req, res) => {
    const nameCar = req.body.car.replace(/\s+/g, '')
    try {
        const selectBase = `SELECT osi, trailer,tyres FROM model WHERE nameCar='${nameCar}'`
        connection.query(selectBase, function (err, results) {
            console.log(err)
            res.json({ status: 200, result: results, message: req.body.car })
            //  response.status(200, results, req.body.car, res)
        })
    }
    catch (e) {
        console.log(e)
    }
}


module.exports.listTyres = (req, res) => {
    //console.log(req.body)
    const nameCar = req.body.car.replace(/\s+/g, '')
    try {
        const selectBase = `SELECT tyresdiv, pressure, temp, osNumber FROM tyres WHERE nameCar='${nameCar}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err)
            if (results === undefined) {
                res.json({ status: 200, result: results, message: req.body.car })
            }
            else {
                //   console.log(results)
                res.json({ status: 200, result: results, message: req.body.car })

            }

        })
    }
    catch (e) {
        console.log(e)
    }
}

module.exports.alarmFind = (req, res) => {
    const nameCar = req.body.activePost
    const tyresp = req.body.tyresP
    try {
        const sqls1 = `SELECT data, senspressure, bar, temp, alarm  FROM alarms WHERE name='${nameCar}' AND senspressure='${tyresp}'`
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
    // console.log(req.body)
    try {
        speed(req.body.t1, req.body.t2, req.body.int, req.body.id, res)
    }
    catch (e) {
        console.log(e)
    }
}
