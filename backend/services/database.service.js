
const { connection, sql } = require('../config/db')
const databaseService = require('./database.service');
const wialonService = require('./wialon.service.js')
const helpers = require('../helpers.js')
const send = require('./send.service.js');
const { y } = require('pdfkit');


exports.createIndexDataToDatabase = async () => {
    const selectBase = `CREATE INDEX idx_id ON alarms(idw, senspressure)`
    connection.query(selectBase, function (err, results) {
        if (err) console.log(err);
    })
}

//сохраняем в базу параметры и обновляем их
exports.saveDataToDatabase = async (name, idw, param, time) => {
    //  console.log(name, idw, param, time)
    param.forEach(el => {
        el.unshift(name)
        el.unshift(idw)
        el.push('new')
        el.push(time)
    })
    //console.log(param)
    try {
        const selectBase = `SELECT name FROM params WHERE idw='${String(idw)}'`
        const pool = await connection;
        let result = await pool.request().query(selectBase);
        //console.log(result)
        if (result.recordset.length === 0) {
            for (let el of param) {
                const sqls = `INSERT INTO params(idw, nameCar, name, value, status, time) VALUES (@idw, @nameCar, @name, @value, @status, @time)`;
                const pool = await connection;
                await pool.request()
                    .input('idw', String(el[0]))
                    .input('nameCar', String(el[1]))
                    .input('name', String(el[2]))
                    .input('value', String(el[3]))
                    .input('status', String(el[4]))
                    .input('time', String(el[5]))
                    .query(sqls);
            }
        }
        else if (result.recordset.length > 0) {
            const mas = [];
            result.recordset.forEach(el => mas.push(el.name));
            const paramName = [];
            // console.log(param)
            param.forEach(el => paramName.push(el[2]));
            for (let el of param) {
                if (mas.includes(el[2])) {
                    const sqlUpdate = `UPDATE params SET idw='${String(idw)}', nameCar='${name}',name='${el[2]}', value='${el[3]}', status='true',time='${el[5]}'  WHERE idw='${String(idw)}' AND name='${el[2]}'`;
                    const pool = await connection;
                    await pool.request().query(sqlUpdate);
                } else if (!mas.includes(el[2])) {
                    const sqlInsert = `INSERT INTO params(idw, nameCar, name, value, status, time) VALUES (@idw, @nameCar, @name, @value, @status, @time)`;
                    const pool = await connection;
                    await pool.request()
                        .input('idw', String(idw))
                        .input('nameCar', String(name))
                        .input('name', String(el[2]))
                        .input('value', String(el[3]))
                        .input('status', 'new')
                        .input('time', String(el[5]))
                        .query(sqlInsert);
                }
            }
            for (let el of mas) {
                if (!paramName.includes(el)) {
                    const sqlUpdateStatus = `UPDATE params SET  status='false' WHERE idw='${String(idw)}' AND name='${el}'`;
                    const pool = await connection;
                    await pool.request().query(sqlUpdateStatus);
                }
            }
        }
    }
    catch (e) {
        console.log(e)
    }
};

exports.saveChartDataToBase = async (mass) => {
    const sqls = `INSERT INTO chartData(idw, nameCar, data, time, speed, sats, geo, curse, sens, allSensParams) VALUES (@idw, @nameCar, @data, @time, @speed, @sats, @geo, @curse, @sens, @allSensParams)`;
    const pool = await connection;
    for (let i = 0; i < mass.length; i++) {
        try {
            await pool.request()
                .input('idw', sql.NVarChar, mass[i][0])
                .input('nameCar', sql.NVarChar, mass[i][1])
                .input('data', sql.NVarChar, mass[i][2])
                .input('time', sql.NVarChar, (mass[i][3]))
                .input('speed', sql.NVarChar, mass[i][4])
                .input('sats', sql.NVarChar, mass[i][5])
                .input('geo', sql.NVarChar, mass[i][6])
                .input('curse', sql.NVarChar, mass[i][7])
                .input('sens', sql.NVarChar, mass[i][8])
                .input('allSensParams', sql.NVarChar, mass[i][9])
                .query(sqls);
        }
        catch (error) {
            console.log(error);
        }
    }
};

exports.saveSortDataToBase = async (mass) => {
    const sqls = `INSERT INTO sortData(idw, nameCar, time, geo,speed, sats, curse, oil, pwr, engine, meliage) VALUES (@idw, @nameCar, @time,  @geo, @speed, @sats, @curse, @oil, @pwr, @engine, @meliage)`;
    const pool = await connection;
    for (let i = 0; i < mass.length; i++) {
        try {
            await pool.request()
                .input('idw', sql.Int, mass[i][0])
                .input('nameCar', sql.NVarChar, mass[i][1])
                .input('time', sql.NVarChar, (mass[i][2]))
                .input('geo', sql.NVarChar, mass[i][3])
                .input('speed', sql.Int, mass[i][4])
                .input('sats', sql.Int, mass[i][5])
                .input('curse', sql.Int, mass[i][6])
                .input('oil', sql.Int, mass[i][7])
                .input('pwr', sql.Int, mass[i][8])
                .input('engine', sql.Int, mass[i][9])
                .input('meliage', sql.Int, mass[i][10])
                .query(sqls);
        }
        catch (error) {
            console.log(error);
        }
    }
};

exports.saveStructuraToBase = async (mass) => {
    const data = mass[0];
    const idw = mass[1];
    const info = mass[2]
    console.log('структура')
    try {
        const postModel = `SELECT info FROM structura WHERE data = @data AND idw = @idw`;
        const pool = await connection;
        const results = await pool.request().input('data', data).input('idw', idw).query(postModel);
        if (results.recordset.length === 0) {
            const sql = `INSERT INTO structura (data, idw, info) VALUES (@data, @idw, @info)`;
            await pool.request().input('data', data).input('idw', idw).input('info', info).query(sql);
            console.log('запись сделана')
        }
        else {
            const postModel = `UPDATE structura  SET data=@data,idw=@idw,info=@info WHERE data = @data AND idw = @idw`
            await pool.request().input('data', data).input('idw', idw).input('info', info).query(postModel);
            console.log('апдейт')
        }
    } catch (e) {
        console.log(e);
    }
};
exports.eventSaveToBase = async (login, obj) => {
    const pool = await connection;
    try {
        const postModel = `SELECT login FROM eventSpam WHERE login=@login`;
        const results = await pool.request().input('login', login).query(postModel)

        if (results.recordset.length === 0) {
            const sqls = `INSERT INTO eventSpam (login, email, alert, what, teleg,  sms) VALUES (@login,
                 @email, @alert,@what,@teleg,@sms')`;
            const results = await pool.request()
                .input('login', login)
                .input('email', obj.email)
                .input('alert', obj.alert)
                .input('what', obj.what)
                .input('teleg', obj.teleg)
                .input('sms', obj.sms)
                .query(sqls)
            return 'Запись сделана'
        }
        else {
            const postModel = `UPDATE eventSpam SET login=@login,email=@email,alert=@alert, what=@what,
                teleg=@teleg, sms=@sms WHERE login =@login`
            const results = await pool.request()
                .input('login', login)
                .input('email', obj.email)
                .input('alert', obj.alert)
                .input('what', obj.what)
                .input('teleg', obj.teleg)
                .input('sms', obj.sms)
                .query(postModel)
            return 'Update'
        }

    } catch (e) {
        console.log(e);
    }

};
exports.saveListToBase = async (obj) => {
    try {
        const { login, statusnew, ingine, oil, type, pwr, sats, meliage, condition, tagach, pricep, lasttime } = obj;
        const pool = await connection;
        const results = await pool.request()
            .input('login', sql.NVarChar, login)
            .query(`SELECT login FROM list WHERE login=@login`);
        if (results.recordset.length === 0) {
            await pool.request()
                .input('login', sql.NVarChar, login)
                .input('tagach', sql.NVarChar, tagach)
                .input('pricep', sql.NVarChar, pricep)
                .input('condition', sql.NVarChar, condition)
                .input('statusnew', sql.NVarChar, statusnew)
                .input('oil', sql.NVarChar, oil)
                .input('ingine', sql.NVarChar, ingine)
                .input('sats', sql.NVarChar, sats)
                .input('meliage', sql.NVarChar, meliage)
                .input('pwr', sql.NVarChar, pwr)
                .input('type', sql.NVarChar, type)
                .input('lasttime', sql.NVarChar, lasttime)
                .query(`INSERT INTO list (login, tagach, pricep, condition, statusnew, oil, ingine, sats, meliage, pwr, type, lasttime)
                            VALUES (@login, @tagach, @pricep, @condition, @statusnew, @oil, @ingine, @sats, @meliage, @pwr, @type, @lasttime)`);
            console.log('запись сделана');
        }
        else {
            await pool.request()
                .input('login', sql.NVarChar, login)
                .input('tagach', sql.NVarChar, tagach)
                .input('pricep', sql.NVarChar, pricep)
                .input('condition', sql.NVarChar, condition)
                .input('statusnew', sql.NVarChar, statusnew)
                .input('oil', sql.NVarChar, oil)
                .input('ingine', sql.NVarChar, ingine)
                .input('sats', sql.NVarChar, sats)
                .input('meliage', sql.NVarChar, meliage)
                .input('pwr', sql.NVarChar, pwr)
                .input('type', sql.NVarChar, type)
                .input('lasttime', sql.NVarChar, lasttime)
                .query(`UPDATE list SET tagach=@tagach, pricep=@pricep, condition=@condition, statusnew=@statusnew, oil=@oil, ingine=@ingine, sats=@sats, meliage=@meliage, pwr=@pwr, type=@type, lasttime=@lasttime
                            WHERE login = @login`);
            console.log('апдейт');
        }
    } catch (e) {
        console.log(e);
    }
};

