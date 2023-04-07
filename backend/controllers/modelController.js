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
    console.log(req.body.activePost)
    const os = req.body.os;
    const numberOs = req.body.centerOsActiv;
    const tableTyres = 'model' + req.body.activePost
    try {
        const postModel = `UPDATE ${tableTyres} SET trailer='${os}' WHERE osi=${numberOs}`
        connection.query(postModel, function (err, results) {
            if (err) {
                console.log(err)
                res.json({ message: 'успех' })
            };
            //console.log(results)
            res.json({ message: 'успех', result: numberOs })
        })
    }
    catch (e) {
        console.log(e)
    }

}


module.exports.savePr = async (req, res) => {
    // const value = [req.body.arr]
    // console.log(req.body.arr.dataAdd)
    const value = [Object.values(req.body.arr)]
    console.log(value)
    if (req.body.arr.dataAdd) {
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
    else {
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



}



module.exports.tech = async (req, res) => {
    //   console.log(req.body.activePost)
    //  console.log(req.body.arr[1])
    console.log(req.body.arr)
    console.log(req.body.arrValue)
    const value = [req.body.arrValue];
    console.log(value)
    // value.push()
    const tableModel = 'tech' + req.body.activePost
    console.log(tableModel)
    try {
        const sql = `create table if not exists ${tableModel}(
            id int(255) primary key auto_increment,
            idTyres int(255) not null,
            ${req.body.arr[0]} varchar(255),
            ${req.body.arr[1]} varchar(255),
            ${req.body.arr[2]} int(255),
            ${req.body.arr[3]} varchar(255),
            ${req.body.arr[4]} int(255),
            ${req.body.arr[5]} varchar(255),
            ${req.body.arr[6]} int(255),
            ${req.body.arr[7]} varchar(255),
            ${req.body.arr[8]} varchar(255),
            ${req.body.arr[9]} varchar(255),
            ${req.body.arr[10]} varchar(255),
            ${req.body.arr[11]}  varchar(255),
            ${req.body.arr[12]}  varchar(255)
            )`
        connection.query(sql, function (err, results) {
            if (err) console.log(err);
            else console.log("Таблица tech создана");
        })
        const selectBase = `SELECT idTyres FROM ${tableModel} WHERE 1`
        connection.query(selectBase, function (err, results) {

            if (err) console.log(err);
            if (results.length === 0) {
                console.log('запусккк')
                const sql = `INSERT INTO  ${tableModel}( idTyres, ${req.body.arr[0]},${req.body.arr[1]},${req.body.arr[2]},${req.body.arr[3]},
                        ${req.body.arr[4]},${req.body.arr[5]},${req.body.arr[6]},${req.body.arr[7]},${req.body.arr[8]},${req.body.arr[9]},${req.body.arr[10]},${req.body.arr[11]},${req.body.arr[12]}) VALUES?`;
                connection.query(sql, [value], function (err, results) {
                    if (err) console.log(err);
                });
            }
            if (results.length > 0) {
                let count = value[0][0];
                const mas = []
                results.forEach(el => {
                    mas.push(el.idTyres)
                });
                if (!mas.includes(parseInt(value[0][0]))) {
                    console.log('запусккк2')
                    const sql = `INSERT INTO  ${tableModel}( idTyres, ${req.body.arr[0]},${req.body.arr[1]},${req.body.arr[2]},${req.body.arr[3]},
                                ${req.body.arr[4]},${req.body.arr[5]},${req.body.arr[6]},${req.body.arr[7]},${req.body.arr[8]}, ${req.body.arr[9]},
                                ${req.body.arr[10]},${req.body.arr[11]},${req.body.arr[12]}) VALUES?`;
                    connection.query(sql, [value], function (err, results) {
                        if (err) console.log(err);
                    });
                }
                if (mas.includes(parseInt(value[0][0]))) {
                    console.log('запусккк3')
                    console.log(req.body.arr[12])
                    console.log(value)
                    const sql = `UPDATE ${tableModel} SET idTyres='${value[0][0]}', ${req.body.arr[0]}='${value[0][1]}', 
                    ${req.body.arr[1]}='${value[0][2]}',${req.body.arr[2]}='${value[0][3]}',
                        ${req.body.arr[3]}='${value[0][4]}',${req.body.arr[4]}='${value[0][5]}',${req.body.arr[5]}='${value[0][6]}',${req.body.arr[6]}='${value[0][7]}',
                        ${req.body.arr[7]}='${value[0][8]}', ${req.body.arr[8]}='${value[0][9]}', ${req.body.arr[9]}='${value[0][10]}',
                        ${req.body.arr[10]}='${value[0][11]}', ${req.body.arr[11]}='${value[0][12]}', ${req.body.arr[12]}='${value[0][13]}'WHERE idTyres=${count}`;
                    connection.query(sql, [value], function (err, results) {
                        if (err) console.log(err);
                        res.json(results + 'готово')
                    });
                }
            }
        });
    }
    catch (e) {
        console.log(e)
    }
}


module.exports.modalBar = (req, res) => {
    //   console.log(req.body.activePost)
    //  console.log(req.body.arr[1])
    console.log(req.body.arrValue)
    const value = [req.body.arrValue];
    console.log(value)
    // value.push()
    const tableModel = 'bar' + req.body.activePost
    console.log(tableModel)
    try {
        const sql = `create table if not exists ${tableModel}(
            id int(255) primary key auto_increment,
            idOs int(255) not null,
            ${req.body.arr[0]} varchar(255),
            ${req.body.arr[1]} varchar(255),
            ${req.body.arr[2]} varchar(255),
            ${req.body.arr[3]} varchar(255),
            ${req.body.arr[4]} varchar(255),
            ${req.body.arr[5]} varchar(255)             
            )`
        connection.query(sql, function (err, results) {
            if (err) console.log(err);
            else console.log("Таблица bar создана");
        })
        const selectBase = `SELECT idOs FROM ${tableModel} WHERE 1`
        connection.query(selectBase, function (err, results) {

            if (err) console.log(err);
            if (results.length === 0) {
                console.log('запусккк')
                const sql = `INSERT INTO  ${tableModel}( idOs, ${req.body.arr[0]},${req.body.arr[1]},${req.body.arr[2]},${req.body.arr[3]},
                        ${req.body.arr[4]},${req.body.arr[5]}) VALUES?`;
                connection.query(sql, [value], function (err, results) {
                    if (err) console.log(err);
                    else res.json("Данные добавлены");
                });
            }
            if (results.length > 0) {
                let count = value[0][0];
                const mas = []
                results.forEach(el => {
                    mas.push(el.idOs)
                });
                if (!mas.includes(parseInt(value[0][0]))) {
                    console.log('запусккк2')
                    const sql = `INSERT INTO  ${tableModel}( idOs, ${req.body.arr[0]},${req.body.arr[1]},${req.body.arr[2]},${req.body.arr[3]},
                                ${req.body.arr[4]},${req.body.arr[5]}) VALUES?`;
                    connection.query(sql, [value], function (err, results) {
                        if (err) console.log(err);
                        else res.json("Новые данные добавлены");
                    });
                }
                if (mas.includes(parseInt(value[0][0]))) {
                    console.log('запусккк3')
                    console.log(req.body.arr[11])
                    console.log(value[0][12])
                    const sql = `UPDATE ${tableModel} SET idOs='${value[0][0]}', ${req.body.arr[0]}='${value[0][1]}', 
                    ${req.body.arr[1]}='${value[0][2]}',${req.body.arr[2]}='${value[0][3]}',
                        ${req.body.arr[3]}='${value[0][4]}',${req.body.arr[4]}='${value[0][5]}',${req.body.arr[5]}='${value[0][6]}' WHERE idOs=${count}`;
                    connection.query(sql, [value], function (err, results) {
                        if (err) console.log(err);
                        else res.json("Данные обновлены");
                    });
                }
            }
        });
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
                    if (err) console.log(err);
                    console.log(results)
                    response.status(200, results, '', res)
                })
            }
            else {
                const sql = `UPDATE icon SET nameCar='${req.body.activePost}', params='${req.body.param}', coef='${req.body.coef}', icons='${req.body.id}'WHERE nameCar='${req.body.activePost}' AND icons='${req.body.id}'`;
                connection.query(sql, function (err, results) {
                    if (err) console.log(err);
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
            if (err) console.log(err);
            if (results.length === 0) {
                const postModel = `INSERT INTO allStatic(nameCar, params, coef, nameInput, idv) VALUES('${req.body.activePost}','${req.body.param}','${req.body.coef}','${req.body.nameInput}','${req.body.id}')`
                connection.query(postModel, function (err, results) {
                    if (err) console.log(err);
                    console.log(results)
                    response.status(200, results, '', res)
                })
            }
            else {
                const sql = `UPDATE allStatic SET nameCar='${req.body.activePost}', params='${req.body.param}', coef='${req.body.coef}', nameInput='${req.body.nameInput}', idv='${req.body.id}' WHERE nameCar='${req.body.activePost}' AND idv='${req.body.id}'`;
                connection.query(sql, function (err, results) {
                    if (err) console.log(err);
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
    console.log(req.body.activePost)
    try {
        const postModel = `SELECT params, coef, icons FROM icon WHERE nameCar='${req.body.activePost}'`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err);
            console.log(results)
            res.json({ status: 200, result: results, name: req.body.activePost })
        })
    }
    catch (e) {
        console.log(e)
    }
}

module.exports.iconFindWindows = (req, res) => {
    console.log(req.body.activePost)
    try {
        const postModel = `SELECT params, coef, nameInput, idv FROM allStatic WHERE nameCar='${req.body.activePost}'`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err);
            console.log(results)
            res.json({ status: 200, result: results, name: req.body.activePost })
        })
    }
    catch (e) {
        console.log(e)
    }
}

