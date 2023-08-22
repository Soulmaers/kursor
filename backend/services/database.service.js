
const connection = require('../config/db')
const databaseService = require('./database.service');
const wialonService = require('./wialon.service.js')
/*
let socked;
module.exports = {
    socked
}*/
//сохраняем в базу параметры и обновляем их
exports.saveDataToDatabase = async (name, idw, param, time) => {
    param.forEach(el => {
        el.unshift(name)
        el.unshift(idw)
        el.push('new')
        el.push(time)
    })
    try {
        const selectBase = `SELECT name FROM params WHERE idw='${idw}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            if (results.length === 0) {
                const sql = `INSERT INTO params(idw, nameCar, name, value, status, time) VALUES?`;
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
                        const sql = `UPDATE params SET idw='${idw}', nameCar='${name}',name='${el[2]}', value='${el[3]}', status='true',time='${el[5]}'  WHERE idw='${idw}' AND name='${el[2]}'`;
                        connection.query(sql, function (err, results) {
                            if (err) console.log(err);
                        });
                        return
                    }
                    if (!mas.includes(el[2])) {
                        const sql = `INSERT INTO params SET idw='${idw}', nameCar='${name}',name='${el[2]}', value='${el[3]}', status='new',time='${el[5]}'`;
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

exports.saveChartDataToBase = async (mass) => {
    //console.log(mass);
    try {
        const sql = `INSERT INTO chartData(idw, nameCar, data,time, speed,sats, geo, sens) VALUES ?`;
        connection.query(sql, [mass], function (err, results) {
            if (err) console.log(err);
        });
    } catch (e) {
        console.log(e);
    }
};
exports.viewChartDataToBase = async (idw, t1, t2) => {
    return new Promise((resolve, reject) => {
        try {
            const postModel = `SELECT * FROM chartData WHERE idw='${idw}' AND data >= ${t1} AND data <= ${t2}`;
            connection.query(postModel, function (err, results) {
                if (err) console.log(err);
                //    const filteredResults = results.filter((_, index) => index % 10 === 1);
                resolve(results);
            });
        } catch (e) {
            console.log(e);
        }
    });
};

exports.lostChartDataToBase = async () => {
    return new Promise((resolve, reject) => {
        try {
            const postModel = `SELECT data FROM chartData ORDER BY data DESC LIMIT 1`
            connection.query(postModel, function (err, results) {
                if (err) console.log(err);
                resolve(results)
            });
        } catch (e) {
            console.log(e);
        }
    })
};




exports.saveStatusToBase = async (activePost, idw, todays, statusTSI, todays2, status) => {
    if (status !== undefined) {
        const mass = [idw, activePost, todays, statusTSI, todays2, status]
        try {
            const postModel = `SELECT * FROM statusObj WHERE idw='${idw}'`
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
                    if (results[0].status !== statusTSI) {
                        const postModel = `UPDATE statusObj SET time='${todays}',status='${statusTSI}' WHERE idw='${idw}'`
                        connection.query(postModel, function (err, results) {
                            if (err) {
                                console.log(err)
                            }
                        })
                    }
                    if (results[0].statusIng !== status) {
                        const postModel = `UPDATE statusObj SET timeIng='${todays2}',statusIng='${status}' WHERE idw='${idw}'`
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
}



exports.controllerSaveToBase = async (arr, id, geo, start) => {
    const idw = id
    const date = new Date()
    const time = (date.getTime() / 1000).toFixed(0)
    const newdata = JSON.stringify(arr)
    const geoLoc = JSON.stringify(geo)
    // console.log(newdata, time, idw, geoLoc, start)
    const res = await databaseService.logsSaveToBase(newdata, time, idw, geoLoc, start)
    return res
}


exports.ggg = async (id) => {
    console.log('ggg')
    return new Promise(async function (resolve, reject) {
        const idw = id
        const allobj = {};
        const ress = await wialonService.getAllNameSensorsIdDataFromWialon(idw)
        if (!ress) {
            ggg(id)
        }
        const nameSens = Object.entries(ress.item.sens)
        const arrNameSens = [];
        nameSens.forEach(el => {
            arrNameSens.push([el[1].n, el[1].p])
        })
        const result = await wialonService.getLastAllSensorsIdDataFromWialon(idw)
        if (result) {
            const valueSens = [];
            Object.entries(result).forEach(e => {
                valueSens.push(e[1])
            })
            const allArr = [];
            arrNameSens.forEach((e, index) => {
                allArr.push([...e, valueSens[index]])
            })
            allArr.forEach(it => {
                allobj[it[1]] = it[0]
            })
        }
        resolve(allobj)
    });
}

//сохраняем в базу алармы
let count = 0;
exports.alarmBase = async (data, tyres, alarm) => {
    exports.myVariable = [data, tyres, alarm, count]
    console.log('данные по алармам')
    const dannie = data.concat(tyres)
    let val;

    console.log(alarm)
    const allSens = await databaseService.ggg(dannie[6])
    const tyress = allSens[dannie[2]]
    console.log(dannie)
    alarm !== 'Потеря связи с датчиком' ? val = dannie[3] + ' ' + 'Бар' : val = dannie[4] + '' + 't'
    const res = alarm !== 'Норма' ? await databaseService.controllerSaveToBase([{
        event: 'Предупреждение', name: `Компания: ${dannie[9]}`, name: `Объект: ${dannie[1]}`, time: `Время ${dannie[0]}`, tyres: `Колесо: ${tyress}`,
        param: `Параметр: ${val}`, alarm: `Событие: ${alarm}`
    }], dannie[6], dannie[8]) : 'Норма. В базу не пишем'
    console.log('Предупреждение' + ' ' + res.message)
    count++

    const id = dannie[6]
    dannie.splice(5, 3)
    dannie.pop()
    dannie.push(alarm)
    dannie.unshift(id)
    const value = [dannie];
    try {
        const selectBase = `SELECT idw, data, name, senspressure, bar, temp ,alarm 
                    FROM alarms 
                    WHERE idw='${dannie[0]}' AND
                          data='${dannie[1]}' AND
                          name='${dannie[2]}' AND
                          senspressure='${dannie[3]}' AND
                          bar='${dannie[4]}' AND
                          temp='${dannie[5]}' AND
                          alarm='${dannie[6]}'`
        connection.query(selectBase, async function (err, results) {
            console.log(err)
            if (results.length !== 0) {
                console.log(results)

            }
            else {
                const sqls = `INSERT INTO alarms (idw, data, name, senspressure, bar,
                            temp, alarm) VALUES?`;
                connection.query(sqls, [value], function (err, results) {
                    if (err) console.log(err);

                });
            }
        })
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
                const selectBase = `SELECT osi, trailer,tyres, type FROM model WHERE idw='${idw}'`
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
            const selectBase = `SELECT nameCar, name, value, status, time FROM params WHERE idw='${idw}'`
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
exports.quantityFindToBase = async (login, quantity) => {
    console.log('квантити')
    return new Promise((resolve, reject) => {
        try {
            const selectBase = `SELECT quantity FROM viewLogs WHERE login='${login}'`
            connection.query(selectBase, function (err, results) {
                if (err) {
                    console.log(err)
                };
                resolve(results)
            })
        }
        catch (e) {
            console.log(e)
        }
    })
}
exports.quantitySaveToBase = async (login, quantity) => {

    console.log(login, quantity)
    return new Promise((resolve, reject) => {
        try {
            const selectBase = `SELECT login FROM viewLogs WHERE login='${login}'`
            connection.query(selectBase, function (err, results) {
                if (err) {
                    console.log(err)
                };
                console.log(results.length)
                if (results.length === 0) {
                    const arr = [[login, 0]]
                    const selectBase = `INSERT INTO viewLogs(login, quantity) VALUES?`;
                    connection.query(selectBase, [arr], function (err, results) {
                        if (err) {
                            console.log(err)
                            reject(err)
                        } else {
                            resolve({ message: 'quntity добавлено' })
                        }
                    })
                }
                else {
                    console.log('число' + quantity)
                    if (quantity !== undefined) {
                        const postModel = `UPDATE viewLogs SET quantity='${quantity}' WHERE login='${login}'`
                        connection.query(postModel, function (err, results) {
                            if (err) {
                                console.log(err)
                                reject(err)
                            } else {
                                resolve({ message: 'quntity обновлено' })
                            }
                        })
                    }
                    else {
                        resolve({ message: 'quntity старое' })
                    }
                }
            })
        }
        catch (e) {
            console.log(e)
        }
    })
}
exports.updateModelSaveToBase = async (idw, massiv, nameCar, gosp, gosp1, frontGosp, frontGosp1, type, tsiControll) => {
    console.log(gosp)
    console.log(idw, massiv, nameCar, gosp, gosp1, frontGosp, frontGosp1, type, tsiControll)
    const promises = massiv.map(el => {
        el.push(gosp)
        el.push(gosp1)
        el.push(frontGosp)
        el.push(frontGosp1)
        el.push(type)
        el.push(tsiControll)
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
                        const selectBase = `INSERT INTO model(idw, nameCar, osi, trailer, tyres, gosp, gosp1, frontGosp, frontGosp1,type, tsiControll) VALUES?`
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
                        const postModel = `UPDATE model SET idw='${el[0]}', nameCar='${el[1]}',  osi='${el[2]}', trailer='${el[3]}', tyres='${el[4]}',gosp='${gosp}',gosp1='${gosp1}', frontGosp='${frontGosp}', frontGosp1='${frontGosp1}', type='${type}',tsiControll='${tsiControll}' WHERE idw='${el[0]}' AND osi='${el[2]}'`
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


exports.logsSaveToBase = async (arr, time, idw, geo, start) => {
    const data = [time, arr, idw]
    return new Promise((resolve, reject) => {
        let checkExistQuery;
        if (start) {
            checkExistQuery = `SELECT * FROM logs WHERE startOil='${start}'`
        }
        else {
            checkExistQuery = `SELECT * FROM logs WHERE content='${arr}'`
        }

        connection.query(checkExistQuery, function (err, results) {
            if (err) {
                console.log(err)
                reject(err)
            } else if (results.length > 0) {
                resolve({ message: 'Событие уже существует в базе логов' })
            } else {
                let postModel;
                if (start) {
                    postModel = `INSERT INTO logs(idw, time, content, geo, startOil) VALUES(${idw}, ${time}, '${arr}','${geo}','${start}')`
                }
                else {
                    postModel = `INSERT INTO logs(idw, time, content, geo) VALUES(${idw}, ${time}, '${arr}','${geo}')`
                }

                connection.query(postModel, function (err, results) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    } else {
                        resolve({ message: 'Событие сохранено в базу логов' })
                    }
                })
            }
        })
    })
}



exports.logsFindToBase = async (id) => {
    return new Promise((resolve, reject) => {
        const postModel = `SELECT * FROM logs WHERE idw IN (${id.join(',')})`;
        connection.query(postModel, function (err, results) {
            if (err)
                reject(err); // передаём ошибку в reject
            resolve(results);
        })
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
            const selectBase = `SELECT idw, nameCar, osi, trailer,tyres, gosp, gosp1, frontGosp, frontGosp1, type, tsiControll FROM model WHERE  idw ='${idw}'`
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

module.exports.summaryToBase = (idw, arr, data) => {
    const value = []
    value.push(idw)
    value.push(data)
    value.push(arr.type)
    value.push(arr.nameCar)
    value.push(arr.quantityTSjob)
    value.push(arr.probeg)
    value.push(arr.rashod)
    value.push(arr.zapravka)
    value.push(arr.lifting)
    value.push(arr.motoHours)
    value.push(arr.prostoy)
    value.push(arr.medium)
    value.push(arr.hhOil)
    value.push(arr.company)
    return new Promise((resolve, reject) => {
        try {
            const selectBase = `SELECT data, idw FROM summary WHERE idw='${idw}' AND data='${data}'`
            connection.query(selectBase, function (err, results) {
                if (err) console.log(err);
                if (results.length === 0) {
                    const sql = `INSERT INTO  summary(idw, data, type, nameCar, jobTS, probeg, rashod, zapravka, dumpTrack,moto, prostoy, medium, oilHH, company) VALUES?`;
                    connection.query(sql, [[value]], function (err, results) {
                        if (err) console.log(err)
                        resolve({ message: 'даные добавлены' })
                    })
                }
                else {
                    const sql = `UPDATE summary SET  idw='${idw}',data='${data}', type='${arr.type}', nameCar='${arr.nameCar}', jobTS='${arr.quantityTSjob}',
                     probeg='${arr.probeg}', rashod='${arr.rashod}',zapravka='${arr.zapravka}',dumpTrack='${arr.lifting}',moto='${arr.motoHours}',
                     prostoy='${arr.prostoy}',medium='${arr.medium}',oilHH='${arr.hhOil}',company='${arr.company}'  WHERE  idw='${idw}' AND data='${data}'`;
                    connection.query(sql, function (err, results) {
                        if (err) console.log(err)
                        else resolve({ message: 'данные обновлены' })
                    });
                }
            })
        }
        catch (e) {
            console.log(e)
        }
    })
}


module.exports.group = (idw) => {
    return new Promise((resolve, reject) => {
        try {
            const selectBase = `SELECT company FROM summary WHERE idw=${idw}`;
            connection.query(selectBase, function (err, results) {
                if (err) console.log(err)
                resolve(results)
            });
        } catch (e) {
            console.log(e)
        }
    })
}




module.exports.summaryYestodayToBase = (data, company) => {
    return new Promise((resolve, reject) => {
        if (data.length === 1) {
            try {
                const selectBase = "SELECT * FROM summary WHERE company IN (?) AND data=?";
                const values = [company, data];
                connection.query(selectBase, values, function (err, results) {
                    if (err) console.log(err)
                    resolve(results)
                });
            } catch (e) {
                console.log(e)
            }

        }
        else {
            try {
                // console.log(company)
                //  console.log(data)
                const selectBase = "SELECT * FROM summary WHERE company IN (?) AND STR_TO_DATE(data, '%Y-%m-%d') >= ? AND STR_TO_DATE(data, '%Y-%m-%d') <= ?"
                const values = [company, data[0], data[1]];
                connection.query(selectBase, values, function (err, results) {
                    if (err) console.log(err);
                    //   console.log(results)
                    resolve(results);
                });
            } catch (e) {
                console.log(e);
            }
        }

    });
};



module.exports.sumIdwToBase = (data, idw) => {
    return new Promise((resolve, reject) => {
        if (data.length === 1) {
            try {
                const selectBase = "SELECT * FROM summary WHERE idw IN (?) AND data=?";
                const values = [idw, data];
                connection.query(selectBase, values, function (err, results) {
                    if (err) console.log(err);
                    resolve(results);
                });
            } catch (e) {
                console.log(e);
                reject(e);
            }
        }
        else {
            try {
                const selectBase = "SELECT * FROM summary WHERE idw IN (?) AND STR_TO_DATE(data, '%Y-%m-%d') >= ? AND STR_TO_DATE(data, '%Y-%m-%d') <= ?"
                const values = [idw, data[0], data[1]];
                connection.query(selectBase, values, function (err, results) {
                    if (err) console.log(err);
                    //   console.log(results)
                    resolve(results);
                });
            } catch (e) {
                console.log(e);
            }
        }
    });

};