exports.viewListToBase = async (login) => {
    try {
        const pool = await connection;
        const postModel = `SELECT * FROM list WHERE login = @login`;
        const result = await pool.request()
            .input('login', login)
            .query(postModel)
        return result.recordset;

    } catch (e) {
        console.log(e);
    }
}

exports.getObjects = async (login) => {
    try {
        const pool = await connection
        let postModel;
        if (login) {
            postModel = `SELECT idObject, nameObject,imei FROM objects WHERE login=@login`
        }
        else {
            postModel = `SELECT idObject, nameObject,imei FROM objects`
        }

        const result = await pool.request()
            .input('login', login)
            .query(postModel)
        return result.recordset
    }
    catch (e) {
        console.log(e)
    }

}

exports.objectId = async (idw) => {
    try {
        const pool = await connection
        postModel = `SELECT * FROM objects WHERE idObject=@idw`
        const result = await pool.request()
            .input('idw', idw)
            .query(postModel)

        return result.recordset
    }
    catch (e) {
        console.log(e)
    }
}
exports.objectsImei = async (imei) => {
    try {
        const pool = await connection
        postModel = `SELECT idObject FROM objects WHERE imei=@imei`
        const result = await pool.request()
            .input('imei', imei)
            .query(postModel)

        return result.recordset
    }
    catch (e) {
        console.log(e)
    }
}


exports.getParamsKursor = async (idObject) => {
    try {
        const pool = await connection
        const postModel = `SELECT TOP 1 * FROM navtelecom WHERE idObject=@idObject ORDER BY id DESC`
        const result = await pool.request()
            .input('idObject', idObject)
            .query(postModel)
        const record = result.recordset[0];
        if (record !== undefined) {
            const params = Object.keys(record).reduce((acc, key) => {
                if (record[key] !== null) {
                    acc[key] = record[key]
                }
                return acc
            }, {});
            return [params];
        }

    } catch (e) {
        console.log(e);
        throw e;
    }
};



exports.objects = async (arr) => {
    try {
        const pool = await connection
        if (typeof arr === 'string') {
            const postModel = `SELECT * FROM objects WHERE idObject = @idw`
            const result = await pool.request()
                .input('idw', arr)
                .query(postModel)
            return result.recordset
        }
        else {
            const postModel = `SELECT * FROM objects WHERE idObject IN (${arr.map(id => `'${id}'`).join(',')})`;
            const result = await pool.request()
                .query(postModel)
            return result.recordset
        }
    }
    catch (e) {
        console.log(e)
    }
}
exports.getKursorObjects = async (login) => {
    try {
        const pool = await connection
        const postModel = `SELECT * FROM groups WHERE login=@login`
        const result = await pool.request()
            .input('login', login)
            .query(postModel)
        return result.recordset
    }
    catch (e) {
        console.log(e)
    }
}


exports.geoLastIntervalKursor = async (time1, time2, idObject) => {
    try {
        const pool = await connection
        const postModel = `SELECT * FROM navtelecom WHERE idObject=@idObject AND time >= @time2 AND time <= @time1 `
        const result = await pool.request()
            .input('idObject', idObject)
            .input('time2', time2)
            .input('time1', time1)
            .query(postModel)
        return result.recordset
    }
    catch (e) {
        console.log(e)
    }

}
exports.getWialonObjects = async (login) => {
    try {
        const pool = await connection
        const postModel = `SELECT * FROM wialon_groups`
        const result = await pool.request()
            .input('login', login)
            .query(postModel)
        return result.recordset
    }
    catch (e) {
        console.log(e)
    }
}
exports.getIdGroup = async (id, login) => {
    try {
        const pool = await connection;
        const post = `SELECT * FROM groups WHERE login=@login AND id_sub_g=@id OR login=@login AND idg=@id`
        const result = await pool.request()
            .input('login', login)
            .input('id', id)
            .query(post)


        return result.recordset
    }
    catch (e) {
        console.log(e)
    }
}

exports.getGroups = async (login) => {
    try {
        const pool = await connection;
        const postModel = `
      SELECT DISTINCT idg, name_g,id_sub_g
      FROM groups
      WHERE login = @login
    `;
        const postModel2 = `
      SELECT DISTINCT id_sub_g, name_sub_g
      FROM groups
      WHERE login = @login AND id_sub_g IS NOT NULL
    `;
        const result = await pool.request()
            .input('login', login)
            .query(postModel);
        const filteredData = result.recordset.filter(item => {
            const hasMatchingIdSubG = result.recordset.some(d => d.name_g === item.name_g && d.id_sub_g !== null);
            return !hasMatchingIdSubG;
        })
        const result2 = await pool.request()
            .input('login', login)
            .query(postModel2);
        const res = [...filteredData, ...result2.recordset];
        return res;
    } catch (e) {
        console.log(e);
    }
}

exports.setObjectGroupWialon = async (objects) => {
    try {
        const pool = await connection;
        const post = `SELECT idObject FROM wialon_groups WHERE login=@login`
        const result = await pool.request()
            .input('login', objects[0].login)
            .query(post)
        const missingValues = objects.filter(object => {
            return !result.recordset.some(record => record.idObject === object.idObject);
        }).map(object => object.idObject);

        //  console.log(missingValues);
        missingValues.forEach(async elem => {
            const postDEL = `DELETE wialon_groups WHERE login=@login AND idObject =@idObject`
            const result = await pool.request()
                .input('idObject', elem.idObject)
                .input('login', objects[0].login)
                .query(postDEL)
        })
        objects.forEach(async el => {
            // console.log(el)
            const post = `SELECT idObject FROM wialon_groups WHERE login=@login AND idObject=@idObject`
            const result = await pool.request()
                .input('login', el.login)
                .input('idObject', el.idObject)
                .query(post)
            if (result.recordset.length === 0) {
                const post = `
    INSERT INTO wialon_groups (login, data, idg, name_g, id_sub_g, name_sub_g, idObject, nameObject)
    VALUES (@login, @data, @idg, @name_g, @id_sub_g, @name_sub_g, @idObject, @nameObject)
`;
                const result = await pool.request()
                    .input('login', el.login)
                    .input('data', el.data)
                    .input('idg', el.idg)
                    .input('name_g', el.name_g)
                    .input('id_sub_g', null)
                    .input('name_sub_g', null)
                    .input('idObject', el.idObject)
                    .input('nameObject', el.nameObject)
                    .query(post);
            }
            else {
                // console.log(el.name_g, el.nameObject)
                const post = `UPDATE wialon_groups  SET login=@login, data = @data, idg = @idg, name_g=@name_g, idObject=@idObject, nameObject=@nameObject 
            WHERE login = @login AND idObject = @idObject`;
                const result = await pool.request()
                    .input('login', el.login)
                    .input('data', el.data)
                    .input('idg', el.idg)
                    .input('name_g', el.name_g)
                    .input('idObject', el.idObject)
                    .input('nameObject', el.nameObject)
                    .query(post);
            }

        })
        return 'объекты обновлены'
    }
    catch (e) {
        console.log(e)
    }

}
exports.getSensorsWialonToBase = async (arr, login) => {
    console.log(login)
    console.log(arr.length)
    try {
        const pool = await connection;
        if (arr.length > 0) {
            const post = `SELECT sens_name, param_name,idw, value, data FROM wialon_sensors WHERE idw IN (${arr.map(id => `'${id}'`).join(',')})`;
            //console.log(post)
            const result = await pool.request()
                .query(post);
            return result.recordset
        }
        else {
            console.log('массив пуст')
        }
    } catch (error) {
        console.log(error)
    }
}

