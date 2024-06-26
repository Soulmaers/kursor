
const { connection, sql } = require('../config/db')
const databaseService = require('./database.service');
const helpers = require('./helpers.js')
const send = require('./send.service.js');

const getEvent = require('../controllers/bitrix.controller.js')
const { y } = require('pdfkit');


exports.createIndexDataToDatabase = async () => {
    const selectBase = `CREATE INDEX idx_id ON alarms(idw, senspressure)`
    connection.query(selectBase, function (err, results) {
        if (err) console.log(err);
    })
}


//сохраняем в базу параметры и обновляем их
exports.saveDataToDatabase = async (name, idw, port, param, time) => {
    //  console.log(name, idw, param, time)
    param.forEach(el => {
        el.unshift(name)
        el.unshift(idw)
        el.push('new')
        el.push(time)
        el.push(port)
    })
    try {
        const selectBase = `SELECT name FROM params WHERE idw='${String(idw)}' AND port='${String(port)}'`
        const pool = await connection;
        let result = await pool.request().query(selectBase);
        if (result.recordset.length === 0) {
            for (let el of param) {
                const sqls = `INSERT INTO params(idw, nameCar, name, value, status, time, port) VALUES (@idw, @nameCar, @name,  @value, @status, @time,@port)`;
                const pool = await connection;
                await pool.request()
                    .input('idw', String(el[0]))
                    .input('nameCar', String(el[1]))
                    .input('name', String(el[2]))
                    .input('value', String(el[3]))
                    .input('status', String(el[4]))
                    .input('time', String(el[5]))
                    .input('port', String(el[6]))
                    .query(sqls);
            }
        }
        else if (result.recordset.length > 0) {
            const mas = [];
            result.recordset.forEach(el => mas.push(el.name));
            const paramName = [];
            param.forEach(el => paramName.push(el[2]));
            for (let el of param) {
                if (mas.includes(el[2])) {
                    const sqlUpdate = `UPDATE params SET idw='${String(idw)}', nameCar='${name}', port='${String(port)}',name='${el[2]}',
                    value='${el[3]}', status='true',time='${el[5]}'  WHERE idw='${String(idw)}' AND name='${el[2]}' AND port='${String(port)}'`;
                    const pool = await connection;
                    await pool.request().query(sqlUpdate);


                } else if (!mas.includes(el[2])) {
                    try {
                        const sqlInsert = `INSERT INTO params(idw, nameCar, name, value, status, time, port) VALUES (@idw, @nameCar, @name, @value, @status, @time, @port)`;
                        const pool = await connection;
                        await pool.request()
                            .input('idw', String(idw))
                            .input('nameCar', String(name))
                            .input('name', String(el[2]))
                            .input('value', String(el[3]))
                            .input('status', 'new')
                            .input('time', String(el[5]))
                            .input('port', String(el[6]))
                            .query(sqlInsert);
                    } catch (e) {
                        console.log(el)
                    }
                }
            }
            for (let el of mas) {
                if (!paramName.includes(el)) {
                    const sqlUpdateStatus = `UPDATE params SET  status='false' WHERE idw='${String(idw)}' AND name='${el}' AND port='${String(port)}'`;
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
    //  console.log('структура')
    try {
        const postModel = `SELECT info FROM structura WHERE data = @data AND idw = @idw`;
        const pool = await connection;
        const results = await pool.request().input('data', data).input('idw', idw).query(postModel);
        if (results.recordset.length === 0) {
            const sql = `INSERT INTO structura (data, idw, info) VALUES (@data, @idw, @info)`;
            await pool.request().input('data', data).input('idw', idw).input('info', info).query(sql);
            // console.log('запись сделана')
        }
        else {
            const postModel = `UPDATE structura  SET data=@data,idw=@idw,info=@info WHERE data = @data AND idw = @idw`
            await pool.request().input('data', data).input('idw', idw).input('info', info).query(postModel);
            //  console.log('апдейт')
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
        postModel = `SELECT idObject, nameObject,imei FROM object_table WHERE port!='wialon'`
        const result = await pool.request()
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
        postModel = `SELECT idObject FROM object_table WHERE imei=@imei`
        const result = await pool.request()
            .input('imei', imei)
            .query(postModel)

        return result.recordset
    }
    catch (e) {
        console.log(e)
    }
}
exports.objectsWialonImei = async (imei) => {
    try {
        const pool = await connection
        postModel = `SELECT idObject FROM object_table WHERE imei=@imei`
        const result = await pool.request()
            .input('imei', imei)
            .query(postModel)

        return result.recordset
    }
    catch (e) {
        console.log(e)
    }
}

exports.getMeta = async (idObject, port, imei) => {
    let table;
    if (port === '20163') {
        table = 'wialon_retranslation';
    } else if (port === '20332') {
        table = 'wialon_ips';
    } else if (port === '21626' || !port) {
        table = 'navtelecom';
    } else if (port === 'wialon' || !port) {
        table = 'wialon_origin';
    } else {
        return [];
    }
    try {
        const pool = await connection;
        const postModel = `SELECT TOP (1) * FROM ${table} WHERE idObject =@idw AND imei=@imei ORDER BY id DESC`
        const result = await pool.request()
            .input('idw', idObject)
            .input('imei', imei)
            .query(postModel)
        //  console.log(result.recordset)
        const res = result.recordset.map(obj => {
            const newObj = {};
            for (const key in obj) {
                if (obj[key] !== null) {
                    newObj[key] = obj[key];
                }
            }
            return newObj;
        });
        return res;
    } catch (e) {
        console.log(imei)
        console.log(e);
        return [];
    }
}



exports.getLastTimeMessage = async (idw) => {
    try {
        const pool = await connection
        const postModel = `SELECT TOP (1) time_reg FROM wialon_origin WHERE idObject = ${idw} ORDER BY time_reg DESC`
        const result = await pool.request()
            .input('idObject', String(idw))
            .query(postModel)
        return result.recordset;

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
        const postModel = login ? `SELECT * FROM groups WHERE login=@login` : `SELECT * FROM groups`
        const result = await pool.request()
            .input('login', login)
            .query(postModel)
        return result.recordset
    }
    catch (e) {
        console.log(e)
    }
}


exports.geoLastInterval = async (time1, time2, idw) => {
    try {
        const pool = await connection
        const postModel = `SELECT * FROM globalStor WHERE idw=@idw AND last_valid_time >= @time1 AND last_valid_time <= @time2 `
        const result = await pool.request()
            .input('idw', idw)
            .input('time2', String(time2))
            .input('time1', String(time1))
            .query(postModel)
        if (result.recordset.length === 0) {
            return []
        }
        else {
            return result.recordset
        }
    }
    catch (e) {
        console.log(e)
    }

}
exports.getParamsToPressureAndOilToBase = async (time1, time2, idw, columns, num) => {
    const value = columns.filter(e => e !== null)
    try {
        const pool = await connection;
        const selectedTColumnsTest = value.join(", ")
        const postModel = `
            SELECT ${selectedTColumnsTest}
            FROM globalStor
            WHERE idw=@idw AND last_valid_time >= @time1 AND last_valid_time <= @time2
        `;
        const postModel2 = `
        WITH NumberedRows AS (
            SELECT 
                ${selectedTColumnsTest}, 
                ROW_NUMBER() OVER (ORDER BY last_valid_time) AS RowNum
            FROM globalStor
            WHERE idw = @idw AND last_valid_time >= @time1 AND last_valid_time <= @time2
        )
        SELECT *
        FROM NumberedRows
        WHERE RowNum % 2 = 0;
        `;
        const result = await pool.request()
            .input('idw', String(idw))
            .input('time2', String(time2))
            .input('time1', String(time1))
            .query(num === 0 ? postModel : postModel2);
        return result.recordset.length ? result.recordset : [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

exports.getWialonObjects = async () => {

    try {
        const pool = await connection
        const postModel = `SELECT * FROM object_table` //wialon_groups
        const result = await pool.request()
            .query(postModel)
        return result.recordset
    }
    catch (e) {
        console.log(e)
    }
}
exports.getObjectsId = async (idw) => {
    console.log(idw)
    try {
        const pool = await connection
        const postModel = `SELECT * FROM object_table WHERE idObject=@idw`
        const result = await pool.request()
            .input('idw', idw)
            .query(postModel)
        console.log(result.recordset)
        return result.recordset
    }
    catch (e) {
        console.log(e)
    }
}



exports.getIdGroup = async (id, login) => {
    try {
        const pool = await connection;
        const post = `SELECT * FROM object_table WHERE  idg=@id`
        const result = await pool.request()
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



exports.setObjectGroup = async (objects) => {
    try {
        const port = 'wialon'
        const pool = await connection;
        const post = `SELECT idObject FROM object_table`
        const result = await pool.request()
            .input('login', objects[0].login)
            .query(post)
        const missingValues = result.recordset.filter(record => {
            return !objects.some(object => object.idObject === record.idObject);
        }).map(record => record.idObject);
        for (const elem of missingValues) {
            const postDEL = `DELETE FROM object_table WHERE idObject =@idObject AND port=@port`;
            await pool.request()
                .input('idObject', elem)
                .input('login', objects[0].login)
                .input('port', port)
                .query(postDEL);
        }
        for (let el of objects) {
            // objects.forEach(async el => {
            const post = `SELECT idObject FROM object_table WHERE idObject=@idObject AND port=@port`
            const result = await pool.request()
                .input('login', el.login)
                .input('idObject', el.idObject)
                .input('port', port)
                .query(post)
            if (result.recordset.length === 0) {
                const post = `
    INSERT INTO object_table (login, data, idg, name_g, port, idObject, nameObject, imei,phone)
    VALUES (@login, @data, @idg, @name_g,@port, @idObject, @nameObject,@imei, @phone)
`;
                const result = await pool.request()
                    .input('login', el.login)
                    .input('data', el.data)
                    .input('idg', el.idg)
                    .input('name_g', el.name_g)
                    .input('idObject', el.idObject)
                    .input('nameObject', el.nameObject)
                    .input('imei', el.imei)
                    .input('phone', el.phone)
                    .input('port', port)
                    .query(post);
            }
            else {
                // console.log(el.name_g, el.nameObject)
                const post = `UPDATE object_table  SET login=@login, port=@port,data = @data, idg = @idg, name_g=@name_g, idObject=@idObject, nameObject=@nameObject,imei=@imei,phone=@phone
            WHERE idObject = @idObject AND port=@port`;
                const result = await pool.request()
                    .input('login', el.login)
                    .input('data', el.data)
                    .input('idg', el.idg)
                    .input('name_g', el.name_g)
                    .input('idObject', el.idObject)
                    .input('nameObject', el.nameObject)
                    .input('imei', el.imei)
                    .input('phone', el.phone)
                    .input('port', port)
                    .query(post);
            }

        }
        return 'объекты обновлены'
    }
    catch (e) {
        console.log(e)
    }

}
exports.getSensStorMeta = async (idw) => {
    try {
        const pool = await connection;
        const post = `SELECT sens,params,meta FROM sens_stor_meta WHERE idw=@idw`;
        const result = await pool.request()
            .input('idw', String(idw))
            .query(post);
        return result.recordset
    } catch (error) {
        console.log(error)
    }
}


exports.setUpdateValueSensStorMeta = async (imei, port, data) => {
    try {
        const pool = await connection;
        for (let i of data) {
            const updateQuery = `UPDATE sens_stor_meta SET value=@value, data=@data, status= @status WHERE imei=@imei AND port=@port AND params=@params`;
            const res = await pool.request()
                .input('port', String(port))
                .input('imei', imei)
                .input('value', sql.VarChar, i.value)
                .input('meta', sql.VarChar, i.key)
                .input('params', sql.VarChar, i.params)
                .input('data', i.data)
                .input('status', sql.VarChar, i.status)
                .query(updateQuery);
        }
        return 'таблица обновлена'

    } catch (error) {
        console.log(error)
    }
}


exports.getSensStorMetaFilter = async (imei, port, id) => {
    try {
        const pool = await connection;
        const post = `SELECT idw,imei,port,params,meta, value,idTyres,idBitrix,data FROM sens_stor_meta WHERE imei=@imei AND port=@port AND idw=@idw`;
        const result = await pool.request()
            .input('imei', String(imei))
            .input('idw', String(id))
            .input('port', String(port))
            .query(post);
        return result.recordset
    } catch (error) {
        console.log(error)
    }
}
exports.setAddDataToGlobalBase = async (obj) => {
    try {
        const pool = await connection;
        const columns = Object.keys(obj).filter((column) => obj[column] !== null);
        const values = Object.values(obj)
            .filter(value => value !== null)
            .map(value => `'${value}'`)
            .join(', ');
        const post = `INSERT INTO globalStor (${columns.join(', ')}) VALUES (${String(values)})`;
        const result = await pool.request()
            .query(post);
        return result.recordset
    } catch (error) {
        console.log(error)
    }
}


exports.getValuePWRToBase = async (idw, param) => {
    const pool = await connection;
    try {
        if (param) {
            const post = `SELECT * FROM coef WHERE idw=@idw AND params=@params`
            const res = await pool.request()
                .input('idw', String(idw))
                .input('params', param)
                .query(post);
            if (res.recordset.length !== 0) {
                return res.recordset
            } else {
                return ''
            }
        }
        else {
            const post = `SELECT * FROM coef WHERE idw=@idw`
            const res = await pool.request()
                .input('idw', String(idw))
                .query(post);
            if (res.recordset.length !== 0) {
                return res.recordset
            } else {
                return ''
            }
        }

    }
    catch (e) {
        console.log(e)
    }
}
exports.deleteParamsToBase = async (idw, param) => {
    console.log(idw, param)
    const pool = await connection;
    try {
        const post = `DELETE FROM coef WHERE idw=@idw AND params=@params`
        const res = await pool.request()
            .input('idw', String(idw))
            .input('params', param)
            .query(post);
        return 'данные удалены'
    }
    catch (e) {
        console.log(e)
    }
}

exports.saveValuePWRToBase = async (idw, params, value) => {
    const pool = await connection;
    try {
        const post = `SELECT * FROM coef WHERE idw=@idw AND params=@params`
        const res = await pool.request()
            .input('idw', String(idw))
            .input('params', params)
            .query(post);
        if (res.recordset.length === 0) {
            const insertQuery = `INSERT INTO coef (idw,params, value) VALUES (@idw,@params, @value)`;
            const res = await pool.request()
                .input('idw', String(idw))
                .input('params', params)
                .input('value', value)
                .query(insertQuery);
        }
        else {
            const updateQuery = `UPDATE coef SET idw=@idw, params=@params, value=@value WHERE idw=@idw AND params=@params`;
            const res = await pool.request()
                .input('idw', String(idw))
                .input('params', params)
                .input('value', value)
                .query(updateQuery);
        }
        return 'ok'
    }
    catch (e) {
        console.log(e)
    }
}

exports.setStatistiksPressure = async (data) => {
    const pool = await connection;
    try {
        const insertQuery = `INSERT INTO tyres_history_statistika (idw_tyres, idObject, time, speed, params, value,dvs, mileage) VALUES (@idw_tyres, @idObject, @time, @speed, @params, @value,@dvs,@mileage)`;

        const promises = data.map(item =>
            pool.request()
                .input('idw_tyres', item.idTyres)
                .input('idObject', item.idObject)
                .input('time', item.time)
                .input('speed', item.speed)
                .input('params', item.params)
                .input('value', item.value)
                .input('dvs', item.engine)
                .input('mileage', item.mileage)
                .query(insertQuery)
        );

        await Promise.all(promises);
    } catch (e) {
        console.log(e);
    }
};


exports.getTarirData = async (idw, param) => {
    const pool = await connection;
    const query = `
            SELECT * FROM tarirTable WHERE idw=@idw AND param=@param`;
    const result = await pool.request()
        .input('idw', idw)
        .input('param', param)
        .query(query);
    if (result.recordset.length !== 0) {
        return result.recordset
    }
    else {
        return []
    }

}
exports.updateTarirTable = async (data) => {
    const pool = await connection;
    const idw = data[0][0]; // Предполагаем, что все записи для одного и того же idw
    const param = data[0][1]
    // Удаляем все записи для этого idw
    await pool.request()
        .input('idw', idw)
        .input('param', param)
        .query('DELETE FROM tarirTable WHERE idw = @idw AND param=@param');
    // Проверяем, содержит ли массив data только один элемент с idw
    if (data[0].length === 2) {
        return 'Все записи для данного параметра удалены';
    }
    // Вставляем новые данные
    for (const [idw, param, place, dut, litrazh] of data) {
        await pool.request()
            .input('idw', idw)
            .input('param', param)
            .input('place', place)
            .input('dut', dut)
            .input('litrazh', litrazh)
            .query('INSERT INTO tarirTable (idw, param, place, dut, litrazh) VALUES (@idw, @param, @place, @dut, @litrazh)');
    }
    return 'Данные обновлены';
};

exports.setSummatorToBase = async (data, idw) => {
    const pool = await connection;
    // Удаляем все записи для этого idw
    await pool.request()
        .input('idw', idw)
        .query('DELETE FROM summator_oil_stor WHERE idw = @idw');
    // Вставляем новые данные
    for (const { idw, param, dut } of data) {
        await pool.request()
            .input('idw', idw)
            .input('param', param)
            .input('dut', dut)
            .query('INSERT INTO summator_oil_stor (idw, param,  dut) VALUES (@idw, @param, @dut)');
    }
    return 'Данные обновлены';
};

exports.getSummatorToBase = async (idw) => {

    const pool = await connection;

    const result = await pool.request()
        .input('idw', idw)
        .query('SELECT param FROM summator_oil_stor WHERE idw = @idw');

    return result.recordset
};


exports.setSensStorMeta = async (data) => {
    const pool = await connection;
    if (data.length !== 0) {
        // Получаем уникальные params из массива data
        const uniqueParams = Array.from(new Set(data.map(entry => entry.params)));
        // Выбираем все params из sens_stor_meta
        const selectParamsQuery = `SELECT DISTINCT params FROM sens_stor_meta WHERE idw=@idw`;
        const paramsRes = await pool.request().input('idw', String(data[0].id)).query(selectParamsQuery);
        const existingParams = paramsRes.recordset.map(row => row.params);
        // Удаляем строки с params, которых нет в data
        const paramsToDelete = existingParams.filter(param => !uniqueParams.includes(param));
        for (const param of paramsToDelete) {
            const deleteQuery = `DELETE FROM sens_stor_meta WHERE params=@params AND idw=@idw`;
            await pool.request().input('params', param).input('idw', String(data[0].id)).query(deleteQuery);
        }
        for (const entry of data) {
            const { id, port, sens, params, meta, value, status, time, login, data, imei, idBitrix } = entry;
            const post = `SELECT * FROM sens_stor_meta WHERE idw=@idw AND params=@params`
            const res = await pool.request()
                .input('idw', String(id))
                .input('params', params)
                .query(post);
            if (res.recordset.length === 0) {
                const insertQuery = `INSERT INTO sens_stor_meta (idw,port, sens, params, meta, time, login, imei,idBitrixObject) VALUES (@idw,@port, @sens, @params, @meta, @time, @login, @imei,@idBitrixObject)`;
                const res = await pool.request()
                    .input('idw', String(id))
                    .input('port', port)
                    .input('sens', sens)
                    .input('params', params)
                    .input('meta', meta)
                    .input('time', time)
                    .input('login', login)
                    .input('imei', imei)
                    .input('idBitrixObject', idBitrix)
                    .query(insertQuery);
            }
            else {
                const updateQuery = `UPDATE sens_stor_meta SET idw=@idw, port=@port, sens=@sens, time=@time, params=@params, meta=@meta, login=@login, imei=@imei, idBitrixObject=@idBitrixObject 
            WHERE idw=@idw AND params=@params`;
                const res = await pool.request()
                    .input('idw', String(id))
                    .input('port', port)
                    .input('sens', sens)
                    .input('params', params)
                    .input('meta', meta)
                    .input('value', value)
                    .input('time', time)
                    .input('login', login)
                    .input('imei', imei)
                    .input('status', status)
                    .input('data', data)
                    .input('idBitrixObject', idBitrix)
                    .query(updateQuery);
            }
            console.log('здесь')
        }
        return 'Выполнено'

    }
    else {
        return 'Массив пуст'
    }
}

exports.uniqImeiAndPhone = async (col, value, table, login, id) => {
    console.log(col, value, table, login, id)
    try {
        const pool = await connection;
        const query = `
            SELECT
                CASE
                    WHEN ${col} = @${col} THEN '${col}'
                    ELSE NULL
                END AS matched_column
            FROM ${table}
            WHERE ${col} = @${col} AND idObject <> @id
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
    try {
        const pool = await connection;
        const query = `
            SELECT * FROM object_table WHERE name_g=@name_g
                
        `;
        const result = await pool.request()
            .input('name_g', name)
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
        const updateModel = `UPDATE object_table SET marka = @marka,model = @model,vin = @vin,dut = @dut,angle = @angle,data = @data, login = @login,idObject=@idObject,port=@port,typeDevice=@typeDevice,imei=@imei,adress=@adress,phone=@phone,nameObject=@nameObject,
         typeObject=@typeObject,  gosnomer=@gosnomer, id_bitrix=@id_bitrix WHERE idObject = @idObject`;
        const result = await pool.request()
            .input('data', object.data)
            .input('login', object.login)
            .input('idObject', object.idObject)
            .input('imei', object.imei)
            .input('adress', object.adress)
            .input('phone', object.number)
            .input('nameObject', object.nameObject)
            .input('typeObject', object.typeObject)
            .input('port', object.port)
            .input('typeDevice', object.typeDevice)
            .input('marka', object.marka)
            .input('model', object.model)
            .input('vin', object.vin)
            .input('gosnomer', object.gosnomer)
            .input('dut', object.dut)
            .input('angle', object.angle)
            .input('id_bitrix', object.idBitrix)
            .query(updateModel)

        return 'Объект обновлен'
    }
    catch (e) {
        console.log(e)
    }
}




exports.updateGroup = async (object) => {
    try {
        const pool = await connection;
        const select = `SELECT id FROM object_table WHERE idg=@idg`
        const res = await pool.request()
            .input('idg', object.idg)
            .query(select);
        await databaseService.setGroup(object)
        const id = res.recordset.map(e => e.id)
        console.log(id)
        for (let el of id) {
            const post = `DELETE FROM object_table WHERE id=@id`
            const result = await pool.request()
                .input('id', el)
                .query(post);
        }
        return 'Группа изменена'
    }

    catch (e) {
        console.error(e);
    }
}



exports.lastIdObject = async () => {
    try {
        const pool = await connection
        const postModel = `SELECT TOP 1 idObject FROM object_table WHERE port!='wialon' ORDER BY idObject DESC`
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
        const postModel = `SELECT TOP 1 idg FROM object_table WHERE port!='wialon' AND idg!='idg' ORDER BY idg DESC`
        const result = await pool.request()
            .query(postModel)
        return result.recordset;
    }
    catch (e) {
        console.log(e)
    }
}

exports.setGroup = async (object) => {
    console.log(object)
    const login = object.login;
    const time = object.data;
    const idg = object.idg;
    const name_g = object.name_g;
    const face_company = object.face
    const number_company = object.contact
    try {
        const pool = await connection;
        const post = `SELECT * FROM object_table WHERE idObject=@idObject`

        for (const el of object.arrayObjects) {
            const res = await pool.request()
                .input('login', login)
                .input('data', String(time)) // Предполагая, что время в Unix timestamp
                .input('idg', String(idg))
                .input('name_g', name_g)
                .input('idObject', el.idObject)
                .input('nameObject', el.nameObject)
                .input('face_company', face_company)
                .input('number_company', number_company)
                .query(post);
            //    console.log(res.recordset)

            if (res.recordset[0].idg === 'idg') {
                const updateModel = `
                    UPDATE object_table
                    SET data = @data,
                        idg = @idg,
                        name_g=@name_g,
                        face_company=@face_company,
                        number_company=@number_company
                                        WHERE idObject=@idObject
                `;
                const res = await pool.request()
                    .input('login', login)
                    .input('data', String(time)) // Предполагая, что время в Unix timestamp
                    .input('idObject', el.idObject)
                    .input('idg', String(idg))
                    .input('name_g', name_g)
                    .input('face_company', face_company)
                    .input('number_company', number_company)
                    .query(updateModel);
            }
            else {
                const obj = res.recordset[0]
                obj.login = login
                obj.data = time
                obj.idg = idg
                obj.name_g = name_g
                obj.number_company = number_company
                obj.face_company = face_company
                console.log(obj)
                const post = `INSERT INTO object_table(login, data, idg, name_g, idObject, nameObject,imei,phone, typeObject,
                typeDevice,adress, port,marka,model,dut,angle, gosnomer,face_company,number_company)
                VALUES(@login, @data, @idg, @name_g,  @idObject, @nameObject,@imei,@phone, @typeObject,
                @typeDevice,@adress, @port,@marka,@model,@dut,@angle, @gosnomer,@face_company,@number_company)`
                await pool.request()
                    .input('login', obj.login)
                    .input('data', String(obj.data))
                    .input('idg', String(obj.idg))
                    .input('name_g', obj.name_g)
                    .input('idObject', obj.idObject)
                    .input('nameObject', obj.nameObject)
                    .input('imei', obj.imei)
                    .input('phone', obj.phone)
                    .input('typeObject', obj.typeObject)
                    .input('typeDevice', obj.typeDevice)
                    .input('adress', obj.adress)
                    .input('port', obj.port)
                    .input('marka', obj.marka)
                    .input('model', obj.model)
                    .input('dut', obj.dut)
                    .input('angle', obj.angle)
                    .input('gosnomer', obj.gosnomer)
                    .input('face_company', obj.face_company)
                    .input('number_company', obj.number_company)
                    .query(post);
            }
        }

        return 'Обработка завершена';
    } catch (e) {
        console.error(e);
        return 'Ошибка при обработке данных';
    }
};
exports.setSubGroups = async (subgroups, object) => {
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
    console.log('тута???')
    try {
        const pool = await connection
        const postModel = `
            INSERT INTO object_table (adress, data, name_g,idObject, imei, login,idg, nameObject, phone, port, typeDevice, typeObject, marka,model,vin,gosnomer,dut,angle,id_bitrix)
            VALUES (@adress, @data,@name_g, @idObject, @imei, @login, @idg,@nameObject, @phone, @port, @typeDevice, @typeObject,@marka,@model,@vin,@gosnomer,@dut,@angle,@id_bitrix)
        `;

        const result = await pool.request()
            .input('adress', object.adress)
            .input('data', object.data)
            .input('idg', object.idg)
            .input('name_g', object.name_g)
            .input('idObject', object.idObject)
            .input('imei', object.imei)
            .input('login', object.login)
            .input('nameObject', object.nameObject)
            .input('phone', object.number)
            .input('typeDevice', object.typeDevice)
            .input('port', object.port)
            .input('typeObject', object.typeObject)
            .input('marka', object.marka)
            .input('model', object.model)
            .input('vin', object.vin)
            .input('gosnomer', object.gosnomer)
            .input('dut', object.dut)
            .input('angle', object.angle)
            .input('id_bitrix', object.idBitrix)
            .query(postModel);
        return 'Объект создан'
    } catch (e) {
        console.log(e);
    }
};


exports.deleteObject = async (login, idObject) => {
    try {
        const pool = await connection
        const post = `DELETE object_table WHERE  idObject = @idObject`
        const result = await pool.request()
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
        const post = `DELETE FROM object_table WHERE idg =@id`
        const result = await pool.request()
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
    const postModel = `SELECT * FROM sortData WHERE idw=@idw AND time >=@t1 AND time <=@t2`;
    try {
        const pool = await connection
        const results = await pool.request()
            .input('idw', Number(idw))
            .input('t1', t1)
            .input('t2', t2)
            .query(postModel);
        if (results.recordset.length === 0) {
            const last = await databaseService.lostSortChartDataToBase(idw)
            return last.length !== 0 ? last : []
        }
        else {
            return results.recordset;
        }

    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.lostSortChartDataToBase = async (idw) => {
    try {
        const postModel = `SELECT TOP (1) * FROM sortData WHERE idw = ${idw} ORDER BY time DESC`
        const pool = await connection;
        const results = await pool.request().query(postModel);
        return results.recordset;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

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



//сохраняем в базу
exports.alarmBase = async (data, tyres, alarm) => {
    console.log('данные по алармам')
    const dannie = data.concat(tyres)
    let val;
    // console.log(dannie)
    let tyress;
    if (dannie[9] === 'wialon') {
        const allSens = await databaseService.ggg(dannie[6])
        tyress = allSens[dannie[2]]
    }
    else {
        tyress = dannie[2]
    }

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


exports.loadParamsViewList = async (car, el, object, kursor) => {
    const idw = el
    const pool = await connection;
    const mod = async () => {
        try {
            const selectBase = `SELECT osi, trailer, tyres, type, tsiControll FROM model WHERE idw='${idw}'`
            const result = await pool.query(selectBase)
            if (kursor) {
                const datas = (await databaseService.objects(String(el))).map(e => e.imei)[0]
                return { result: result.recordset, message: car, imei: datas, phone: 'null' }
            }
            else {
                return { result: result.recordset, message: car, imei: object ? object.imei : null, phone: object ? object.phone : null }
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
            /*   const data = await databaseService.objects(String(idw))
               let port;
               if (data.length === 0) {
                   port = 'wialon'
               }
               else {
                   port = data[0].port
               }*/
            const selectBase = `SELECT * FROM sens_stor_meta WHERE idw='${idw}'`
            //  const selectBase = `SELECT name, value, status FROM params WHERE idw='${idw}' AND port='${port}'`
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
    const saves = async () => {
        try {
            const selectBase = `SELECT * FROM sens_stor_meta WHERE idw='${idw}'`
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
    const save = await saves();
    model.result.sort((a, b) => {
        if (a.osi > b.osi) {
            return 1;
        } else if (a.osi < b.osi) {
            return -1;
        } else {
            return 0;
        }
    });
    const params = save.result.length !== 0 ? 'true' : 'false'
    // console.log(model, models, data, osi, el, params)
    return [model, models, data, osi, el, params, object]

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
    const data = await databaseService.objectId(idw)
    let port;
    if (data.length === 0) {
        port = 'wialon'
    }
    else {
        port = data[0].port
    }

    try {
        const pool = await connection
        const selectBase = `SELECT nameCar, name, value, status, time FROM params WHERE idw=@idw AND port=@port`
        const result = await pool.request().input('idw', idw).input('port', port).query(selectBase)
        return result.recordset
    }
    catch (e) {
        console.log(e)
    }

}

exports.paramsToBaseSens = async (idw) => {
    try {
        const pool = await connection
        const selectBase = `SELECT idw,port,imei,sens,params,value,status, idTyres, data FROM sens_stor_meta WHERE idw=@idw`
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
            const arr = [login, 0];
            const insertQuery = `INSERT INTO viewLogs(login, quantity) VALUES(@login,@quantity)`;

            const results = await pool.request()
                .input('login', arr[0])
                .input('quantity', arr[1])
                .query(insertQuery);
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
    console.log('удаляем?')
    console.log(idw)
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

exports.getBitrixEvent = async (idw) => {
    try {
        const pool = await connection;
        const postModel = `SELECT * FROM bitrix_table_events WHERE idObject=@idObject`
        const results = await pool.request().input('idObject', String(idw)).query(postModel)
        return results.recordset.length !== 0 ? results.recordset : []
    }
    catch (e) {
        console.log(e)
    }
}


exports.controllerSaveToBase = async (arr, id, geo, group, name, start) => {
    // console.log(arr, id, geo, group, name, start)
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
        const result = await databaseService.getBitrixEvent(idw)
        if (result.length !== 0) {
            getEvent.pushEvent(arr, id, geo, group, name, start, result[0].idBitrix, time)
            //result[0].idBitrix === '30' ? getEvent.pushEvent(arr, id, geo, group, name, start, result[0].idBitrix, time) : null
        }
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
    // console.log(arr, time, idw, geo, group, name, start)
    try {
        const pool = await connection;
        let checkExistQuery;
        const event = JSON.parse(arr)[0].event
        if (start) {
            checkExistQuery = `SELECT * FROM logs WHERE litragh='${start}' AND idw='${idw}'`
        }
        else if (event === 'Простой') {
            checkExistQuery = `SELECT * FROM logs WHERE content='${arr}'AND idw='${idw}'`
        }
        else {
            checkExistQuery = `SELECT * FROM logs WHERE content='${arr}'AND idw='${idw}'`
        }
        const checkResults = await pool.request().query(checkExistQuery);

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


module.exports.saveToBaseProfil = async (mass) => { //сохранение контактов
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
module.exports.deleteToBaseProfil = async (uniqId) => { //удаление контактов
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


module.exports.findToBaseProfil = async (login) => { //получение контактов
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

exports.iconSaveToBase = async (activePost, param, id, idw) => {
    console.log(activePost, param, id, idw)
    try {
        const selectBase = `SELECT icons FROM icon WHERE idw=@idw AND icons=@icons`;
        const pool = await connection;
        let results = await pool.request()
            .input('idw', idw)
            .input('icons', sql.VarChar, id)
            .query(selectBase);

        if (results.recordset.length === 0) {
            const postModel = `INSERT INTO icon(idw, nameCar, params, icons) 
                               VALUES(@idw, @activePost, @param, @icons)`;
            results = await pool.request()
                .input('idw', idw)
                .input('activePost', sql.VarChar, activePost)
                .input('param', sql.VarChar, param)
                .input('icons', sql.VarChar, id)
                .query(postModel);
        }
        else {
            const sqlUpdate = `UPDATE icon SET  idw=@idw, nameCar=@activePost, params=@param,
                            icons=@icons WHERE  idw=@idw AND icons=@icons`;
            results = await pool.request()
                .input('idw', idw)
                .input('activePost', sql.VarChar, activePost)
                .input('param', sql.VarChar, param)
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
    const pool = await connection;
    if (add) {
        let [idw, dataAdd, identificator, nameCar, typeOs, numberOs,
            idTyres, marka, model, psi, changeBar, probegNow, dateInstall, probegPass, dateZamer, N1, N2, N3, N4, maxMM] = value[0]
        const sql = `INSERT INTO tyresBase(idw, dataAdd,identificator, nameCar, typeOs, numberOs,idTyres,marka,model,psi,changeBar,probegNow,dateInstall,probegPass,dateZamer,N1,N2,N3,N4,maxMM)
                               VALUES(@idw, @dataAdd,@identificator, @nameCar, @typeOs, @numberOs,@idTyres,@marka,@model,@psi,@changeBar,@probegNow,@dateInstall,@probegPass,@dateZamer,@N1,@N2,@N3,@N4,@maxMM)`;
        try {
            const results = await pool.request()
                .input('idw', idw)
                .input('dataAdd', dataAdd)
                .input('identificator', identificator)
                .input('nameCar', nameCar)
                .input('typeOs', typeOs)
                .input('numberOs', numberOs)
                .input('idTyres', idTyres)
                .input('marka', marka)
                .input('model', model)
                .input('psi', psi)
                .input('changeBar', changeBar)
                .input('probegNow', probegNow)
                .input('dateInstall', dateInstall)
                .input('probegPass', probegPass)
                .input('dateZamer', dateZamer)
                .input('N1', N1)
                .input('N2', N2)
                .input('N3', N3)
                .input('N4', N4)
                .input('maxMM', maxMM)
                .query(sql);
            return 'Данные добавлены';
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    else {
        let [idw, identificator, nameCar, typeOs, numberOs,
            idTyres, marka, model, psi, changeBar, probegNow, dateInstall, probegPass, dateZamer, N1, N2, N3, N4, maxMM] = value[0]
        const sql = `INSERT INTO tyresBase(idw, identificator, nameCar, typeOs, numberOs,idTyres,marka,model,psi,changeBar,probegNow,dateInstall,probegPass,dateZamer,N1,N2,N3,N4,maxMM)
                               VALUES(@idw, @identificator, @nameCar, @typeOs, @numberOs,@idTyres,@marka,@model,@psi,@changeBar,@probegNow,@dateInstall,@probegPass,@dateZamer,@N1,@N2,@N3,@N4,@maxMM)`;
        try {
            const results = await pool.request()
                .input('idw', idw)
                .input('identificator', identificator)
                .input('nameCar', nameCar)
                .input('typeOs', typeOs)
                .input('numberOs', numberOs)
                .input('idTyres', idTyres)
                .input('marka', marka)
                .input('model', model)
                .input('psi', psi)
                .input('changeBar', changeBar)
                .input('probegNow', probegNow)
                .input('dateInstall', dateInstall)
                .input('probegPass', probegPass)
                .input('dateZamer', dateZamer)
                .input('N1', N1)
                .input('N2', N2)
                .input('N3', N3)
                .input('N4', N4)
                .input('maxMM', maxMM)
                .query(sql);
            return 'Данные добавлены';
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

};


exports.getMotoTo = async (data) => {
    try {
        const pool = await connection; // Предполагается, что connection уже готов к использованию
        let results = []; // Массив для хранения результатов

        for (const item of data) {
            const query = `SELECT TOP 1
                mt.typeTo AS typeTo,
                mt.nameTo AS nameTo,
                mt.discriptionType AS discriptionType,
                j.guideID AS guideID,
                j.guideDescription AS guideDescription,
                j.guideType AS guideType,
                mj.IsRequired AS IsRequired,
                mj.motohours AS motohours,
                mj.mileage AS mileage,
                mj.day AS day
            FROM connectTyTOandGuide mj
            JOIN typeTo mt ON mj.typeTo = mt.typeTo
            JOIN guide j ON mj.guideID = j.guideID
            WHERE mj.idObject = @idObject AND mj.motohours > @engineHours
            ORDER BY mj.motohours ASC`;

            // Выполнение запроса с параметрами idObject и engineHours
            const result = await pool.request()
                .input('idObject', item.idw)  // Добавление параметра idObject
                .input('engineHours', item.engineHours)  // Добавление параметра engineHours
                .query(query);
            const moto = result.recordset[0] ? Math.max(0, result.recordset[0].motohours - item.engineHours) : '-';
            // Добавление полученных данных в результат с сохранением idw и engineHours
            results.push({
                idw: item.idw,
                engineHours: item.engineHours,
                TOData: result.recordset,// Сохранение ближайшего ТО для данного idw,
                motoRemains: moto
            });
        }
        return results; // Возвращение массива результатов
    } catch (e) {
        console.log(e);
        throw e; // Проброс ошибки для обработки на более высоком уровне
    }
}


exports.setShablonToBase = async (data) => {
    const idw = data[0].idObject; // Извлекаем idObject из первого элемента массива данных
    try {
        const pool = await connection;

        let query = `
            MERGE INTO connectTyTOandGuide AS target
            USING (VALUES `;

        // Формируем строки для вставки из данных
        const values = data.map(item => {
            const isRequired = item.bool !== undefined ? item.bool : 'NULL';
            const motohours = item.moto !== undefined ? item.moto : 'NULL';
            const mileage = item.mileage !== undefined ? item.mileage : 'NULL';
            const day = item.day !== undefined ? item.day : 'NULL';
            return `(${item.to}, ${item.guide}, ${isRequired}, ${motohours}, ${mileage}, ${day}, ${item.idObject})`;
        });

        query += values.join(', ');

        query += `
            ) AS source (typeTo, guideID, IsRequired, motohours, mileage, day, idObject)
            ON target.typeTo = source.typeTo AND target.guideID = source.guideID AND target.idObject = source.idObject
            WHEN MATCHED THEN
                UPDATE SET target.IsRequired = source.IsRequired,
                           target.motohours = source.motohours,
                           target.mileage = source.mileage,
                           target.day = source.day
            WHEN NOT MATCHED THEN
                INSERT (typeTo, guideID, IsRequired, motohours, mileage, day, idObject)
                VALUES (source.typeTo, source.guideID, source.IsRequired, source.motohours, source.mileage, source.day, source.idObject)
            WHEN NOT MATCHED BY SOURCE AND target.idObject = ${idw} THEN
                DELETE;
        `;

        const results = await pool.request().query(query);
        return 'Данные обновлены/добавлены';
    } catch (err) {
        console.error(err);
        throw err;
    }
};


exports.getPressureTyres = async (idBitrix) => {
    try {
        const pool = await connection
        const post = `SELECT value FROM sens_stor_meta WHERE idBitrix=@idBitrix`
        const results = await pool.request()
            .input('idBitrix', idBitrix)
            .query(post)
        return results.recordset
    }
    catch (e) {
        console.log(e)
    }

}
exports.getShablonToBase = async (idw) => {
    try {
        const pool = await connection
        const querys = `SELECT 
        mt.typeTo AS typeTo,
          mt.nameTo AS nameTo,
            mt.discriptionType AS discriptionType,
               j.guideID AS guideID,
                     j.guideDescription AS guideDescription,
            j.guideType AS guideType,
             mj.IsRequired AS IsRequired,
    mj.motohours AS motohours,
     mj.mileage AS mileage,
    mj.day AS day
          FROM connectTyTOandGuide mj
JOIN typeTo mt ON mj.typeTo = mt.typeTo
JOIN guide j ON mj.guideID = j.guideID WHERE idObject=@idObject`;

        const results = await pool.request()
            .input('idObject', String(idw))
            .query(querys)
        return results.recordset
    } catch (err) {
        console.error(err)
        throw err
    }
}


exports.getGuideToBase = async () => {
    try {
        const selectBase = `SELECT *FROM guide`
        const pool = await connection
        const results = await pool.request()
            .query(selectBase)
        return results.recordset
    } catch (err) {
        console.error(err)
        throw err
    }
}

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

exports.getHistoryTyres = async (identificator, id) => {
    console.log(identificator, id)
    try {
        const selectBase = `SELECT TOP 1 th.*, tg.*
FROM tyres_history th
JOIN tyres_guide tg ON th.uniqTyresID = tg.uniqTyresID
WHERE th.identificator = @identificator AND th.idObject = @idObject
ORDER BY th.incriment DESC`
        const pool = await connection
        const results = await pool.request()
            .input('identificator', identificator)
            .input('idObject', id)
            .query(selectBase)
        return results.recordset.length !== 0 ? results.recordset[0] : []
    } catch (err) {
        console.error(err)
        throw err
    }
}

exports.techViewToBaseBitrix = async (idb) => {
    try {
        const selectBase = `SELECT marka, model, identificator, psi, changeBar, probegNow, dateInstall, probegPass, dateZamer, N1, N2, N3, N4, maxMM FROM tyresBase WHERE identificator=@idB`
        const pool = await connection
        const results = await pool.request()
            .input('idB', idb)
            .query(selectBase)
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
    // console.log(arr)
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
    //console.log(data, arrayId)
    if (!arrayId.length) {
        return;
    }
    const pool = await connection
    if (data.length === 1) {
        try {
            // Создание строки с placeholder'ами для каждого id из arrayId
            const placeholders = arrayId.map((_, i) => '@id' + i).join(',');
            //console.log(placeholders)
            const selectBase = `SELECT * FROM summary WHERE idw IN (${placeholders}) AND data=@data`;
            const request = pool.request();
            // Добавляем данные для каждого элемента из arrayId
            arrayId.forEach((id, i) => request.input('id' + i, sql.Int, id));
            // Добавляем данные для @data
            request.input('data', sql.VarChar, data[0]);
            const results = await request.query(selectBase);
            //   console.log(results.recordset.length)
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











exports.setModelTyresGuide = async (data, reduct) => {
    console.log(reduct)
    try {
        const pool = await connection;
        // Проверяем, существует ли уже такая модель в базе данных
        const checkModelQuery = `
            SELECT uniqTyresID 
            FROM tyres_model_guide 
            WHERE type_tire = @type_tire 
                AND marka = @marka 
                AND model = @model 
                AND type_tyres = @type_tyres 
                AND radius = @radius 
                AND profil = @profil 
                AND width = @width 
                AND sezon = @sezon 
                AND index_speed = @index_speed 
                AND index_massa = @index_massa `;

        const modelExist = await pool.request()
            .input('type_tire', data.type_tire)
            .input('marka', data.marka)
            .input('model', data.model)
            .input('type_tyres', data.type_tyres)
            .input('radius', data.radius)
            .input('profil', data.profil)
            .input('width', data.width)
            .input('sezon', data.sezon)
            .input('index_speed', data.index_speed)
            .input('index_massa', data.index_massa)
            .query(checkModelQuery);

        if (modelExist.recordset.length > 0) {
            // Модель существует, обновляем запись
            const updateQuery = `
                UPDATE tyres_model_guide
                SET imagePath = @imagePath 
                WHERE uniqTyresID = @uniqTyresID`;

            await pool.request()
                .input('imagePath', data.imagePath)
                .input('uniqTyresID', modelExist.recordset[0].uniqTyresID)
                .query(updateQuery);
        } else {
            if (reduct && reduct !== 'null') {
                // Модель существует, обновляем запись
                const updateQuery = `
                UPDATE tyres_model_guide
             SET type_tire = @type_tire,
                        marka = @marka,
                        model = @model,
                        type_tyres = @type_tyres,
                        radius = @radius,
                 profil = @profil,
                 width = @width,
                 sezon = @sezon,
                 index_speed = @index_speed,
                 index_massa = @index_massa,
                                      imagePath = @imagePath
                WHERE uniqTyresID = @uniqTyresID`;

                await pool.request()
                    .input('type_tire', data.type_tire)
                    .input('marka', data.marka)
                    .input('model', data.model)
                    .input('type_tyres', data.type_tyres)
                    .input('radius', data.radius)
                    .input('profil', data.profil)
                    .input('width', data.width)
                    .input('sezon', data.sezon)
                    .input('index_speed', data.index_speed)
                    .input('index_massa', data.index_massa)
                    .input('imagePath', data.imagePath)
                    .input('uniqTyresID', Number(reduct))
                    .query(updateQuery);
            }
            else {
                // Модель не существует, вставляем новую запись
                const insertQuery = `
                INSERT INTO tyres_model_guide (type_tire, marka, model, type_tyres, radius, profil, width, sezon, index_speed, index_massa, imagePath)
                VALUES (@type_tire, @marka, @model, @type_tyres, @radius, @profil, @width, @sezon, @index_speed, @index_massa, @imagePath)`;

                await pool.request()
                    .input('type_tire', data.type_tire)
                    .input('marka', data.marka)
                    .input('model', data.model)
                    .input('type_tyres', data.type_tyres)
                    .input('radius', data.radius)
                    .input('profil', data.profil)
                    .input('width', data.width)
                    .input('sezon', data.sezon)
                    .input('index_speed', data.index_speed)
                    .input('index_massa', data.index_massa)
                    .input('imagePath', data.imagePath)
                    .query(insertQuery);
            }
        }
    } catch (error) {
        console.error('Ошибка при сохранении данных в базу данных:', error);
        throw error;
    }
};





