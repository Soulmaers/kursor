const response = require('../../response')
//const wialon = require('wialon');
//const getMainInfo = require('../settings/config')
const connection = require('../settings/db')


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

module.exports.tech = (req, res) => {
    //   console.log(req.body.activePost)
    //  console.log(req.body.arr[1])
    //  console.log(req.body.arrValue)
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
            ${req.body.arr[11]}  varchar(255)
                             
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
                        ${req.body.arr[4]},${req.body.arr[5]},${req.body.arr[6]},${req.body.arr[7]},${req.body.arr[8]},${req.body.arr[9]},${req.body.arr[10]},${req.body.arr[11]}) VALUES?`;
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
                                ${req.body.arr[4]},${req.body.arr[5]},${req.body.arr[6]},${req.body.arr[7]},${req.body.arr[8]}, ${req.body.arr[9]},${req.body.arr[10]},${req.body.arr[11]}) VALUES?`;
                    connection.query(sql, [value], function (err, results) {
                        if (err) console.log(err);
                    });
                }
                if (mas.includes(parseInt(value[0][0]))) {
                    console.log('запусккк3')
                    console.log(req.body.arr[11])
                    console.log(value[0][12])
                    const sql = `UPDATE ${tableModel} SET idTyres='${value[0][0]}', ${req.body.arr[0]}='${value[0][1]}', 
                    ${req.body.arr[1]}='${value[0][2]}',${req.body.arr[2]}='${value[0][3]}',
                        ${req.body.arr[3]}='${value[0][4]}',${req.body.arr[4]}='${value[0][5]}',${req.body.arr[5]}='${value[0][6]}',${req.body.arr[6]}='${value[0][7]}',
                        ${req.body.arr[7]}='${value[0][8]}', ${req.body.arr[8]}='${value[0][9]}', ${req.body.arr[9]}='${value[0][10]}',
                        ${req.body.arr[10]}='${value[0][11]}', ${req.body.arr[11]}='${value[0][12]}'WHERE idTyres=${count}`;
                    connection.query(sql, [value], function (err, results) {
                        if (err) console.log(err);
                    });
                }
            }
        });
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
    //  console.log(req.body.activePost)
    const tableTyres = 'tyres' + req.body.activePost
    // console.log(tableModel)
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



        const postModel = `INSERT INTO ${tableTyres}(tyresdiv, pressure, temp) VALUES?`
        connection.query(postModel, [req.body.tyres], function (err, results) {
            if (err) console.log(err);
            //console.log(results)
            response.status(200, results, '', res)
        })
    }
    catch (e) {
        console.log(e)
    }
}

module.exports.techView = (req, res) => {
    //  console.log(req.body.activePost)
    const tableModelView = 'tech' + req.body.activePost
    console.log('работаем')
    const count = req.body.id
    console.log(count)
    try {
        const selectBase = `SELECT idTyres, marka, modelT, psi, changeBar, probegNow, montaj, probegPass, N1, N2,N3, N4, protectorDate FROM ${tableModelView} WHERE  idTyres=${count}`
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
            if (err) console.log(err);
            //console.log(results)
            response.status(200, results, '', res)
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
            if (err) console.log(err);
            //console.log(results)
            response.status(200, results, req.body.activePost, res)
        })
    }
    catch (e) {
        console.log(e)
    }
}

module.exports.tyresViewtest = (req, res) => {
    // console.log(req.body.activePost)
    // const tableTyresView = 'tyres' + req.body.massiv
    try {
        const selectBase = `SELECT tyresdiv, pressure, temp
        FROM   (
                SELECT tyresdiv, pressure, temp FROM ${'tyres' + req.body.massiv[0]}
                UNION ALL SELECT tyresdiv, pressure, temp FROM ${'tyres' + req.body.massiv[1]}
                UNION ALL SELECT tyresdiv, pressure, temp FROM ${'tyres' + req.body.massiv[2]}
                UNION ALL SELECT tyresdiv, pressure, temp FROM ${'tyres' + req.body.massiv[3]}
               ) AS f
        WHERE  1`

        //`SELECT tyresdiv, pressure,temp FROM ${tableTyresView} WHERE 1`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            //console.log(results)
            res.json({ status: 200, result: results, message: req.body.massiv })
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
    // console.log(req.body.car)
    const nameCar = 'tyres' + req.body.car.replace(/\s+/g, '')
    try {
        const selectBase = `SELECT tyresdiv, pressure,temp FROM ${nameCar} WHERE 1`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            //console.log(results)
            response.status(200, results, req.body.car, res)
        })
    }
    catch (e) {
        console.log(e)
    }


}