exports.getSensorsWialonToBaseId = async (idw) => {
    try {
        const pool = await connection;
        const post = `SELECT sens_name, param_name,idw, value FROM wialon_sensors WHERE idw=@idw`;
        const result = await pool.request()
            .input('idw', idw)
            .query(post);
        return result.recordset
    } catch (error) {
        console.log(error)
    }
}


exports.setSensorsWialonToBase = async (login, idw, arr) => {

    const data = Math.floor(new Date().getTime() / 1000)
    try {
        const pool = await connection;
        if (arr.length > 0) {
            for (const entry of arr) {
                const [sens_name, param_name, value] = entry;
                const post = `SELECT * FROM wialon_sensors WHERE login=@login AND idw=@idw AND sens_name=@sens_name`
                const res = await pool.request()
                    .input('sens_name', sens_name)
                    .input('login', login)
                    .input('idw', String(idw))
                    .query(post);
                if (res.recordset.length === 0) {
                    const insertQuery = `INSERT INTO wialon_sensors (data,sens_name, param_name, value, idw, login) VALUES (@data, @sens_name, @param_name, @value, @idw,@login)`;
                    const res = await pool.request()
                        .input('sens_name', sens_name)
                        .input('param_name', param_name)
                        .input('value', value)
                        .input('login', login)
                        .input('idw', String(idw))
                        .input('data', data)
                        .query(insertQuery);
                }
                else {
                    const updateQuery = `UPDATE wialon_sensors SET data=@data, sens_name=@sens_name, param_name=@param_name, value=@value WHERE login=@login AND idw=@idw AND sens_name=@sens_name`;
                    const res = await pool.request()
                        .input('sens_name', sens_name)
                        .input('param_name', param_name)
                        .input('value', value)
                        .input('login', login)
                        .input('idw', String(idw))
                        .input('data', data)
                        .query(updateQuery);
                }

            }
            return 'выполнено'
        }
        else {
            return 'массив для записи пуст'
        }

    }
    catch (e) {
        console.log(e)
    }
}

exports.uniqImeiAndPhone = async (col, value, table, login, id) => {
    console.log('тут')
    console.log(col, value)
    try {
        const pool = await connection;
        const query = `
            SELECT
                CASE
                    WHEN ${col} = @${col} THEN '${col}'
                    ELSE NULL
                END AS matched_column
            FROM ${table}
            WHERE ${col} = @${col} AND login = @login AND id <> @id
        `;
        const result = await pool.request()
            .input(`${col}`, value)
            .input('login', login)
            .input('id', id)
            .query(query);

        return result.recordset;
    } catch (e) {
        console.error(e);
    }
};



exports.validationCloneGroupName = async (id, name, login) => {
    console.log(id, name, login)
    try {
        const pool = await connection;
        const query = `
            SELECT * FROM groups WHERE name_g=@name_g OR name_sub_g=@name_sub_g
                
        `;
        const result = await pool.request()
            .input('name_g', name)
            .input('name_sub_g', name)
            .input('login', login)
            .query(query);

        return result.recordset;



    } catch (e) {
        console.error(e);
    }
}

exports.getIdToRows = async (id, login) => {
    const pool = await connection;
    const query = `
            SELECT * FROM groups WHERE idg=@id OR id_sub_g=@id
                      `;
    const result = await pool.request()
        .input('id', id)
        .input('login', login)
        .query(query);
    return result.recordset
}


exports.deleteIdToRowsTime = async (data, id, login) => {
    console.log(id, login, data)
    const pool = await connection;
    const postDEL = `DELETE groups WHERE login=@login AND idg =@idKey AND data!=@data OR login=@login AND id_sub_g =@idKey AND data!=@data `
    const result = await pool.request()
        .input('idKey', id)
        .input('login', login)
        .input('data', data)
        .query(postDEL)
    return result.recordset
}


exports.updateObject = async (object) => {
    console.log(object)
    try {
        const pool = await connection;
        const updateModel = `UPDATE objects SET data = @data, login = @login,idObject=@idObject,typeDevice=@typeDevice,imei=@imei,adress=@adress,number=@number,nameObject=@nameObject,
         typeObject=@typeObject WHERE login = @login AND idObject = @idObject`;
        const result = await pool.request()
            .input('data', object.data)
            .input('login', object.login)
            .input('idObject', object.idObject)
            .input('imei', object.imei)
            .input('adress', object.adress)
            .input('number', object.number)
            .input('nameObject', object.nameObject)
            .input('typeObject', object.typeObject)
            .input('typeDevice', object.typeDevice)
            .query(updateModel)

        if (result) {
            await databaseService.updateObjectToGroups(object)
            return 'объект обновлен'
        }
    }
    catch (e) {
        console.log(e)
    }

}

exports.updateObjectToGroups = async (object) => {
    console.log(object)
    try {
        const pool = await connection;
        const updateModel = `UPDATE groups SET idObject=@idObject,nameObject=@nameObject WHERE  idObject = @idObject`;
        const result = await pool.request()
            .input('idObject', object.idObject)
            .input('nameObject', object.nameObject)
            .query(updateModel)
    }
    catch (e) {
        console.log(e)
    }

}


