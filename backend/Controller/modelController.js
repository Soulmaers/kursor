const response = require('../response')
//const wialon = require('wialon');
//const getMainInfo = require('../settings/config')
const connection = require('../settings/db')


exports.deleteView = (req, res) => {
    console.log(req.body.name)
    const tableModel = 'model' + req.body.name
    try {
        const postModel = `DELETE FROM ${tableModel}`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err);
            //console.log(results)
            response.status(200, results, res)
        })
    }
    catch (e) {
        console.log(e)
    }
}



exports.paramsDeleteView = (req, res) => {
    console.log(req.body.name)
    const tableTyres = 'tyres' + req.body.name
    try {
        const postModel = `DELETE FROM ${tableTyres}`
        connection.query(postModel, function (err, results) {
            if (err) console.log(err);
            //console.log(results)
            response.status(200, results, res)
        })
    }
    catch (e) {
        console.log(e)
    }

}



exports.model = (req, res) => {
    console.log(req.body.activePost)
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
            response.status(200, results, res)
        })
    }
    catch (e) {
        console.log(e)
    }
}


exports.tyres = (req, res) => {
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
            response.status(200, results, res)
        })
    }
    catch (e) {
        console.log(e)
    }
}



exports.modelView = (req, res) => {
    //  console.log(req.body.activePost)
    const tableModelView = 'model' + req.body.activePost
    try {
        const selectBase = `SELECT osi, trailer,tyres FROM ${tableModelView} WHERE 1`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            //console.log(results)
            response.status(200, results, res)
        })
    }
    catch (e) {
        console.log(e)
    }
}



exports.tyresView = (req, res) => {
    // console.log(req.body.activePost)
    const tableTyresView = 'tyres' + req.body.activePost
    try {
        const selectBase = `SELECT tyresdiv, pressure,temp FROM ${tableTyresView} WHERE 1`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            //console.log(results)
            response.status(200, results, res)
        })
    }
    catch (e) {
        console.log(e)
    }
}

