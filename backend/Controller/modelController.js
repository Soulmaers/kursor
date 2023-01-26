const response = require('../response')
//const wialon = require('wialon');
//const getMainInfo = require('../settings/config')
const connection = require('../settings/db')


exports.deleteView = (req, res) => {
    // console.log(req.body)
    // console.log('запрос')
    try {
        const postModel = "DELETE FROM model"
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

exports.deleteView2 = (req, res) => {
    // console.log(req.body)
    // console.log('запрос')
    try {
        const postModel = "DELETE FROM model2"
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
    try {
        const postModel = "DELETE FROM tyres"
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

exports.paramsDeleteView2 = (req, res) => {
    try {
        const postModel = "DELETE FROM tyres2"
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
    console.log(req.body)
    //  console.log('запрос')
    try {
        const postModel = `INSERT INTO model(osi, trailer, tyres) VALUES?`
        connection.query(postModel, [req.body], function (err, results) {
            if (err) console.log(err);
            //console.log(results)
            response.status(200, results, res)
        })
    }
    catch (e) {
        console.log(e)
    }
}

exports.model2 = (req, res) => {
    console.log(req.body)
    //  console.log('запрос')
    try {
        const postModel2 = `INSERT INTO model2(osi, trailer, tyres) VALUES?`
        connection.query(postModel2, [req.body], function (err, results) {
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
    console.log(req.body)
    //  console.log('запрос')
    try {
        const postModel = `INSERT INTO tyres(tyresdiv, pressure, temp) VALUES?`
        connection.query(postModel, [req.body], function (err, results) {
            if (err) console.log(err);
            //console.log(results)
            response.status(200, results, res)
        })
    }
    catch (e) {
        console.log(e)
    }
}

exports.tyres2 = (req, res) => {
    console.log(req.body)
    //  console.log('запрос')
    try {
        const postModel = `INSERT INTO tyres2(tyresdiv, pressure, temp) VALUES?`
        connection.query(postModel, [req.body], function (err, results) {
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
    // console.log('ответ')
    try {
        const selectBase = `SELECT osi, trailer,tyres FROM model WHERE 1`
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

exports.modelView2 = (req, res) => {
    // console.log('ответ')
    try {
        const selectBase = `SELECT osi, trailer,tyres FROM model2 WHERE 1`
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
    try {
        const selectBase = `SELECT tyresdiv, pressure,temp FROM tyres WHERE 1`
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

exports.tyresView2 = (req, res) => {
    try {
        const selectBase = `SELECT tyresdiv, pressure,temp FROM tyres2 WHERE 1`
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