exports.updateGroup = async (object, prefix) => {
    try {
        const pool = await connection;
        const query = `INSERT INTO groups (login, data, idg, name_g, id_sub_g,name_sub_g,idObject, nameObject)
            VALUES(@login, @data, @idg, @name_g,@id_sub_g, @name_sub_g,@idObject, @nameObject)`;
        const updateModel = `UPDATE groups SET data = @data, idg = @idg, name_g=@name_g, id_sub_g=@id_sub_g, name_sub_g=@name_sub_g WHERE login = @login AND idg = @id_sub_g`;

        const result = await databaseService.getIdToRows(object.id, object.login)
        object.arraySubg.forEach(async el => {
            //ищем все строки по id подгрупп которые должны быть добавлены
            const results = await databaseService.getIdToRows(el.id_sub_g, object.login)
            const objectsToSub = results.map(e => {
                return { idObject: e.idObject, nameObject: e.nameObject }
            })
            if (results[0].idg === el.id_sub_g) {
                const res = await pool.request()
                    .input('login', object.login)
                    .input('data', object.data)
                    .input('idg', object.id)
                    .input('name_g', object.name)
                    .input('id_sub_g', el.id_sub_g)
                    .input('name_sub_g', el.name_sub_g)
                    .query(updateModel);
            }
            //получаем уникальные строки с объектами которые есть в подгруппах
            if (results[0].id_sub_g === el.id_sub_g) {
                [...new Set(objectsToSub.map(JSON.stringify))].map(JSON.parse).map(async e => {
                    const res = await pool.request()
                        .input('login', object.login)
                        .input('data', object.data)
                        .input('idg', object.id)
                        .input('name_g', object.name)
                        .input('id_sub_g', el.id_sub_g)
                        .input('name_sub_g', el.name_sub_g)
                        .input('idObject', e.idObject)
                        .input('nameObject', e.nameObject)
                        .query(query);
                })
            }
        })
        let idg;
        result.forEach(async e => {
            if (idg !== e.idg) {
                object.arrayObjects.forEach(async it => {
                    const result = await pool.request()
                        .input('login', object.login)
                        .input('data', object.data)
                        .input('idg', prefix === 'sub' ? e.idg : object.id)
                        .input('name_g', prefix === 'sub' ? e.name_g : object.name)
                        .input('id_sub_g', prefix === 'sub' ? object.id : null)//e.id_sub_g)
                        .input('name_sub_g', prefix === 'sub' ? object.name : null)//e.name_sub_g)
                        .input('idObject', it.idObject)
                        .input('nameObject', it.nameObject)
                        .query(query);
                })
                idg = e.idg
            }
            else {
                null
            }
        })
        const twoDimensionalArray = Array.from(
            result.reduce((map, obj) => {
                if (obj.id_sub_g !== null) {
                    const existingSubg = map.get(obj.id_sub_g);
                    if (!existingSubg) {
                        map.set(obj.id_sub_g, {
                            id_sub_g: obj.id_sub_g,
                            name_sub_g: obj.name_sub_g,
                            objects: [],
                        });
                    }
                    map.get(obj.id_sub_g).objects.push(obj);
                }
                return map;
            }, new Map()).values()
        );
        await databaseService.deleteIdToRowsTime(object.data, object.id, object.login)
        twoDimensionalArray.forEach(async item => {
            const res = await databaseService.getIdToRows(item.id_sub_g, object.login)
            console.log(res)
            if (res.length === 0) {
                item.objects.forEach(async e => {
                    const res = await pool.request()
                        .input('login', object.login)
                        .input('data', object.data)
                        .input('idg', item.id_sub_g)
                        .input('name_g', item.name_sub_g)
                        .input('id_sub_g', null)
                        .input('name_sub_g', null)
                        .input('idObject', e.idObject)
                        .input('nameObject', e.nameObject)
                        .query(query);
                })
            }
        })
        return 'Группа изменена';
    } catch (e) {
        console.error(e);
    }
}



exports.lastIdObject = async () => {
    try {
        const pool = await connection
        const postModel = `SELECT TOP 1 idObject FROM objects ORDER BY idObject DESC`
        const result = await pool.request()
            .query(postModel)
        return result.recordset;
    }
    catch (e) {
        console.log(e)
    }
}

exports.lastIdGroup = async () => {
    try {
        const pool = await connection
        const postModel = `SELECT TOP 1 idg FROM groups ORDER BY idg DESC`
        const result = await pool.request()
            .query(postModel)

        const postModel2 = `SELECT TOP 1 id_sub_g FROM groups ORDER BY id_sub_g DESC`
        const res = await pool.request()
            .query(postModel2)

        const id = Math.max(Number(result.recordset[0].idg), Number(res.recordset[0].id_sub_g))
        console.log(result)
        console.log(res)
        return id;
    }
    catch (e) {
        console.log(e)
    }
}

exports.setGroup = async (object) => {
    //  console.log(object)
    const login = object.login
    const time = object.data
    const idg = object.idg
    const name_g = object.name_g
    try {
        const pool = await connection
        const postModel = `
            INSERT INTO groups (login, data, idg, name_g, idObject, nameObject)
            VALUES (@login, @data, @idg, @name_g, @idObject, @nameObject)
        `;
        object.arrayObjects.forEach(async el => {
            const result = await pool.request()
                .input('login', login)
                .input('data', time)
                .input('idg', idg)
                .input('name_g', name_g)
                .input('idObject', el.idObject)
                .input('nameObject', el.nameObject)
                .query(postModel);
        });
        return 'Объект создан'
    } catch (e) {
        console.log(e);
    }
};
exports.setSubGroups = async (subgroups, object) => {
    console.log(subgroups)
    const login = object.login
    const time = object.data
    const idg = object.idg
    const name_g = object.name_g
    try {
        const pool = await connection

        subgroups.forEach(async el => {
            const checkQuery = `
                SELECT *
                FROM groups
                WHERE login = @login AND idg = @idg OR login = @login AND id_sub_g=@idg
            `;
            const checkResult = await pool.request()
                .input('login', login)
                .input('idg', el.id_sub_g)
                .query(checkQuery)
            const objectsToSub = checkResult.recordset.map(e => {
                return { idObject: e.idObject, nameObject: e.nameObject }
            })
            console.log(checkResult.recordset)
            console.log(objectsToSub)
            if (checkResult.recordset[0].idg === el.id_sub_g) {
                console.log('обновляем запись')
                const updateModel = `
                    UPDATE groups
                    SET data = @data,
                        idg = @idg,
                        name_g=@name_g,
                        id_sub_g=@id_sub_g,
                        name_sub_g=@name_sub_g
                    WHERE login = @login AND idg = @id_sub_g
                `;
                checkResult.recordset.forEach(async e => {
                    const result = await pool.request()
                        .input('login', login)
                        .input('data', time)
                        .input('idg', idg)
                        .input('name_g', name_g)
                        .input('id_sub_g', e.idg)
                        .input('name_sub_g', e.name_g)
                        .query(updateModel);
                })
            }
            if (checkResult.recordset[0].id_sub_g === el.id_sub_g) {

                [...new Set(objectsToSub.map(JSON.stringify))].map(JSON.parse).map(async e => {
                    const addModel = `
                     INSERT INTO groups (login, data, idg, name_g, id_sub_g,name_sub_g,idObject, nameObject)
             VALUES (@login, @data, @idg, @name_g, @id_sub_g, @name_sub_g, @idObject, @nameObject)
                 `;
                    const result = await pool.request()
                        .input('login', login)
                        .input('data', time)
                        .input('idg', idg)
                        .input('name_g', name_g)
                        .input('id_sub_g', el.id_sub_g)
                        .input('name_sub_g', el.name_sub_g)
                        .input('idObject', e.idObject)
                        .input('nameObject', e.nameObject)
                        .query(addModel);

                })
            }



        });
        return 'Группа создана'
    } catch (e) {
        console.log(e);
    }
};

exports.saveObject = async (object) => {
    try {
        const pool = await connection
        const postModel = `
            INSERT INTO objects (adress, data, idObject, imei, login, nameObject, number, typeDevice, typeObject)
            VALUES (@adress, @data, @idObject, @imei, @login, @nameObject, @number, @typeDevice, @typeObject)
        `;

        const result = await pool.request()
            .input('adress', object.adress)
            .input('data', object.data)
            .input('idObject', object.idObject)
            .input('imei', object.imei)
            .input('login', object.login)
            .input('nameObject', object.nameObject)
            .input('number', object.number)
            .input('typeDevice', object.typeDevice)
            .input('typeObject', object.typeObject)
            .query(postModel);
        return 'Объект создан'
    } catch (e) {
        console.log(e);
    }
};


exports.deleteObject = async (login, idObject) => {
    console.log(Number(idObject))
    try {
        const pool = await connection
        const post = `DELETE objects WHERE login=@login AND idObject = @idObject`
        const result = await pool.request()
            .input('login', login)
            .input('idObject', Number(idObject))
            .query(post)
        return 'Объект удален'
    }
    catch (e) {
        console.log(e)
    }
}

exports.deleteObjectInGroup = async (login, idObject) => {
    try {
        const pool = await connection
        const post = `DELETE groups WHERE login=@login AND idObject =@idObject`
        const result = await pool.request()
            .input('login', login)
            .input('idObject', idObject)
            .query(post)
        return 'Объект удален из групп'
    }
    catch (e) {
        console.log(e)
    }
}

exports.deleteGroupToBaseGroups = async (login, id) => {
    try {
        const pool = await connection
        const post = `DELETE groups WHERE login=@login AND idg =@id OR login=@LOGIN AND id_sub_g=@id`
        const result = await pool.request()
            .input('login', login)
            .input('id', id)
            .query(post)
        return 'Группа удалена'
    }
    catch (e) {
        console.log(e)
    }
}


exports.eventFindToBase = async (login) => {
    try {
        const pool = await connection;
        const postModel = `SELECT * FROM eventSpam WHERE login =@login`;
        const result = await pool.request()
            .input('login', login)
            .query(postModel)
        return result.recordset;

    } catch (e) {
        console.log(e);
    }
};

