"use strict"


exports.status = (status, values, message, res) => {

    const data = {
        status: status,
        values: values,
        message: message
    }
    // res.status(data.status)
    res.json(data)
    res.end();
}