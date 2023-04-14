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
    console.log(req.body.name)
    const tableModel = 'model' + req.body.name
    try {
        const postModel = `DELETE FROM ${tableModel}`
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
    const tableTyres = 'tyres' + req.body.name
    try {
        const postModel = `DELETE FROM ${tableTyres}`
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


module.exports.updateModel = (req, res) => {
    console.log('обновляем')
    //  console.log(req.body.massModel)
    const massiv = req.body.massModel
    console.log(req.body.gosp)
    const tableModel = 'model' + req.body.activePost
    massiv.forEach(el => {
        el.push(req.body.gosp)
        try {
            const selectBase = `SELECT osi FROM ${tableModel} WHERE osi=${el[0]}`
            connection.query(selectBase, function (err, results) {
                if (err) {
                    console.log(err)
                };

                if (results.length === 0) {
                    console.log(el)
                    const selectBase = `INSERT INTO ${tableModel}(osi, trailer, tyres, gosp) VALUES?`
                    connection.query(selectBase, [[el]], function (err, results) {
                        if (err) {
                            console.log(err)

                        };
                    })
                }
                if (results.length > 0) {
                    const postModel = `UPDATE ${tableModel} SET osi='${el[0]}', trailer='${el[1]}', tyres='${el[2]}',gosp='${req.body.gosp}' WHERE osi='${el[0]}'`
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
    console.log(value)
    // console.log(req.body.arrValue)
    // value.push()
    const tableModel = 'bar' + req.body.activePost
    //  console.log(tableModel)

    try {
        const selectBase = `SELECT nameCar, idOs FROM ifBar WHERE nameCar='${value[0][0]}' AND idOs='${value[0][1]}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            console.log(results)
            if (results.length === 0) {
                console.log('запусккк')
                const sql = `INSERT INTO  ifBar(nameCar, idOs, knd, kvd, dnn, dvn, dnmin, dnmax) VALUES?`;
                connection.query(sql, [value], function (err, results) {
                    if (err) console.log(err);
                    else res.json("Данные добавлены");
                });
            }
            if (results.length > 0) {
                console.log('БОЛЬШЕ 0')
                const sql = `UPDATE ifBar SET nameCar='${value[0][0]}', idOs='${value[0][1]}', knd='${value[0][2]}', 
                    kvd='${value[0][3]}',dnn='${value[0][4]}', dvn='${value[0][5]}', dnmin='${value[0][6]}', dnmax='${value[0][7]}' WHERE nameCar='${value[0][0]}' AND idOs='${value[0][1]}'`;
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


module.exports.checkObject = (req, res) => {
    const login = req.body.login
    const role = req.body.role
    const objects = req.body.objects
    try {
        const selectBase = `SELECT id FROM userObjects WHERE 1`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            if (results.length === 0) {
                console.log('ноль')
                objects.forEach(el => {
                    const postModel = `INSERT INTO userObjects(login, role, object) VALUES('${login}','${role}','${el}')`
                    connection.query(postModel, function (err, results) {
                        if (err) console.log(err);
                    })
                })
            }
            else {
                console.log('не ноль')
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
                    if (err) console.log(err + 'ошибка49')
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
            if (err) console.log(err + 'ошибка48')
            if (results.length === 0) {
                const postModel = `INSERT INTO allStatic(nameCar, params, coef, nameInput, idv) VALUES('${req.body.activePost}','${req.body.param}','${req.body.coef}','${req.body.nameInput}','${req.body.id}')`
                connection.query(postModel, function (err, results) {
                    if (err) console.log(err + 'ошибка47')
                    //   console.log(results)
                    response.status(200, results, '', res)
                })
            }
            else {
                const sql = `UPDATE allStatic SET nameCar='${req.body.activePost}', params='${req.body.param}', coef='${req.body.coef}', nameInput='${req.body.nameInput}', idv='${req.body.id}' WHERE nameCar='${req.body.activePost}' AND idv='${req.body.id}'`;
                connection.query(sql, function (err, results) {
                    if (err) console.log(err + 'ошибка46')
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
            if (err) console.log(err + 'ошибка45')
            //   console.log(results)
            res.json({ status: 200, result: results, name: req.body.activePost })
        })
    }
    catch (e) {
        console.log(e)
    }
}

module.exports.to = (req, res) => {
    console.log(req.body.activePost)
    console.log(req.body.valueTO)
    try {
        const selectBase = `SELECT id FROM toChange  WHERE nameCar='${req.body.activePost}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err + 'ошибка44')
            console.log(results)
            if (results.length === 0) {
                console.log('0да')
                const postModel = `INSERT INTO toChange(nameCar, value) VALUES('${req.body.activePost}', '${req.body.valueTO}')`
                connection.query(postModel, function (err, results) {
                    if (err) console.log(err + 'ошибка43')
                    //   console.log(results)
                    else res.json({ message: 'запись есть' })
                })
            }
            else {
                console.log('обновляем')
                const sql = `UPDATE toChange SET nameCar='${req.body.activePost}',  value='${req.body.valueTO}' WHERE nameCar='${req.body.activePost}'`;
                connection.query(sql, function (err, results) {
                    if (err) console.log(err + 'ошибка42')
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
            if (err) console.log(err + 'ошибка41')
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
            if (err) console.log(err + 'ошибка40')
            //  console.log(results)
            res.json({ status: 200, result: results, name: req.body.activePost })
        })
    }
    catch (e) {
        console.log(e)
    }
}

module.exports.model = (req, res) => {
    console.log(req.body.model)
    const tableModel = 'model' + req.body.activePost
    // console.log(tableModel)
    try {
        const sql = `create table if not exists ${tableModel}(
            id int(255) primary key auto_increment,
            osi int(255) not null,
            trailer varchar(255) not null,
            tyres int(255) not nullб
            gosp varchar(255) not null
          )`;
        connection.query(sql, function (err, results) {
            if (err) console.log(err);
            else console.log("Таблица модели создана");
        })
        const postModel = `INSERT INTO ${tableModel}(osi, trailer, tyres, gosp) VALUES?`
        connection.query(postModel, [req.body.model], function (err, results) {
            if (err) console.log(err + 'ошибка39')
            //console.log(results)
            response.status(200, results, '', res)
        })
    }
    catch (e) {
        console.log(e)
    }
}


module.exports.tyres = (req, res) => {
    const tableTyres = 'tyres' + req.body.activePost
    console.log(req.body.tyres)
    try {
        const sql = `create table if not exists ${tableTyres}(
            id int(255) primary key auto_increment,
            tyresdiv varchar(255) not null,
            pressure varchar(255) not null,
            temp varchar(255)  not null
        
          )`;
        connection.query(sql, function (err, results) {
            if (err) console.log(err + 'ошибка38')
            else console.log("Таблица значений колес создана");
        })
        const selectBase = `SELECT tyresdiv FROM ${tableTyres} WHERE 1`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err + 'ошибка37')
            if (results.length === 0) {
                const postModel = `INSERT INTO ${tableTyres}(tyresdiv, pressure, temp) VALUES?`
                connection.query(postModel, [req.body.tyres], function (err, results) {
                    if (err) console.log(err + 'ошибка36')
                    //console.log(results)
                    response.status(200, results, '', res)
                })
            }
            if (results.length > 0) {
                // console.log('ЭТА СТОРОНА')
                // console.log(req.body.tyres[0][0])
                let count = req.body.tyres[0][0];
                //  console.log(req.body.tyres[0][0])
                //  console.log(results[0].tyresdiv)
                const mas = []
                results.forEach(el => {
                    mas.push(el.tyresdiv)
                });
                // console.log(mas)
                if (!mas.includes(req.body.tyres[0][0])) {
                    //   console.log('запусккк2')
                    const sql = `INSERT INTO  ${tableTyres}(tyresdiv, pressure, temp) VALUES?`;
                    connection.query(sql, [req.body.tyres], function (err, results) {
                        if (err) console.log(err + 'ошибка35')
                    });
                }
                if (mas.includes(req.body.tyres[0][0])) {
                    //   console.log('запусккк3')
                    const sql = `UPDATE ${tableTyres} SET tyresdiv='${req.body.tyres[0][0]}', pressure='${req.body.tyres[0][1]}', 
                    temp='${req.body.tyres[0][2]}'WHERE tyresdiv=${count}`;
                    connection.query(sql, [req.body.tyres], function (err, results) {
                        if (err) console.log(err + 'ошибка34')
                    });
                }
            }
        })
    }
    catch (e) {
        console.log(e)
    }
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
                    if (err) console.log(err + 'ошибка32')
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
            if (err) console.log(err + 'ошибка31')
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
            if (err) console.log(err + 'ошибка30')
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
            if (err) console.log(err + 'ошибка29')
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
            if (err) console.log(err + 'ошибка28')
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
            if (err) console.log(err + 'ошибка27')
            //  console.log(results)
            response.status(200, results, '', res)
        })
    }
    catch (e) {
        console.log(e)
    }
}





module.exports.modelView = (req, res) => {
    //  console.log(req.body.activePost)
    const tableModelView = 'model' + req.body.activePost
    try {
        const selectBase = `SELECT osi, trailer,tyres,gosp FROM ${tableModelView} WHERE 1`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err + 'ошибка25')
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
    const tableTyresView = 'tyres' + req.body.activePost
    try {
        const selectBase = `SELECT tyresdiv, pressure,temp FROM ${tableTyresView} WHERE 1`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err + 'ошибка20')
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
    const nameCar = 'model' + req.body.car.replace(/\s+/g, '')
    try {
        const selectBase = `SELECT osi, trailer,tyres FROM ${nameCar} WHERE 1`
        connection.query(selectBase, function (err, results) {
            console.log(err + 'ошибка21')
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
    const nameCar = 'tyres' + req.body.car.replace(/\s+/g, '')
    try {
        const selectBase = `SELECT tyresdiv, pressure, temp FROM ${nameCar} WHERE 1`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err + 'ошибка22')
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
            if (err) console.log(err + 'ошибка23')
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
    console.log(req.body)
    try {
        speed(req.body.t1, req.body.t2, req.body.int, req.body.id, res)
    }
    catch (e) {
        console.log(e)
    }
}