exports.viewStructuraToBase = async (idw, t1, t2) => {
    try {
        const pool = await connection
        const postModel = "SELECT * FROM structura WHERE idw=@idw AND data >= @t1 AND data <= @t2";
        const results = await pool.request()
            .input('idw', idw)
            .input('t1', t1[0])
            .input('t2', t2[0])
            .query(postModel)
        return results.recordset
    } catch (e) {
        console.log(e);
    }

};


exports.viewChartDataToBase = async (idw, t1, t2) => {
    const postModel = `SELECT * FROM chartData WHERE idw='${idw}' AND data >= '${t1}' AND data <= '${t2}'`;
    try {
        const pool = await connection
        const results = await pool.query(postModel);
        return results.recordset;

    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.viewSortDataToBase = async (idw, t1, t2) => {

    const postModel = `SELECT * FROM sortData WHERE idw='${idw}' AND time >= '${t1}' AND time <= '${t2}'`;
    try {
        const pool = await connection
        const results = await pool.query(postModel);
        return results.recordset;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/*
exports.viewChartDataToBaseGeo = async (arrayId, t1, t2) => {
    return new Promise((resolve, reject) => {
        try {
            //  const formattedArray = arrayId.map(item => `'${item}'`).join(",");
            const formattedArray = arrayId.map(item => parseFloat(item));
            const postModel = `SELECT idw,data, geo,speed FROM chartData WHERE data >= ${t2.toString()} AND data <= ${t1.toString()} AND idw IN (${formattedArray})`;
            connection.query(postModel, function (err, results) {
                if (err) console.log(err);
                //  console.log(results)
                resolve(results);
            });
        }
        catch (e) {
            console.log(e);
        }
    });
};*/

exports.lostChartDataToBase = async (idw) => {
    try {
        const postModel = `SELECT TOP (1) data FROM chartData WHERE idw = ${idw} ORDER BY data DESC`
        const pool = await connection;
        const results = await pool.request().query(postModel);
        return results.recordset;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

exports.saveStatusToBase = async (activePost, idw, todays, statusTSI, todays2, status) => {
    if (!status) return;

    try {
        let postModel = `SELECT * FROM statusObj WHERE idw=@idw`;
        const pool = await connection;
        let results = await pool.request().input('idw', sql.NVarChar, String(idw)).query(postModel);
        // console.log(results.recordset)
        if (results.recordset.length === 0) {
            const selectBase = `INSERT INTO statusObj(idw, nameCar, time, status, timeIng, statusIng) VALUES (@idw, @nameCar, @time, @status, @timeIng, @statusIng)`;
            await pool.request()
                .input('idw', String(idw))
                .input('nameCar', activePost)
                .input('time', todays)
                .input('status', statusTSI)
                .input('timeIng', todays2)
                .input('statusIng', status)
                .query(selectBase);
        }
        else {
            if (results.recordset[0].status !== statusTSI) {
                postModel = `UPDATE statusObj SET time=@todays, status=@statusTSI WHERE idw=@idw`;
                await pool.request()
                    .input('todays', sql.NVarChar, String(todays))
                    .input('statusTSI', sql.NVarChar, statusTSI)
                    .input('idw', sql.VarChar, String(idw))
                    .query(postModel);
            }
            if (results.recordset[0].statusIng !== status) {
                postModel = `UPDATE statusObj SET timeIng=@todays2, statusIng=@status WHERE idw=@idw`;
                await pool.request()
                    .input('todays2', sql.NVarChar, String(todays2))
                    .input('status', sql.NVarChar, status)
                    .input('idw', sql.VarChar, String(idw))
                    .query(postModel);
            }
        }
    }
    catch (e) {
        console.log(e);
        throw e;
    }
};

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
exports.alarmBase = async (data, tyres, alarm) => {
    console.log('данные по алармам')
    const dannie = data.concat(tyres)
    let val;
    const allSens = await databaseService.ggg(dannie[6])
    const tyress = allSens[dannie[2]]

    alarm !== 'Потеря связи с датчиком' ? val = dannie[3] + ' ' + 'Бар' : val = dannie[4] + '' + 't'
    const res = alarm !== 'Норма' && alarm !== 'Потеря связи с датчиком' ? await databaseService.controllerSaveToBase([{
        event: 'Предупреждение', time: `Время ${dannie[0]}`, tyres: `Колесо: ${tyress}`, //time: `Время ${dannie[0]}`,
        param: `Параметр: ${val}`, alarm: `Описание: ${alarm}`
    }], dannie[6], JSON.parse(dannie[8]), dannie[1], dannie[1]) : 'Норма. В базу не пишем'
    console.log('Предупреждение' + ' ' + res.message)
    const nowDate = Math.round(new Date().getTime() / 1000);
    const id = dannie[6]

    dannie.splice(5, 3)
    // dannie.pop()
    dannie.push(alarm)
    dannie.unshift(nowDate)
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
        const pool = await connection;
        let result = await pool.request().query(selectBase);
        if (result.recordset.length !== 0) {
            null
        }
        else {
            const sqls = `INSERT INTO alarms (idw, unix, data, name, senspressure, bar, temp, geo, alarm) 
    VALUES (@idw, @unix, @data, @name, @senspressure, @bar, @temp, @geo, @alarm)`;
            const pool = await connection;
            await pool.request()
                .input('idw', sql.NVarChar, String(dannie[0]))
                .input('unix', sql.NVarChar, String(dannie[1]))
                .input('data', sql.NVarChar, dannie[2])
                .input('name', sql.NVarChar, dannie[3])
                .input('senspressure', sql.NVarChar, dannie[4])
                .input('bar', sql.NVarChar, String(dannie[5]))
                .input('temp', sql.NVarChar, String(dannie[6]))
                .input('geo', sql.NVarChar, dannie[7])
                .input('alarm', sql.NVarChar, dannie[8])
                .query(sqls);
        }
    }
    catch (e) {
        console.log(e)
    }
}


exports.loadParamsViewList = async (car, el, kursor) => {
    const idw = el
    const pool = await connection;
    const mod = async () => {
        try {
            const selectBase = `SELECT osi, trailer, tyres, type, tsiControll FROM model WHERE idw='${idw}'`
            const result = await pool.query(selectBase)
            if (kursor) {
                const datas = (await databaseService.objects(String(el))).map(e => e.imei)[0]
                return { result: result.recordset, message: car, imei: datas }
            }
            else {
                return { result: result.recordset, message: car }
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const tyr = async () => {
        try {
            const selectBase = `SELECT tyresdiv, pressure, temp, osNumber FROM tyres WHERE idw='${idw}'`
            const result = await pool.query(selectBase)
            if (result.recordset === undefined) {
                return ''
            }
            else {
                return { result: result.recordset, message: car }
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    const dat = async () => {
        try {
            const selectBase = `SELECT name, value, status FROM params WHERE idw='${idw}'`
            const result = await pool.query(selectBase)
            return { result: result.recordset, message: car }
        }
        catch (e) {
            console.log(e)
        }
    }
    const osis = async () => {
        try {
            const selectBase = `SELECT * FROM ifBar WHERE idw='${idw}'`
            const result = await pool.query(selectBase)
            return { result: result.recordset, message: car }
        }
        catch (e) {
            console.log(e)
        }
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
    return [model, models, data, osi, el]

}

exports.dostupObject = async (login) => {
    try {
        const pool = await connection;
        if (isNaN(login)) {
            const selectBase = `SELECT idw FROM userObjects WHERE login='${login}'`
            const results = await pool.query(selectBase)
            const nameCarCheck = results.recordset.map(elem => elem.idw)
            return nameCarCheck
        } else {
            const selectBase = `SELECT login FROM userObjects WHERE idw='${login}'`
            const results = await pool.query(selectBase)
            const nameCarCheck = results.recordset.map(elem => elem.login)
            return nameCarCheck
        }
    }
    catch (e) {
        console.log(e)
    }
}

//забираем из бд параметры по id
exports.paramsToBase = async (idw) => {
    try {
        const pool = await connection
        const selectBase = `SELECT nameCar, name, value, status, time FROM params WHERE idw=@idw`
        const result = await pool.request().input('idw', idw).query(selectBase)
        return result.recordset
    }
    catch (e) {
        console.log(e)
    }

}

exports.iconFindtoBase = async (idw) => {
    try {
        const pool = await connection
        const postModel = `SELECT params, coef, icons FROM icon WHERE idw=@idw`
        const result = await pool.request().input('idw', idw).query(postModel)
        return result.recordset
    }
    catch (e) {
        console.log(e)
    }

}

module.exports.alarmFindtoBase = async (idw, array) => {
    try {
        const pool = await connection
        const formattedArray = array.map(item => `'${item}'`).join(","); // Форматируем массив под SQL запрос
        const sqls1 = `SELECT data, senspressure, bar, temp, alarm FROM alarms WHERE idw='${idw}' AND senspressure IN (${formattedArray})`
        const results = await pool.query(sqls1)
        if (results.recordset.length === 0) {
            return []
        }
        else {
            return results.recordset
        }
    }
    catch (e) {
        console.log(e)
    }
}
exports.quantityFindToBase = async (login, quantity) => {
    try {
        const pool = await connection;
        const selectBase = `SELECT quantity FROM viewLogs WHERE login='${login}'`
        const results = await pool.query(selectBase);
        return results.recordset
    }
    catch (e) {
        console.log(e)
    }
}
exports.quantitySaveToBase = async (login, quantity) => {
    try {
        const pool = await connection;
        const selectBase = `SELECT login FROM viewLogs WHERE login='${login}'`;
        const results = await pool.query(selectBase);
        if (results.recordset.length === 0) {
            const arr = [[login, 0]];
            const insertQuery = `INSERT INTO viewLogs(login, quantity) VALUES ?`;
            await pool.query(insertQuery, [arr]);
            return { message: 'quntity добавлено' };
        }
        if (quantity !== undefined) {
            const updateModel = `UPDATE viewLogs SET quantity='${quantity}' WHERE login='${login}'`;
            await pool.query(updateModel);
            return { message: 'quntity обновлено' };
        }
        return { message: 'quntity старое' };

    } catch (e) {
        console.log(e);
        throw e; // Это прервет выполнение функции и выбросит ошибку наверх.
    }
}
exports.updateModelSaveToBase = async (idw, massiv, nameCar, gosp, gosp1, frontGosp, frontGosp1, type, tsiControll) => {
    const pool = await connection;
    const promises = massiv.map(async el => {
        el.push(gosp)
        el.push(gosp1)
        el.push(frontGosp)
        el.push(frontGosp1)
        el.push(type)
        el.push(tsiControll)
        el.unshift(nameCar)
        el.unshift(idw)
        try {
            const selectBase = `SELECT osi FROM model WHERE idw='${el[0]}' AND osi='${el[2]}'`
            const results = await pool.query(selectBase)
            if (results.recordset.length === 0) {
                const selectBase = `INSERT INTO model(idw, nameCar, osi, trailer, tyres, gosp, gosp1, frontGosp, frontGosp1,type, tsiControll) VALUES(@idw,@nameCar,@osi,@trailer,@tyres,@gosp,@gosp1,@frontGosp,@frontGosp1,@type,@tsiControll)`
                const results = await pool.request()
                    .input('idw', idw)
                    .input('nameCar', nameCar)
                    .input('osi', String(el[2]))
                    .input('trailer', el[3])
                    .input('tyres', String(el[4]))
                    .input('gosp', gosp)
                    .input('gosp1', gosp1)
                    .input('frontGosp', frontGosp)
                    .input('frontGosp1', frontGosp1)
                    .input('type', type)
                    .input('tsiControll', tsiControll)
                    .query(selectBase)
                return { message: 'успех' }
            }
            if (results.length > 0) {
                const postModel = `UPDATE model SET idw='${el[0]}', nameCar='${el[1]}',  osi='${String(el[2])}', trailer='${el[3]}', tyres='${String(el[4])}',gosp='${gosp}',gosp1='${gosp1}', frontGosp='${frontGosp}', frontGosp1='${frontGosp1}', type='${type}',tsiControll='${tsiControll}' WHERE idw='${el[0]}' AND osi='${el[2]}'`
                const results = await pool.request()
                    .query(postModel)
                return { message: 'апдейт' }
            }
        }

        catch (e) {
            console.log(e)

        }
    })
    return Promise.all(promises)
}

exports.tyresSaveToBase = async (nameCar, tyres, idw) => {
    const pool = await connection;
    const promises = tyres.map(async el => {
        el.unshift(nameCar);
        el.unshift(idw);
        try {
            const results = await pool.query(
                `SELECT tyresdiv FROM tyres WHERE idw='${el[0]}' AND tyresdiv='${el[2]}'`)
            if (results.recordset.length === 0) {
                const results = await pool.request()
                    .input('idw', el[0])
                    .input('nameCar', el[1])
                    .input('tyresdiv', el[2])
                    .input('pressure', el[3])
                    .input('temp', el[4])
                    .input('osNumber', el[5])
                    .query(
                        'INSERT INTO tyres(idw, nameCar, tyresdiv, pressure, temp, osNumber) VALUES(@idw, @nameCar,@tyresdiv,@pressure,@temp,@osNumber)')
            }
            if (results.recordset.length > 0) {
                await pool.query(`UPDATE tyres SET idw='${el[0]}', nameCar='${el[1]}', tyresdiv='${el[2]}', pressure='${el[3]}', temp='${el[4]}', osNumber='${el[5]}' WHERE idw='${el[0]}' AND tyresdiv='${el[2]}'`)
            }
        }
        catch (e) {
            console.log(e);
        }
    })
    return Promise.all(promises);
}


exports.deleteModelToBase = async (idw) => {
    try {
        const pool = await connection;
        const postModel = `DELETE FROM model WHERE idw='${idw}'`
        await pool.query(postModel)
    }
    catch (e) {
        console.log(e)
    }
}

exports.deleteTyresToBase = async (idw) => {
    try {
        const pool = await connection;
        const postModel = `DELETE FROM tyres WHERE idw='${idw}'`
        await pool.query(postModel)
    }
    catch (e) {
        console.log(e)
    }
}


exports.modalBarSaveToBase = async (value) => {
    const pool = await connection;
    try {
        const selectBase = `SELECT nameCar, idOs FROM ifBar WHERE idw='${value[0][0]}' AND idOs='${value[0][2]}'`
        const results = await pool.query(selectBase)
        if (results.recordset.length === 0) {
            const sqls = `INSERT INTO  ifBar(idw, nameCar, idOs, norma, dnmin, dnmax, dnn, dvn, knd, kvd) VALUES(@idw,@nameCar,@idOs,@norma,@dnmin,@dnmax,@dnn,@dvn,@knd,@kvd)`;
            await pool.request()
                .input('idw', value[0][0])
                .input('nameCar', value[0][1])
                .input('idOs', value[0][2])
                .input('norma', value[0][3])
                .input('dnmin', value[0][4])
                .input('dnmax', value[0][5])
                .input('dnn', value[0][6])
                .input('dvn', value[0][7])
                .input('knd', value[0][8])
                .input('kvd', value[0][9])
                .query(sqls)
            return 'Данные добавлены'
        }
        if (results.recordset.length > 0) {
            const sqls = `UPDATE ifBar SET idw='${value[0][0]}', nameCar='${value[0][1]}', idOs='${value[0][2]}', norma='${value[0][3]}', dnmin='${value[0][4]}', 
                    dnmax='${value[0][5]}',dnn='${value[0][6]}', dvn='${value[0][7]}', knd='${value[0][8]}', kvd='${value[0][9]}' WHERE idw='${value[0][0]}' AND idOs='${value[0][2]}'`;
            await pool.query(sqls)
            return 'Данные обновлены'
        }
    }
    catch (e) {
        console.log(e)
    }
}

exports.deleteBarToBase = async (idw) => {
    try {
        const pool = await connection;
        const postModel = `DELETE FROM ifBar WHERE idw=@idw`
        const results = await pool.request().input('idw', idw).query(postModel)
        return results.recordset
    }
    catch (e) {
        console.log(e)
    }
}

exports.controllerSaveToBase = async (arr, id, geo, group, name, start) => {
    const idw = id
    const date = new Date()
    const time = (date.getTime() / 1000).toFixed(0)
    const newdata = JSON.stringify(arr)
    const geoLoc = JSON.stringify(geo)
    const res = await databaseService.logsSaveToBase(newdata, time, idw, geoLoc, group, name, start)
    if (res.message === 'Событие уже существует в базе логов') {
        null
    }
    else {
        const mess = await helpers.processing(arr, time, idw, geoLoc, group, name, start)
        const objFuncAlarm = {
            email: { fn: send.sendEmail },
            what: { fn: send.sendWhat },
            teleg: { fn: send.sendTeleg },
            sms: { fn: send.sendSMS }
        }
        const event = mess.msg[0].event
        mess.logins.forEach(async el => {
            const itog = await this.eventFindToBase(el)
            if (itog.length !== 0) {
                delete itog[0].id
                delete itog[0].login
                delete itog.alert
                const viewObj = itog[0]
                for (let key in viewObj) {
                    viewObj[key] = JSON.parse(viewObj[key]);
                    viewObj[key] = viewObj[key].map(el => {
                        if (el === 'Давление' || el === 'Температура') {
                            return 'Предупреждение';
                        }
                        return el;
                    });
                }
                for (let key in viewObj) {
                    viewObj[key].forEach(e => {
                        e === event ? objFuncAlarm[key]?.fn(mess.msg[0], el) : null;
                    });
                }
            }
            else {
                console.log('нет данных')
            }
        })
    }
    return res
}

exports.logsSaveToBase = async (arr, time, idw, geo, group, name, start) => {
    try {
        const pool = await connection;
        let checkExistQuery;
        if (start) {
            checkExistQuery = `SELECT * FROM logs WHERE litragh='${start}' AND idw='${idw}'`
        }
        else {
            //    console.log(arr, name)
            checkExistQuery = `SELECT * FROM logs WHERE content='${arr}'AND idw='${idw}'`
        }
        const checkResults = await pool.request().query(checkExistQuery);
        //  console.log(checkResults.recordset)
        if (checkResults.recordset.length > 0) {
            return { message: 'Событие уже существует в базе логов' };
        } else {
            let postModel;
            if (start) {
                postModel = `INSERT INTO logs(idw, time, content, geo, litragh, groups, name) VALUES(${idw}, ${time}, '${arr}','${geo}','${start}','${group}','${name}')`
            }
            else {
                postModel = `INSERT INTO logs(idw, time, content, geo,groups, name) VALUES(${idw}, ${time}, '${arr}','${geo}','${group}','${name}')`
            }
            await pool.request().query(postModel);
            return { message: 'Событие сохранено в базу логов' };
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}

exports.logsFindToBase = async (id) => {
    if (id.length !== 0) {
        const postModel = `SELECT * FROM logs WHERE idw IN (${id.join(',')})`;
        try {
            const pool = await connection
            const result = await pool.query(postModel);
            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}
exports.logsFindToBaseId = async (t1, t2, idw) => {
    if (idw.length !== 0) {
        const postModel = `SELECT * FROM logs WHERE time >= ${t2.toString()} AND time <= ${t1.toString()} AND idw=${String(idw)}`;
        try {
            const pool = await connection
            const result = await pool.query(postModel);
            return result.recordset
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}
exports.alarmFindToBaseId = async (t1, t2, idw) => {
    if (idw.length !== 0) {
        const postModel = `SELECT data, alarm, bar, senspressure, geo FROM alarms WHERE unix >= ${t2} AND unix <= ${t1} AND idw=${String(idw)}`;
        try {
            const pool = await connection
            const result = await pool.query(postModel);
            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
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

module.exports.saveToBaseProfil = async (mass) => {
    try {
        const pool = await connection;
        const postModel = `INSERT INTO profil (uniqId, login, role, email, phone) VALUES (@uniqId,@login,@role,@email,@phone)`;
        const results = await pool.request()
            .input('uniqId', mass[0])
            .input('login', mass[1])
            .input('role', mass[2])
            .input('email', mass[3])
            .input('phone', mass[4])
            .query(postModel);
        return { result: results };
    } catch (err) {
        console.log(err);
    }
};
module.exports.deleteToBaseProfil = async (uniqId) => {
    const pool = await connection;
    try {
        const selectBase = `DELETE FROM profil WHERE uniqId =@uniqId`;
        const results = await pool.request().input('uniqId', uniqId).query(selectBase);
        return ({ status: 200, result: results.recordset, message: `Пользователь удален` })
    }
    catch (e) {
        console.log(e)
    }

}


module.exports.findToBaseProfil = async (login) => {
    try {
        const postModel = `SELECT * FROM profil WHERE login='${login}'`
        const pool = await connection
        const results = await pool.request().query(postModel)
        return results.recordset

    }
    catch (e) {
        console.log(e)
    }
}

module.exports.tarirViewToBase = async (idw) => {
    try {
        const pool = await connection;
        const postModel = `SELECT * FROM tarir WHERE idx=@idw`
        const results = await pool.request().input('idw', idw).query(postModel)
        return results.recordset
    }
    catch (e) {
        console.log(e)
    }
}

exports.modelViewToBase = async (idw) => {
    try {
        const selectBase = `SELECT idw, nameCar, osi, trailer,tyres, gosp, gosp1, frontGosp, frontGosp1, type, tsiControll FROM model WHERE  idw = @idw`;
        const pool = await connection;
        const results = await pool.request().input('idw', String(idw)).query(selectBase)
        return results.recordset;
    }
    catch (err) {
        console.error(err);
        throw err; // Чтобы ошибка была видна извне функции
    }
}

exports.tyresViewToBase = async (idw) => {
    try {
        const selectBase = `SELECT tyresdiv, pressure,temp, osNumber FROM tyres WHERE idw=@idw`;
        const pool = await connection;
        const results = await pool.request().input('idw', sql.Int, idw).query(selectBase);
        return results.recordset;
    } catch (err) {
        console.error(err);
        throw err; // Чтобы ошибка была видна извне функции
    }
};

exports.barViewToBase = async (idw, count) => {
    try {
        const pool = await connection;
        let selectBase;
        if (count) {
            selectBase = `SELECT * FROM ifBar WHERE  idw = @idw AND idOs = @count`
            const results = await pool.request().input('idw', idw).input('count', count).query(selectBase);
            return results.recordset;
        }
        else {
            selectBase = `SELECT * FROM ifBar WHERE  idw = @idw`
            const results = await pool.request().input('idw', idw).query(selectBase);
            return results.recordset;
        }
    }
    catch (err) {
        console.error(err);
        throw err; // Чтобы ошибка была видна извне функции
    }
}

exports.iconSaveToBase = async (activePost, param, coef, id, idw) => {
    try {
        const selectBase = `SELECT icons FROM icon WHERE idw=@idw AND icons=@icons`;
        const pool = await connection;
        let results = await pool.request()
            .input('idw', sql.Int, idw)
            .input('icons', sql.VarChar, id)
            .query(selectBase);

        if (results.recordset.length === 0) {
            const postModel = `INSERT INTO icon(idw, nameCar, params, coef, icons) 
                               VALUES(@idw, @activePost, @param, @coef, @icons)`;
            results = await pool.request()
                .input('idw', sql.Int, idw)
                .input('activePost', sql.VarChar, activePost)
                .input('param', sql.VarChar, param)
                .input('coef', sql.VarChar, coef)
                .input('icons', sql.VarChar, id)
                .query(postModel);
        }
        else {
            const sqlUpdate = `UPDATE icon SET  idw=@idw, nameCar=@activePost, params=@param,
                              coef=@coef, icons=@icons WHERE  idw=@idw AND icons=@icons`;
            results = await pool.request()
                .input('idw', sql.Int, idw)
                .input('activePost', sql.VarChar, activePost)
                .input('param', sql.VarChar, param)
                .input('coef', sql.VarChar, coef)
                .input('icons', sql.VarChar, id)
                .query(sqlUpdate);
        }
        return results;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

exports.saveTechToBase = async (value, add) => {
    try {
        const pool = await connection;
        console.log(add ? 'дата есть' : 'даты нет');
        const sql = add
            ? `INSERT INTO  tyresBase(idw, dataAdd, identificator, nameCar, typeOs, numberOs, idTyres, marka,
                model,
                psi,
                changeBar,
                probegNow,
                dateInstall,
                probegPass,
                dateZamer, N1, N2, N3, N4 ,maxMM) VALUES?`
            : `INSERT INTO  tyresBase(idw, identificator, nameCar, typeOs, numberOs, idTyres, marka,
                model,
                psi,
                changeBar,
                probegNow,
                dateInstall,
                probegPass,
                dateZamer, N1, N2, N3, N4 ,maxMM) VALUES?`;
        const results = await pool.request()
            .input('value', sql.TVP, value)
            .query(sql);
        return 'Данные добавлены';
    } catch (err) {
        console.error(err);
        throw err;
    }
};

exports.techViewToBase = async (nameCar, count, idw) => {
    try {
        const selectBase = `SELECT marka, model, identificator, psi, changeBar, probegNow, dateInstall, probegPass, dateZamer, N1, N2, N3, N4, maxMM FROM tyresBase WHERE idw=@idw AND idTyres=@count`
        const pool = await connection
        const results = await pool.request().input('idw', sql.Int, idw).input('count', sql.Int, count).query(selectBase)
        return results.recordset
    } catch (err) {
        console.error(err)
        throw err
    }
}


exports.techViewAllToBase = async (idw) => {
    try {
        const selectBase = `SELECT * FROM tyresBase WHERE idw=@idw`
        const pool = await connection
        const results = await pool.request().input('idw', sql.Int, idw).query(selectBase)
        return results.recordset
    } catch (err) {
        console.error(err)
        throw err
    }
}

exports.summaryToBase = async (idw, arr, data) => {
    const value = []
    value.push(idw)
    value.push(data)
    value.push(arr.type)
    value.push(arr.nameCar)
    value.push(arr.job)
    value.push(arr.probeg)
    value.push(arr.rashod)
    value.push(arr.rashod)
    value.push(arr.lifting ? arr.lifting : 0)
    value.push(arr.moto)
    value.push(arr.prostoy)
    value.push(arr.medium)
    value.push(arr.hhOil ? arr.hhOil : 0)
    value.push(arr.group)
    //  console.log(arr)
    try {
        const selectBase = `SELECT data, idw FROM summary WHERE idw=@idw AND data=@data`
        const pool = await connection
        const results = await pool.request().input('idw', sql.Int, idw).input('data', sql.NVarChar, data).query(selectBase)
        if (results.recordset.length === 0) {
            const sqls = `INSERT INTO  summary(idw, data, type, nameCar, jobTS, probeg, rashod, zapravka, dumpTrack,moto, prostoy, medium, oilHH, company) VALUES (@idw, @data, @type, @nameCar, @jobTS, @probeg, @rashod, @zapravka, @dumpTrack, @moto, @prostoy, @medium, @oilHH, @company)`;
            await pool.request()
                .input('idw', idw)
                .input('data', data)
                .input('type', arr.type)
                .input('nameCar', arr.nameCar)
                .input('jobTS', arr.job)
                .input('probeg', arr.probeg)
                .input('rashod', arr.rashod)
                .input('zapravka', arr.zapravka)
                .input('dumpTrack', arr.lifting)
                .input('moto', arr.moto)
                .input('prostoy', arr.prostoy)
                .input('medium', arr.medium)
                .input('oilHH', arr.hhOil)
                .input('company', arr.group)
                .query(sqls)
            return { message: 'данные добавлены' }
        }
        else {
            const sqls = `UPDATE summary SET  idw='${idw}',data='${data}', type='${arr.type}', nameCar='${arr.nameCar}', jobTS='${arr.job}',
                     probeg='${arr.probeg}', rashod='${arr.rashod}',zapravka='${arr.zapravka}',dumpTrack='${arr.lifting}',moto='${arr.moto}',
                     prostoy='${arr.prostoy}',medium='${arr.medium}',oilHH='${arr.hhOil}',company='${arr.group}'  WHERE  idw='${idw}' AND data='${data}'`;

            await pool.request().query(sqls)
            return { message: 'данные обновлены' }
        }
    } catch (err) {
        console.error(err)
        throw err
    }
}

exports.group = async (idw) => {
    try {
        const selectBase = `SELECT company FROM summary WHERE idw=@idw`
        const pool = await connection
        const results = await pool.request().input('idw', sql.Int, idw).query(selectBase)
        return results.recordset
    } catch (err) {
        console.error(err)
        throw err
    }
}


module.exports.summaryYestodayToBase = async (data, arrayId) => {
    // console.log(data, arrayId)
    if (!arrayId.length) {
        return;
    }
    const pool = await connection
    if (data.length === 1) {
        try {
            // Создание строки с placeholder'ами для каждого id из arrayId
            const placeholders = arrayId.map((_, i) => '@id' + i).join(',');
            const selectBase = `SELECT * FROM summary WHERE idw IN (${placeholders}) AND data=@data`;
            const request = pool.request();
            // Добавляем данные для каждого элемента из arrayId
            arrayId.forEach((id, i) => request.input('id' + i, sql.Int, id));
            // Добавляем данные для @data
            request.input('data', sql.VarChar, data[0]);
            const results = await request.query(selectBase);
            //  console.log(results.recordset)
            return results.recordset;
        } catch (e) {
            console.error(e);
        }
    } else {
        try {
            const placeholders = arrayId.map((_, i) => '@id' + i).join(',');
            const selectBase = `SELECT * FROM summary WHERE idw IN (${placeholders}) AND CAST(data AS DATE) >= @start AND CAST(data AS DATE) <= @end`;
            const request = pool.request();
            arrayId.forEach((id, i) => request.input('id' + i, sql.Int, id));
            request.input('start', sql.NVarChar, data[0])
            request.input('end', sql.NVarChar, data[1])
            const results = await request.query(selectBase);
            //  console.log(results.recordset)
            return results.recordset;
        } catch (e) {
            console.error(e);
        }
    }
};

module.exports.sumIdwToBase = async (data, idw) => {
    const pool = await connection
    if (data.length === 1) {
        try {
            const selectBase = "SELECT * FROM summary WHERE idw=@idw AND data=@data";
            const results = await pool.request()
                .input('idw', idw)
                .input('data', data[0])
                .query(selectBase)
            return results.recordset
        } catch (e) {
            console.log(e);

        }
    }
    else {
        try {
            const selectBase = "SELECT * FROM summary WHERE idw=@idw AND CAST(data AS DATE) >= @start AND CAST(data AS DATE) <= @end"
            const results = await pool.request()
                .input('idw', idw)
                .input('start', data[0])
                .input('end', data[1])
                .query(selectBase)
            return results.recordset
        } catch (e) {
            console.log(e);
        }
    }
};


exports.saveDataNavtelecomToBase = async (mass) => {
    const sqls = `INSERT INTO chartData(idw, nameCar, data, time, speed, sats, geo, curse, sens, allSensParams) VALUES (@idw, @nameCar, @data, @time, @speed, @sats, @geo, @curse, @sens, @allSensParams)`;
    const pool = await connection;
    for (let i = 0; i < mass.length; i++) {
        try {
            await pool.request()
                .input('idw', sql.NVarChar, mass[i][0])
                .input('nameCar', sql.NVarChar, mass[i][1])
                .input('data', sql.NVarChar, mass[i][2])
                .input('time', sql.NVarChar, (mass[i][3]))
                .input('speed', sql.NVarChar, mass[i][4])
                .input('sats', sql.NVarChar, mass[i][5])
                .input('geo', sql.NVarChar, mass[i][6])
                .input('curse', sql.NVarChar, mass[i][7])
                .input('sens', sql.NVarChar, mass[i][8])
                .input('allSensParams', sql.NVarChar, mass[i][9])
                .query(sqls);
        }
        catch (error) {
            console.log(error);
        }
    }
};





