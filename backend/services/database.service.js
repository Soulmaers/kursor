
const connection = require('../config/db')



//сохраняем в базу параметры и обновляем их
exports.saveDataToDatabase = async (name, idw, param) => {
    param.forEach(el => {
        el.unshift(name)
        el.unshift(idw)
        el.push('new')
    })
    try {
        const selectBase = `SELECT name FROM params WHERE idw='${idw}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            if (results.length === 0) {
                const sql = `INSERT INTO params(idw, nameCar, name, value, status) VALUES?`;
                connection.query(sql, [param], function (err, results) {
                    if (err) console.log(err);
                });
            }
            else if (results.length > 0) {
                const mas = []
                results.forEach(el => {
                    mas.push(el.name)
                });
                const paramName = [];
                param.forEach(el => {
                    paramName.push(el[2])
                })
                param.forEach(el => {
                    if (mas.includes(el[2])) {
                        const sql = `UPDATE params SET idw='${idw}', nameCar='${name}',name='${el[2]}', value='${el[3]}', status='true' WHERE idw='${idw}' AND name='${el[2]}'`;
                        connection.query(sql, function (err, results) {
                            if (err) console.log(err);
                        });
                        return
                    }
                    if (!mas.includes(el[2])) {
                        const sql = `INSERT INTO params SET idw='${idw}', nameCar='${name}',name='${el[2]}', value='${el[3]}', status='new'`;
                        connection.query(sql, function (err, results) {
                            if (err) console.log(err);
                        });
                        return
                    }
                })
                mas.forEach(el => {
                    if (!paramName.includes(el)) {
                        const sql = `UPDATE params SET  status='false' WHERE idw='${idw}' AND name='${el}'`;
                        connection.query(sql, function (err, results) {
                            if (err) console.log(err);
                        });
                    }
                })
            }
        })
    }
    catch (e) {
        console.log(e)
    }
};

//сохраняем в базу алармы
exports.alarmBase = async (data, tyres, alarm) => {
    console.log('данные по алармам')
    const dannie = data.concat(tyres)
    const id = dannie[6]
    dannie.splice(5, 3)
    dannie.push(alarm)
    dannie.unshift(id)
    const value = [dannie];
    try {
        const sqls = `INSERT INTO alarms (idw, data, name, senspressure, bar,
                            temp, alarm) VALUES?`;
        connection.query(sqls, [value], function (err, results) {
            if (err) console.log(err);
        });
    }
    catch (e) {
        console.log(e)
    }
}
exports.loadParamsViewList = async (car, el) => {
    const idw = el
    const mod = () => {
        return new Promise((resolve, reject) => {
            try {
                const selectBase = `SELECT osi, trailer,tyres FROM model WHERE idw='${idw}'`
                connection.query(selectBase, async function (err, results) {
                    console.log(err)
                    resolve({ result: results, message: car })
                })
            }
            catch (e) {
                console.log(e)
            }
        })
    }
    const tyr = () => {
        return new Promise((resolve, reject) => {
            try {
                const selectBase = `SELECT tyresdiv, pressure, temp, osNumber FROM tyres WHERE idw='${idw}'`
                connection.query(selectBase, function (err, results) {
                    if (err) console.log(err)
                    if (results === undefined) {
                        resolve('')
                    }
                    else {
                        resolve({ result: results, message: car })
                    }
                })
            }
            catch (e) {
                console.log(e)
            }
        })
    }
    const dat = () => {
        return new Promise((resolve, reject) => {
            try {
                const selectBase = `SELECT name, value, status FROM params WHERE idw='${idw}'`
                connection.query(selectBase, function (err, results) {
                    if (err) console.log(err);
                    resolve({ result: results, message: car })
                })
            }
            catch (e) {
                console.log(e)
            }
        })
    }
    const osis = () => {
        return new Promise((resolve, reject) => {
            try {
                const selectBase = `SELECT * FROM ifBar WHERE idw='${idw}'`
                connection.query(selectBase, function (err, results) {
                    if (err) console.log(err)
                    resolve({ result: results, message: car })
                })
            }
            catch (e) {
                console.log(e)
            }
        })
    }
    const model = await mod();
    const models = await tyr();
    const data = await dat();
    const osi = await osis();
    model.result.sort((a, b) => {
        if (a.osi > b.osi) {
            return 1;
        } else if (a.osi < b.osi) {
            return -1;
        } else {
            return 0;
        }
    });
    return [model, models, data, osi, el,]
}


exports.dostupObject = async (login) => {
    return new Promise((resolve, reject) => {
        try {
            const selectBase = `SELECT Object FROM userObjects WHERE login='${login}'`
            connection.query(selectBase, function (err, results) {
                if (err) console.log(err);
                const nameCarCheck = results.map(elem => elem.Object)
                resolve(nameCarCheck)
            })
        }
        catch (e) {
            console.log(e)
        }
    })
}



//забираем из бд параметры по id
exports.paramsToBase = async (idw) => {
    return new Promise((resolve, reject) => {
        try {
            const selectBase = `SELECT nameCar, name, value, status FROM params WHERE idw='${idw}'`
            connection.query(selectBase, function (err, results) {
                if (err) console.log(err);
                resolve(results)
            })
        }
        catch (e) {
            console.log(e)
        }
    })
}

exports.iconFindtoBase = async (idw) => {
    return new Promise((resolve, reject) => {
        try {
            const postModel = `SELECT params, coef, icons FROM icon WHERE idw='${idw}'`
            connection.query(postModel, function (err, results) {
                if (err) console.log(err)
                resolve(results)
            })
        }
        catch (e) {
            console.log(e)
        }
    })
}

module.exports.alarmFindtoBase = (idw, tyresp) => {
    return new Promise((resolve, reject) => {
        try {
            const sqls1 = `SELECT data, senspressure, bar, temp, alarm  FROM alarms WHERE idw='${idw}' AND senspressure='${tyresp}'`
            connection.query(sqls1, function (err, results) {
                if (err) console.log(err)
                if (results.length === 0) {
                    resolve([])
                }
                else {
                    resolve(results)
                }
            })
        }
        catch (e) {
            console.log(e)
        }
    })
}


exports.updateModelSaveToBase = async (idw, massiv, nameCar, gosp, gosp1, frontGosp, frontGosp1) => {
    const promises = massiv.map(el => {
        el.push(gosp)
        el.push(gosp1)
        el.push(frontGosp)
        el.push(frontGosp1)
        el.unshift(nameCar)
        el.unshift(idw)
        return new Promise((resolve, reject) => {
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
                                reject(err)
                            } else {
                                resolve({ message: 'успех' })
                            }
                        })
                    }
                    if (results.length > 0) {
                        const postModel = `UPDATE model SET idw='${el[0]}', nameCar='${el[1]}',  osi='${el[2]}', trailer='${el[3]}', tyres='${el[4]}',gosp='${gosp}',gosp1='${gosp1}', frontGosp='${frontGosp}', frontGosp1='${frontGosp1}' WHERE idw='${el[0]}' AND osi='${el[2]}'`
                        connection.query(postModel, function (err, results) {
                            if (err) {
                                console.log(err)
                                reject(err)
                            } else {
                                resolve({ message: 'успех' })
                            }
                        })
                    }
                })
            }
            catch (e) {
                console.log(e)
                reject(e)
            }
        })
    })

    return Promise.all(promises)
}


exports.tyresSaveToBase = (nameCar, tyres, idw) => {
    const promises = tyres.map(el => {
        el.unshift(nameCar)
        el.unshift(idw)
        return new Promise((resolve, reject) => {
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
                resolve({ message: 'Успех' })

            }
            catch (e) {
                console.log(e)
            }
        })
    })
    return Promise.all(promises)

}


exports.deleteModelToBase = (idw) => {
    return new Promise((resolve, reject) => {
        try {
            const postModel = `DELETE FROM model WHERE idw='${idw}'`
            connection.query(postModel, function (err, results) {
                if (err) console.log(err);
                resolve(results)
            })
        }
        catch (e) {
            console.log(e)
        }

    })
}

exports.deleteTyresToBase = (idw) => {
    return new Promise((resolve, reject) => {
        try {
            const postModel = `DELETE FROM tyres WHERE idw='${idw}'`
            connection.query(postModel, function (err, results) {
                if (err) console.log(err);
                resolve(results)
            })
        }
        catch (e) {
            console.log(e)
        }
    })
}


exports.modalBarSaveToBase = (value) => {
    return new Promise((resolve, reject) => {
        try {
            const selectBase = `SELECT nameCar, idOs FROM ifBar WHERE idw='${value[0][0]}' AND idOs='${value[0][2]}'`
            connection.query(selectBase, function (err, results) {
                if (err) console.log(err);
                if (results.length === 0) {
                    const sql = `INSERT INTO  ifBar(idw, nameCar, idOs, norma, dnmin, dnmax, dnn, dvn, knd, kvd) VALUES?`;
                    connection.query(sql, [value], function (err, results) {
                        if (err) console.log(err);
                        else resolve("Данные добавлены");
                    });
                }
                if (results.length > 0) {
                    const sql = `UPDATE ifBar SET idw='${value[0][0]}', nameCar='${value[0][1]}', idOs='${value[0][2]}', norma='${value[0][3]}', dnmin='${value[0][4]}', 
                    dnmax='${value[0][5]}',dnn='${value[0][6]}', dvn='${value[0][7]}', knd='${value[0][8]}', kvd='${value[0][9]}' WHERE idw='${value[0][0]}' AND idOs='${value[0][2]}'`;
                    connection.query(sql, [value], function (err, results) {
                        if (err) console.log(err);
                        else resolve("Данные обновлены");
                    });
                }
            })
        }
        catch (e) {
            console.log(e)
        }
    })
}

exports.deleteBarToBase = (idw) => {
    return new Promise((resolve, reject) => {
        try {
            const postModel = `DELETE FROM ifBar WHERE idw='${idw}'`
            connection.query(postModel, function (err, results) {
                if (err) console.log(err);
                resolve(results)
            })
        }
        catch (e) {
            console.log(e)
        }
    })
}




exports.tarirSaveToBase = async (arr) => {
    return new Promise((resolve, reject) => {
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
                        resolve({ message: 'Данные добавлены' })
                    })
                }
                if (results.length > 0) {
                    arr.forEach(el => {
                        console.log(el[0])
                        const postModel = `UPDATE tarir SET  date='${el[0]}', idx='${el[1]}', nameCar='${el[2]}', zamer='${el[3]}', DUT='${el[4]}',litrs='${el[5]}'WHERE idx='${el[1]}' AND zamer='${el[3]}'`
                        connection.query(postModel, function (err, results) {
                            if (err) {
                                console.log(err)
                                resolve({ message: 'Данные обновлены' })
                            }
                        })
                    })
                }
            })
        }
        catch (e) {
            console.log(e)
        }
    })
}

module.exports.tarirViewToBase = async (idw) => {
    return new Promise((resolve, reject) => {
        try {
            const postModel = `SELECT * FROM tarir WHERE idx='${idw}'`
            connection.query(postModel, function (err, results) {
                if (err) console.log(err);
                resolve({ result: results })
            })
        }
        catch (e) {
            console.log(e)
        }
    })
}


exports.modelViewToBase = (idw) => {
    return new Promise((resolve, reject) => {
        try {
            const selectBase = `SELECT idw, nameCar, osi, trailer,tyres, gosp, gosp1, frontGosp, frontGosp1 FROM model WHERE  idw ='${idw}'`
            connection.query(selectBase, function (err, results) {
                if (err) console.log(err)
                if (results === undefined) {
                    resolve(results)
                }
                else {
                    resolve(results)
                }
            })
        }
        catch (e) {
            console.log(e)
        }
    })
}

module.exports.tyresViewToBase = (idw) => {
    return new Promise((resolve, reject) => {
        try {
            const selectBase = `SELECT tyresdiv, pressure,temp, osNumber FROM tyres WHERE idw='${idw}'`
            connection.query(selectBase, function (err, results) {
                if (err) console.log(err)
                if (results === undefined) {
                    resolve(results)
                }
                else {
                    resolve(results)
                }
            })
        }
        catch (e) {
            console.log(e)
        }
    })
}



exports.barViewToBase = (idw, count) => {
    return new Promise((resolve, reject) => {
        if (count) {
            try {
                const selectBase = `SELECT * FROM ifBar WHERE  idw='${idw}' AND idOs='${count}'`
                connection.query(selectBase, function (err, results) {
                    if (err) console.log(err)
                    resolve({ result: results })
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
                    resolve({ result: results })
                })
            }
            catch (e) {
                console.log(e)
            }
        }
    })
}

module.exports.iconSaveToBase = (activePost, param, coef, id, idw) => {
    return new Promise((resolve, reject) => {
        try {
            const selectBase = `SELECT icons FROM icon WHERE idw='${idw}' AND icons='${id}'`
            connection.query(selectBase, function (err, results) {
                if (err) console.log(err);
                if (results.length === 0) {
                    const postModel = `INSERT INTO icon(idw, nameCar, params, coef, icons) VALUES('${idw}', '${activePost}','${param}','${coef}','${id}')`
                    connection.query(postModel, function (err, results) {
                        if (err) console.log(err + 'ошибка26')
                        resolve(results)
                    })
                }
                else {
                    const sql = `UPDATE icon SET  idw='${idw}', nameCar='${activePost}', params='${param}', coef='${coef}', icons='${id}'WHERE  idw='${idw}' AND icons='${id}'`;
                    connection.query(sql, function (err, results) {
                        if (err) console.log(err)
                        else resolve(results)
                    });
                }
            })
        }
        catch (e) {
            console.log(e)
        }
    })
}


module.exports.saveTechToBase = async (value, add) => {
    return new Promise((resolve, reject) => {
        if (add) {
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
                    resolve('Данные добавлены')
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
                    resolve('Данные добавлены')
                });
            }
            catch (e) {
                console.log(e)
            }
        }
    })
}

exports.techViewToBase = (nameCar, count, idw) => {
    return new Promise((resolve, reject) => {
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
        maxMM FROM tyresBase WHERE idw='${idw}' AND idTyres='${count}'`
            connection.query(selectBase, function (err, results) {
                if (err) console.log(err)
                resolve(results)
            })
        }
        catch (e) {
            console.log(e)
        }
    })
}

module.exports.techViewAllToBase = (idw) => {
    return new Promise((resolve, reject) => {
        try {
            const selectBase = `SELECT * FROM tyresBase WHERE idw='${idw}'`
            connection.query(selectBase, function (err, results) {
                if (err) console.log(err)
                resolve(results)
            })
        }
        catch (e) {
            console.log(e)
        }
    })
}