module.exports.model = (req, res) => {
    //  console.log(req.body.activePost)
    const tableModel = 'model' + req.body.activePost
    // console.log(tableModel)
    try {
        const sql = `create table if not exists ${tableModel}(
            id int(255) primary key auto_increment,
            osi int(255) not null,
            trailer varchar(255) not null,
            tyres int(255) not null
          )`;
        connection.query(sql, function (err, results) {
            if (err) console.log(err);
            else console.log("Таблица модели создана");
        })
        const postModel = `INSERT INTO ${tableModel}(osi, trailer, tyres) VALUES?`
        connection.query(postModel, [req.body.model], function (err, results) {
            if (err) console.log(err);
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
            if (err) console.log(err);
            else console.log("Таблица значений колес создана");
        })
        const selectBase = `SELECT tyresdiv FROM ${tableTyres} WHERE 1`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            if (results.length === 0) {
                const postModel = `INSERT INTO ${tableTyres}(tyresdiv, pressure, temp) VALUES?`
                connection.query(postModel, [req.body.tyres], function (err, results) {
                    if (err) console.log(err);
                    //console.log(results)
                    response.status(200, results, '', res)
                })
            }
            if (results.length > 0) {
                console.log('ЭТА СТОРОНА')
                console.log(req.body.tyres[0][0])
                let count = req.body.tyres[0][0];
                console.log(req.body.tyres[0][0])
                console.log(results[0].tyresdiv)
                const mas = []
                results.forEach(el => {
                    mas.push(el.tyresdiv)
                });
                console.log(mas)
                if (!mas.includes(req.body.tyres[0][0])) {
                    console.log('запусккк2')
                    const sql = `INSERT INTO  ${tableTyres}(tyresdiv, pressure, temp) VALUES?`;
                    connection.query(sql, [req.body.tyres], function (err, results) {
                        if (err) console.log(err);
                    });
                }
                if (mas.includes(req.body.tyres[0][0])) {
                    console.log('запусккк3')
                    const sql = `UPDATE ${tableTyres} SET tyresdiv='${req.body.tyres[0][0]}', pressure='${req.body.tyres[0][1]}', 
                    temp='${req.body.tyres[0][2]}'WHERE tyresdiv=${count}`;
                    connection.query(sql, [req.body.tyres], function (err, results) {
                        if (err) console.log(err);
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
    console.log(arr)

    try {
        const selectBase = `SELECT identificator FROM tyresBase WHERE  identificator='${id}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            console.log(results)
            if (results.length > 0) {
                console.log(results)
                res.json({ boolean: false, message: 'Такой ID есть' })
            }
            else {
                console.log(id)
                const sql = `INSERT INTO  tyresBase (dataAdd, identificator, nameCar, typeOs, numberOs, idTyres, marka, model, psi,changeBar,
                    probegNow, dateInstall, probegPass, dateZamer, N1, N2, N3, N4, maxMM) VALUES?`;
                connection.query(sql, [arr], function (err, results) {
                    if (err) console.log(err);
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
            if (err) console.log(err);
            console.log(results)
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
    console.log(id1, id2)
    try {
        const selectBase = `SELECT * FROM tyresBase WHERE identificator IN('${id1}', '${id2}')`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            console.log(results)
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
            if (err) console.log(err);
            console.log(results)
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
    console.log('работаем')
    const count = req.body.id
    console.log(count)
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
            if (err) console.log(err);
            console.log(results)
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
    console.log('работаем')

    try {
        const selectBase = `SELECT idTyres, marka, modelT, psi, changeBar, probegNow, montaj, probegPass, N1, N2,N3, N4, protectorDate, maxMM FROM ${tableModelView} WHERE 1`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            console.log(results)
            response.status(200, results, '', res)
        })
    }
    catch (e) {
        console.log(e)
    }
}

module.exports.barView = (req, res) => {
    //  console.log(req.body.activePost)
    const tableModelView = 'bar' + req.body.activePost
    console.log('работаем')
    const count = req.body.id
    console.log(count)
    try {
        const selectBase = `SELECT idOs, knd, kvd, dnn, dvn, dnmin, dnmax FROM ${tableModelView} WHERE  idOs=${count}`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            console.log(results)
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
        const selectBase = `SELECT osi, trailer,tyres FROM ${tableModelView} WHERE 1`
        connection.query(selectBase, function (err, results) {
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
            //     if (err) console.log(err);
            if (results === undefined) {
                res.json({ status: 200, result: results, message: req.body.car })
            }
            else {
                console.log(results)
                res.json({ status: 200, result: results, message: req.body.car })

            }

        })
    }
    catch (e) {
        console.log(e)
    }
}
/*
module.exports.alarmStorage = (req, res) => {
    console.log('запись аларм фронт')
    const name = req.body.name
    const value = [req.body.dannie];
    const tableModel = 'alarm' + name
    try {
        const sql = `create table if not exists ${tableModel}(
            id int(255) primary key auto_increment,
            name varchar(255) not null,
            data varchar(255),
            time varchar(255),
            senspressure varchar(255),
            bar varchar(255),
                    temp varchar(255),
            alarm varchar(255) not null        
            )`
        connection.query(sql, function (err, results) {
            if (err) console.log('ошибка');
            else console.log("Таблица alarm создана");
        })
        const sqls = `INSERT INTO  ${tableModel} (name, data, time, senspressure, bar,
                            temp, alarm) VALUES?`;
        connection.query(sqls, [value], function (err, results) {
            if (err) console.log(err);
            else res.json("Данные добавлены");
        });
    }
    catch (e) {
        console.log(e)
    }
}*/






module.exports.alarmFind = (req, res) => {
    //   console.log('работаем?')
    const tableModel = req.body.activeName
    // const tableModel = 'alarm' + name
    const sqls1 = `SELECT data, senspressure, bar, temp, alarm  FROM ${tableModel} WHERE 1`
    connection.query(sqls1, function (err, results) {
        if (err) //console.log(err);
            // console.log(results)
            if (results == undefined) {
                res.json([])
            }
        res.json(results)



    })
}


module.exports.speedData = async (req, res) => {
    console.log(req.body)
    try {
        speed(req.body.t1, req.body.t2, req.body.int, req.body.id, res)
        //   console.log('скорость')
        //  console.log(arrSpeed, arrIterTimeDateT)
        //  res.json({ arrSpeed, arrIterTimeDateT })
    }
    catch (e) {
        //  console.log(e)
    }
}
