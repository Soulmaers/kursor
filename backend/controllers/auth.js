const response = require('../../response')
//const pool = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const express = require('express')
const databaseService = require('../services/database.service');
const { connection, sql } = require('../config/db')


module.exports.update = async (req, res) => { //обновление пользовательских данных
    const id = req.body.idx
    const login = req.body.log
    const roleNew = req.body.role

    try {
        const selectBase = `UPDATE users SET name=@name, role=@roleNew WHERE idx = @id`;
        const pool = await connection;
        const results = await pool.request()
            .input('id', id)
            .input('name', login)
            .input('roleNew', roleNew)
            .query(selectBase);
        res.json({ status: 200, result: results, message: 'Данные пользователя изменены' });
    } catch (e) {
        console.log(e);
        // Consider sending back an error response here
    }
}

module.exports.delete = async (req, res) => { //удаление пользователя
    const pool = await connection;
    try {

        const selectBase = `DELETE FROM users WHERE idx =@id`;
        const results = await pool.request().input('id', req.body.idx).query(selectBase)
        res.json({ status: 200, result: results.recordset, message: `Пользователь удален` })
    }
    catch (e) {
        console.log(e)
    }
    try {
        const selectBase = `DELETE FROM userObjects WHERE login = @login`;
        await pool.request().input('login', req.body.log).query(selectBase)
    }
    catch (e) {
        console.log(e)
    }
}




module.exports.users = async (req, res) => { //получение данных пользователей
    console.log('запрос пришел')
    try {
        const pool = await connection
        const selectBase = `SELECT  idx, name, role FROM users`
        const results = await pool.query(selectBase)
        res.json(results.recordset)
    }
    catch (e) {
        console.log(e)
    }
}

exports.saveProfil = async (req, res) => { //сохранение контактов
    const mass = req.body.mass
    const params = await databaseService.saveToBaseProfil(mass)
    res.json(params)
}
exports.findLastIdUser = async (req, res) => { //сохранение контактов
    const table = req.body.table
    try {
        const pool = await connection
        const selectBase = `SELECT TOP 1 idx FROM ${table} ORDER BY incriment DESC`;
        const results = await pool.request()
            .query(selectBase)
        res.json(results.recordset)
    }
    catch (e) {
        console.log(e)
    }
}

exports.updateObjectUser = async (req, res) => { //сохранение контактов
    const incriment = req.body.incriment
    const objects = req.body.objects
    try {
        const pool = await connection
        const deleteObjectsQuery = `
        DELETE FROM usersObjects 
        WHERE uniqUsersID = @incriment`;
        const results = await pool.request()
            .input('incriment', incriment)
            .query(deleteObjectsQuery)


        // Добавить новые связи
        const insertUserObjectsQuery = `
        INSERT INTO usersObjects (uniqUsersID, uniqObjectID) 
        VALUES (@userId, @objectId)`;
        const objectPromises = objects.map(objectId =>
            pool.request()
                .input('userId', sql.Int, incriment)
                .input('objectId', sql.Int, objectId)
                .query(insertUserObjectsQuery)
        );
        res.json({ message: 'Данные пользователя обновлены', flag: true })
    }
    catch (e) {
        console.log(e)
    }
}



exports.deleteUsersObjectGroupRetra = async (req, res) => { //сохранение контактов
    const { uz, usersObjectGroupsRetra, objectsRetra, groupsRetra } = req.body.obj
    try {
        const pool = await connection;

        if (usersObjectGroupsRetra.length > 0 && objectsRetra.length > 0) {
            // Удаление связей в таблице usersObjects
            const deleteUsersObjectsQuery = `
            DELETE FROM usersObjects
            WHERE uniqUsersID IN (${usersObjectGroupsRetra.join(',')}) 
              AND uniqObjectID IN (${objectsRetra.join(',')})`;

            await pool.request().query(deleteUsersObjectsQuery);
        }

        if (usersObjectGroupsRetra.length > 0 && groupsRetra.length > 0) {
            // Удаление связей в таблице usersGroups
            const deleteUsersGroupsQuery = `
            DELETE FROM usersGroups
            WHERE uniqUsersID IN (${usersObjectGroupsRetra.join(',')})
              AND uniqGroupID IN (${groupsRetra.join(',')})`;

            await pool.request().query(deleteUsersGroupsQuery);
        }

        if (objectsRetra.length > 0) {
            // update связей в таблице accountObjects
            const updateAccountObjectsQuery = `
            UPDATE accountObjects 
            SET uniqAccountID = @uz 
            WHERE uniqObjectID IN (${objectsRetra.join(',')})`;

            await pool.request().input('uz', sql.Int, uz).query(updateAccountObjectsQuery);
        }

        if (groupsRetra.length > 0) {
            // update связей в таблице accountGroups
            const updateAccountGroupsQuery = `
            UPDATE accountGroups 
            SET uniqAccountID = @uz 
            WHERE uniqGroupID IN (${groupsRetra.join(',')})`;

            await pool.request().input('uz', sql.Int, uz).query(updateAccountGroupsQuery);
        }
        res.json({ message: 'Ретранслятор обновлен', flag: true })
    } catch (err) {
        console.error('Error deleting and updating objects and groups:', err);
    }
}

exports.updateGroupsAndUsers = async (req, res) => { //сохранение контактов
    const incriment = req.body.incriment
    const objects = req.body.objects
    try {
        const pool = await connection
        const deleteObjectsQuery = `
        DELETE FROM usersGroups
        WHERE uniqGroupID = @incriment`;
        const results = await pool.request()
            .input('incriment', incriment)
            .query(deleteObjectsQuery)

        const deleteObjectsGrQuery = `
        DELETE FROM groupsAndObjects
        WHERE uniqGroupID = @incriment`;
        await pool.request()
            .input('incriment', incriment)
            .query(deleteObjectsGrQuery)

        // Добавить новые связи
        const insertUserObjectsQuery = `
        INSERT INTO groupsAndObjects (uniqGroupID, uniqObjectID)
        VALUES (@incriment, @objectId)`;
        const objectPromises = objects.map(objectId =>
            pool.request()
                .input('incriment', sql.Int, incriment)
                .input('objectId', sql.Int, objectId)
                .query(insertUserObjectsQuery)
        );
        res.json({ message: 'Данные пользователя обновлены', flag: true })
    }
    catch (e) {
        console.log(e)
    }
}


exports.updateGroupUser = async (req, res) => { //сохранение контактов
    const incriment = req.body.incriment
    const groups = req.body.groups
    try {
        const pool = await connection
        const deleteObjectsQuery = `
        DELETE FROM usersGroups
        WHERE uniqUsersID = @incriment`;
        const results = await pool.request()
            .input('incriment', incriment)
            .query(deleteObjectsQuery)


        // Добавить новые связи
        const insertUserObjectsQuery = `
        INSERT INTO usersGroups (uniqUsersID, uniqGroupID) 
        VALUES (@userId, @groupsId)`;
        const groupsPromises = groups.map(groupsId =>
            pool.request()
                .input('userId', sql.Int, incriment)
                .input('groupsId', sql.Int, groupsId)
                .query(insertUserObjectsQuery)
        );
        res.json({ message: 'Данные пользователя обновлены', flag: true })
    }
    catch (e) {
        console.log(e)
    }
}


exports.editGroup = async (req, res) => { //сохранение контактов

    const { creater, incrimentGroup, uz, face, facecontact, nameGroup } = req.body.obj;
    try {
        const pool = await connection
        const sqlS = `SELECT * FROM groups WHERE nameGroup = @nameGroup AND uz=@uz AND incriment!=@incrimentGroup`;
        const rows = await pool.request()
            .input('incrimentGroup', incrimentGroup)
            .input('uz', uz)
            .input('nameGroup', nameGroup)
            .query(sqlS);
        if (rows.recordset.length > 0) {
            res.json({
                message: `Группа с таким именем - ${rows.recordset[0].objectname} уже есть`, flag: false
            });
            //  return;
        }
        else {


            const insertUserQuery = `
                UPDATE groups SET nameGroup=@nameGroup, face=@face, creater=@creater,facecontact=@facecontact
                WHERE incriment=@incrimentGroup `;
            const userResult = await pool.request()
                .input('nameGroup', nameGroup)
                .input('face', face)
                .input('facecontact', facecontact)
                .input('incrimentGroup', incrimentGroup)
                .input('creater', creater)
                .query(insertUserQuery);

            const insertAccountUserQuery = `
                     UPDATE  accountGroups SET uniqAccountID=@uz WHERE uniqGroupID=@incrimentGroup`;
            await pool.request()
                .input('uz', sql.Int, Number(uz))
                .input('incrimentGroup', sql.Int, incrimentGroup)
                .query(insertAccountUserQuery);
            res.json({
                message: 'Данные группы обновлены', flag: true
            });

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred'
        });
    }
};

exports.editObject = async (req, res) => { //сохранение контактов

    const { objectname, incrimentObject, uz, addressserver, gosnomerobject, idbitrixobject, imeidevice, markaobject, modelobject, phonenumber,
        port, typedevice, typeobject, tp, creater, vinobject
    } = req.body.obj;
    try {
        const pool = await connection
        const sqlS = `SELECT * FROM objects WHERE objectname = @objectname AND uz=@uz AND incriment!=@incrimentObject`;
        const rows = await pool.request()
            .input('objectname', objectname)
            .input('uz', uz)
            .input('incrimentObject', incrimentObject)
            .query(sqlS);
        if (rows.recordset.length > 0) {
            res.json({
                message: `Объект с таким именем - ${rows.recordset[0].objectname} уже есть`, flag: false
            });
            //  return;
        }
        else {


            const insertUserQuery = `
                UPDATE objects SET objectname=@objectname, addressserver=@addressserver, gosnomerobject=@gosnomerobject, 
                idbitrixobject=@idbitrixobject,imeidevice=@imeidevice,markaobject=@markaobject,
                modelobject=@modelobject, phonenumber=@phonenumber,port=@port,tp=@tp,
                typedevice=@typedevice, typeobject=@typeobject,creater=@creater,vinobject=@vinobject WHERE incriment=@incrimentObject `;
            const userResult = await pool.request()
                .input('objectname', objectname)
                .input('addressserver', addressserver)
                .input('gosnomerobject', gosnomerobject)
                .input('idbitrixobject', idbitrixobject)
                .input('imeidevice', imeidevice)
                .input('markaobject', markaobject)
                .input('modelobject', modelobject)
                .input('phonenumber', phonenumber)
                .input('port', port)
                .input('tp', tp)
                .input('typedevice', typedevice)
                .input('typeobject', typeobject)
                .input('vinobject', vinobject)
                .input('creater', creater)
                .input('incrimentObject', incrimentObject)
                .query(insertUserQuery);

            res.json({
                message: 'Данные объекта обновлены', flag: true
            });

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred'
        });
    }
};


exports.updateObjectsAndUsers = async (req, res) => { //сохранение контактов
    const { incrimentObject, uz } = req.body.obj;
    console.log('дел!?')
    try {
        const pool = await connection
        const deleteObjectsQuery = `
        DELETE FROM usersObjects
        WHERE uniqObjectID = @incriment`;
        await pool.request()
            .input('incriment', incrimentObject)
            .query(deleteObjectsQuery)

        const deleteObjectsGrQuery = `
        DELETE FROM groupsAndObjects
        WHERE uniqObjectID = @incriment`;
        await pool.request()
            .input('incriment', incrimentObject)
            .query(deleteObjectsGrQuery)
        const insertAccountUserQuery = `
                     UPDATE  accountObjects SET uniqAccountID=@uz WHERE uniqObjectID=@incrimentObject`;
        await pool.request()
            .input('incrimentObject', incrimentObject)
            .input('uz', sql.Int, Number(uz))
            .query(insertAccountUserQuery);
        res.json({
            message: 'Объект обновлен', flag: true
        });

    }

    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred'
        });
    }
};

exports.editUser = async (req, res) => { //сохранение контактов
    const { creator, incrimentUser, login, password, role, uz, oldUniqCreator } = req.body;
    try {
        const pool = await connection
        const sqlS = `SELECT * FROM users WHERE name = @name AND uz=@uz AND incriment!=@incrimentUser`;
        const rows = await pool.request()
            .input('name', sql.NVarChar, login)
            .input('uz', sql.NVarChar, uz)
            .input('incrimentUser', incrimentUser)
            .query(sqlS);
        if (rows.recordset.length > 0) {
            res.json({
                message: `Пользователь с таким Логином - ${rows.recordset[0].name} уже есть`, flag: false
            });
            //  return;
        }
        else {

            const sqlS = `SELECT password FROM users WHERE incriment = @incrimentUser`;
            const rows = await pool.request()
                .input('incrimentUser', incrimentUser)
                .input('uz', sql.NVarChar, uz)
                .query(sqlS);

            let hashedPassword = password
            if (rows.recordset.password !== password) {
                const salt = bcrypt.genSaltSync(10);
                hashedPassword = bcrypt.hashSync(password, salt);
            }
            console.log(creator, incrimentUser)
            const insertUserQuery = `
                UPDATE users SET name=@login, password=@password, role=@role, creater=@creater,uz=@uz WHERE incriment=@incrimentUser `;
            const userResult = await pool.request()
                .input('login', login)
                .input('password', hashedPassword)
                .input('role', role)
                .input('uz', uz)
                .input('creater', Number(creator))
                .input('incrimentUser', incrimentUser)
                .query(insertUserQuery);

            if (uz) {
                const insertAccountUserQuery = `
                     UPDATE  accountUsers SET uniqAccountID=@uz WHERE uniqAccountID=@oldUniqCreator AND uniqUsersID=@incrimentUser`;
                await pool.request()
                    .input('incrimentUser', sql.Int, incrimentUser)
                    .input('uz', sql.Int, Number(uz))
                    .input('oldUniqCreator', sql.Int, oldUniqCreator)
                    .query(insertAccountUserQuery);
            }
            res.json({
                message: 'Данные пользователя обновлены', flag: true
            });

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred'
        });
    }
};



exports.editRetra = async (req, res) => { //сохранение контактов
    const { creator, incrimentRetra, nameRetra, port_protokol, protokol, tokenRetra, uz } = req.body;
    console.log(creator)
    try {
        const pool = await connection
        const sqlS = `SELECT * FROM retranslations WHERE nameRetra = @nameRetra AND uz=@uz AND incriment!=@incrimentRetra`;
        const rows = await pool.request()
            .input('nameRetra', nameRetra)
            .input('uz', sql.NVarChar, uz)
            .input('incrimentRetra', incrimentRetra)
            .query(sqlS);
        if (rows.recordset.length > 0) {
            res.json({
                message: `Ретранслятор с таким именем - ${rows.recordset[0].nameRetra} уже есть`, flag: false
            });
            //  return;
        }
        else {

            const insertUserQuery = `
                UPDATE retranslations SET nameRetra=@nameRetra, port_protokol=@port_protokol, protokol=@protokol,
                 creater=@creator,tokenRetra=@tokenRetra,uz=@uz WHERE incriment=@incrimentRetra `;
            const userResult = await pool.request()
                .input('nameRetra', nameRetra)
                .input('port_protokol', port_protokol)
                .input('protokol', protokol)
                .input('uz', uz)
                .input('incrimentRetra', incrimentRetra)
                .input('tokenRetra', tokenRetra)
                .input('creator', Number(creator))
                .query(insertUserQuery);


            const insertAccountUserQuery = `
                     UPDATE  accountRetra SET uniqAccountID=@uz WHERE  uniqRetraID=@incrimentRetra`;
            await pool.request()
                .input('incrimentRetra', sql.Int, incrimentRetra)
                .input('uz', sql.Int, Number(uz))
                .query(insertAccountUserQuery);

            res.json({
                message: 'Ретранслятор обновлен', flag: true
            });

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred'
        });
    }
};


exports.editAccount = async (req, res) => { //сохранение контактов
    const { incriment, name, uniqCreater, uniqTP, oldUniqCreator } = req.body;
    console.log(incriment, name, uniqCreater, uniqTP, oldUniqCreator)
    try {
        const pool = await connection
        const sqlS = `SELECT * FROM accounts WHERE name = @name AND uniqCreater=@uniqCreater`;
        const rows = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('uniqCreater', Number(uniqCreater))
            .query(sqlS);
        if (rows.recordset.length > 0) {
            res.json({
                message: `Учетная запись с таким именем - ${rows.recordset[0].name} уже есть`, flag: false
            });

        }
        else {

            const sqls = 'UPDATE accounts SET name = @name, uniqCreater = @uniqCreater, uniqTP = @uniqTP WHERE incriment = @incriment';
            const result = await pool.request()
                .input('name', name)
                .input('uniqCreater', Number(uniqCreater))
                .input('uniqTP', uniqTP)
                .input('incriment', incriment)
                .query(sqls);

            // Вставка записи в таблицу accountUsers
            const insertAccountUserQuery = `
                     UPDATE  accountUsers SET uniqUsersID=@uniqCreater WHERE uniqAccountID=@uniqAccountID AND uniqUsersID=@oldUniqCreator`;
            await pool.request()
                .input('uniqAccountID', sql.Int, incriment)
                .input('uniqCreater', sql.Int, Number(uniqCreater))
                .input('oldUniqCreator', sql.Int, oldUniqCreator)
                .query(insertAccountUserQuery);
            res.json({
                message: 'Учетная запись обновлена', flag: true
            });

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred'
        });
    }
}


exports.addAccount = async (req, res) => { //сохранение контактов
    const { idx, name, uniqCreater, uniqTP } = req.body;
    try {
        const pool = await connection
        const sqlS = `SELECT * FROM accounts WHERE name = @name AND uniqCreater=@uniqCreater`;
        const rows = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('uniqCreater', sql.NVarChar, uniqCreater)
            .query(sqlS);
        if (rows.recordset.length > 0) {
            res.json({
                message: `Учетная запись с таким именем - ${rows.recordset[0].name} уже есть`, flag: false
            });

        }
        else {

            const sqls = 'INSERT INTO accounts (idx, name, uniqCreater, uniqTP)  OUTPUT INSERTED.incriment VALUES (@idx, @name,@uniqCreater,@uniqTP)';
            const result = await pool.request()
                .input('idx', idx)
                .input('name', name)
                .input('uniqCreater', uniqCreater)
                .input('uniqTP', uniqTP)
                .query(sqls);
            const userIncriment = result.recordset[0].incriment;
            // Вставка записи в таблицу accountUsers
            const insertAccountUserQuery = `
                  INSERT INTO accountUsers (uniqAccountID, uniqUsersID)
                  VALUES (@AccountIncriment, @UserIncriment)
              `;
            await pool.request()
                .input('AccountIncriment', sql.Int, userIncriment)
                .input('UserIncriment', sql.Int, uniqCreater)
                .query(insertAccountUserQuery);
            res.json({
                message: 'Учетная запись создана', flag: true
            });

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred'
        });
    }
}

exports.addObject = async (req, res) => { //сохранение контактов
    const obj = req.body;
    try {
        const pool = await connection
        const sqlS = `SELECT * FROM objects WHERE objectname = @objectname AND uz=@uz`;
        const rows = await pool.request()
            .input('objectname', obj.objectname)
            .input('uz', obj.uz)
            .query(sqlS);
        if (rows.recordset.length > 0) {
            res.json({
                message: `Объект с таким именем - ${rows.recordset[0].objectname} уже есть`, flag: false
            });

        }
        else {
            const keys = Object.keys(obj);
            const columns = keys.join(', ');
            const values = keys.map(key => `@${key}`).join(', ');

            const sqls = `INSERT INTO objects (${columns}) OUTPUT INSERTED.incriment VALUES (${values})`;
            const request = pool.request();

            keys.forEach(key => {
                request.input(key, obj[key]);
            });

            const result = await request.query(sqls);
            const objectIncriment = result.recordset[0].incriment;

            // Вставка записи в таблицу accountUsers
            const insertAccountUserQuery = `
                    INSERT INTO accountObjects (uniqAccountID, uniqObjectID)
                    VALUES (@accountIncriment, @objectIncriment)
                `;
            await pool.request()
                .input('accountIncriment', sql.Int, obj.uz)
                .input('objectIncriment', sql.Int, objectIncriment)
                .query(insertAccountUserQuery);
            res.json({
                message: 'Объект добавлен', flag: true
            })

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred'
        });
    }
}



exports.addRetra = async (req, res) => { //сохранение контактов
    const obj = req.body.obj;

    try {
        const pool = await connection
        const sqlS = `SELECT * FROM retranslations WHERE nameRetra = @nameRetra AND uz=@uz`;
        const rows = await pool.request()
            .input('nameRetra', obj.nameRetra)
            .input('uz', obj.uz)
            .query(sqlS);
        if (rows.recordset.length > 0) {
            res.json({
                message: `Ретранслятор с таким именем - ${rows.recordset[0].nameRetra} уже есть`, flag: false
            });

        }
        else {
            const keys = Object.keys(obj);
            const columns = keys.join(', ');
            const values = keys.map(key => `@${key}`).join(', ');

            const sqls = `INSERT INTO retranslations (${columns}) OUTPUT INSERTED.incriment VALUES (${values})`;
            const request = pool.request();

            keys.forEach(key => {
                request.input(key, obj[key]);
            });

            const result = await request.query(sqls);
            const retraIncriment = result.recordset[0].incriment;

            // Вставка записи в таблицу accountGroups
            const insertAccountUserQuery = `
                    INSERT INTO accountRetra (uniqAccountID, uniqRetraID)
                    VALUES (@accountIncriment, @retraIncriment)`;
            await pool.request()
                .input('accountIncriment', sql.Int, obj.uz)
                .input('retraIncriment', sql.Int, retraIncriment)
                .query(insertAccountUserQuery);

            res.json({
                message: 'Ретранслятор добавлен', flag: true
            })

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred'
        });
    }
}
exports.addGroup = async (req, res) => { //сохранение контактов
    const obj = req.body.obj;
    const arrayObjects = req.body.arrayObjects
    try {
        const pool = await connection
        const sqlS = `SELECT * FROM groups WHERE nameGroup = @nameGroup AND uz=@uz`;
        const rows = await pool.request()
            .input('nameGroup', obj.nameGroup)
            .input('uz', obj.uz)
            .query(sqlS);
        if (rows.recordset.length > 0) {
            res.json({
                message: `Группа с таким именем - ${rows.recordset[0].nameGroup} уже есть`, flag: false
            });

        }
        else {
            const keys = Object.keys(obj);
            const columns = keys.join(', ');
            const values = keys.map(key => `@${key}`).join(', ');

            const sqls = `INSERT INTO groups (${columns}) OUTPUT INSERTED.incriment VALUES (${values})`;
            const request = pool.request();

            keys.forEach(key => {
                request.input(key, obj[key]);
            });

            const result = await request.query(sqls);
            const groupIncriment = result.recordset[0].incriment;

            for (let i = 0; i < arrayObjects.length; i++) {
                const insertgroupsAndObjectsQuery = `
        INSERT INTO groupsAndObjects (uniqObjectID, uniqGroupID)
        VALUES (@uniqObjectID, @groupIncriment)`;
                const currentObject = arrayObjects[i];
                console.log(Number(currentObject))
                await pool.request()
                    .input('uniqObjectID', sql.Int, Number(currentObject))
                    .input('groupIncriment', sql.Int, groupIncriment)
                    .query(insertgroupsAndObjectsQuery);
            }

            // Вставка записи в таблицу accountGroups
            const insertAccountUserQuery = `
                    INSERT INTO accountGroups (uniqAccountID, uniqGroupID)
                    VALUES (@accountIncriment, @groupIncriment)`;
            await pool.request()
                .input('accountIncriment', sql.Int, obj.uz)
                .input('groupIncriment', sql.Int, groupIncriment)
                .query(insertAccountUserQuery);
            res.json({
                message: 'Группа добавлена', flag: true
            })

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred'
        });
    }
}

const path = require('path');
exports.tests = async (req, res) => {
    const filePath = path.join(__dirname, 'test.html'); // Укажите путь к файлу
    res.sendFile(filePath);
};

exports.findProfil = async (req, res) => { //получение контактов
    const login = req.body.login
    const params = await databaseService.findToBaseProfil(login)
    res.json(params)
}

exports.deleteProfil = async (req, res) => { //удаление контактов
    const uniqId = req.body.uniqId
    const params = await databaseService.deleteToBaseProfil(uniqId)
    res.json(params)
}

exports.getAccountUsers = async function (req, res) {
    try {
        const pool = await connection;

        const sqlQuery = `
SELECT
    au.*,
    a.*,
    u.*,
    cu.name AS creator_name,
    cu.role AS creator_role,
    gcu.name AS global_creator_name,
    gcu.role AS global_creator_role,
    gcu.incriment AS global_creator_incriment
FROM
    users AS u
    LEFT JOIN accountUsers AS au ON au.uniqUsersID = u.incriment
    LEFT JOIN accounts AS a ON au.uniqAccountID = a.incriment
    LEFT JOIN users AS cu ON u.creater = cu.incriment
    LEFT JOIN users AS gcu ON cu.creater = gcu.incriment;`;

        const rows = await pool.request().query(sqlQuery);
        res.json(rows.recordset);
    } catch (error) {
        console.error('Error fetching account users:', error);
        res.status(500).json({ error: 'Error fetching account users' });
    }
}



module.exports.getUsers = async function (req, res) { //сохранение учетных данных нового пользователя
    const prava = req.body.role
    const creator = req.body.creater
    try {
        const pool = await connection
        let sqlS = '';
        if (prava === 'Интегратор') {
            sqlS = `
                SELECT * FROM users 
                WHERE role = 'Сервис-инженер' AND creater=${creator}
            `;
        } else {
            sqlS = `
                SELECT * FROM users 
                WHERE role = 'Интегратор' OR role = 'Сервис-инженер' OR role = 'Курсор'
            `;
        }
        const rows = await pool.request()
            .query(sqlS);
        res.json(rows.recordset)

    } catch (e) {
        console.log(e)
    }
}

exports.getAccounts = async function (req, res) { //сохранение учетных данных нового пользователя
    const creator = req.body.creater
    try {
        const pool = await connection
        const sqlS = `SELECT * FROM accounts`;

        const rows = await pool.request()
            .query(sqlS);
        res.json(rows.recordset)

    } catch (e) {
        console.log(e)
    }
}


exports.getAccountCreater = async function (req, res) { //поиск создателя аккаунта и юзеров
    try {
        const pool = await connection

        const sqlQuery = `
    SELECT
               a.*,
        u.name AS name,
            u.incriment AS incriment,
                u.idx AS idx,
        g.nameGroup AS nameGroup,
          g.incriment AS incriment,
              g.idx AS idx,
              r.nameRetra AS nameRetra,
                  r.incriment AS incriment,
                      r.idx AS idx,
        o.objectname AS objectname, 
             o.incriment AS incriment,  
                 o.idx AS idx, 
          cu.name AS creator_name,
        cu.role AS creator_role,
         gu.incriment AS global_creator
    FROM
        accountUsers AS au
        JOIN users AS u ON au.uniqUsersID = u.incriment
        JOIN accounts AS a ON au.uniqAccountID = a.incriment
        LEFT JOIN users AS cu ON a.uniqCreater = cu.incriment
           LEFT JOIN users AS gu ON cu.creater = gu.incriment
        LEFT JOIN accountObjects AS ao ON au.uniqAccountID = ao.uniqAccountID
        LEFT JOIN objects AS o ON ao.uniqObjectID = o.incriment
          LEFT JOIN accountGroups AS ag ON au.uniqAccountID = ag.uniqAccountID
        LEFT JOIN groups AS g ON ag.uniqGroupID = g.incriment
            LEFT JOIN accountRetra AS ar ON au.uniqAccountID = ar.uniqAccountID
        LEFT JOIN retranslations AS r ON ar.uniqRetraID = r.incriment
`;
        const rows = await pool.request()
            .query(sqlQuery);

        const struktura = rows.recordset.map(e => {
            return {
                accounts: {
                    incriment: e.incriment[0],
                    name: e.name[0],
                    uniqCreater: e.uniqCreater,
                    tp: e.uniqTP,
                    creator_name: e.creator_name,
                    creator_role: e.creator_role,
                    idx: e.idx[0],
                    global_creator: e.global_creator
                },
                users: {
                    incriment_account: e.incriment[0],
                    incriment: e.incriment[1],
                    name: e.name[1],
                    idx: e.idx[1],
                    uniqCreater: e.uniqCreater

                },
                groups: {
                    incriment_account: e.incriment[0],
                    incriment: e.incriment[2],
                    name: e.nameGroup,
                    idx: e.idx[2],
                    uniqCreater: e.uniqCreater,
                    global_creator: e.global_creator
                },
                objects: {
                    incriment_account: e.incriment[0],
                    incriment: e.incriment[4],
                    name: e.objectname,
                    idx: e.idx[3],
                    uniqCreater: e.uniqCreater,
                    global_creator: e.global_creator
                },
                retras: {
                    incriment_account: e.incriment[0],
                    incriment: e.incriment[3],
                    name: e.nameRetra,
                    idx: e.idx[4],
                    uniqCreater: e.uniqCreater,
                    global_creator: e.global_creator
                }
            }
        })
        // Создание Map для хранения уникальных значений
        const uniqueAccounts = new Map();
        const uniqueUsers = new Map();
        const uniqueGroups = new Map();
        const uniqueObjects = new Map();
        const uniqueRetras = new Map();
        // Итерация по массиву и добавление уникальных значений
        struktura.forEach(e => {
            if (e.accounts.name) { uniqueAccounts.set(e.accounts.incriment, e.accounts); }
            if (e.users.name) { uniqueUsers.set(e.users.incriment, e.users); }
            if (e.groups.name) { uniqueGroups.set(e.groups.incriment, e.groups); }
            if (e.objects.name) { uniqueObjects.set(e.objects.incriment, e.objects); }
            if (e.retras.name) { uniqueRetras.set(e.retras.incriment, e.retras); }
        });
        // Преобразование Map в массивы
        const uniqStruktura = {
            uniqueAccounts: Array.from(uniqueAccounts.values()),
            uniqueUsers: Array.from(uniqueUsers.values()),
            uniqueGroups: Array.from(uniqueGroups.values()),
            uniqueObjects: Array.from(uniqueObjects.values()),
            uniqueRetras: Array.from(uniqueRetras.values())
        };
        // Добавление количества уникальных пользователей, групп и объектов к каждому аккаунту
        uniqStruktura.uniqueAccounts.forEach(account => {
            // Подсчет уникальных пользователей
            account.uniqueUsersCount = uniqStruktura.uniqueUsers.filter(e => e.incriment_account === account.incriment && e.incriment !== account.uniqCreater).length;
            // Подсчет уникальных групп
            account.uniqueGroupsCount = uniqStruktura.uniqueGroups.filter(e => e.incriment_account === account.incriment).length;
            // Подсчет уникальных объектов
            account.uniqueObjectsCount = uniqStruktura.uniqueObjects.filter(e => e.incriment_account === account.incriment).length;
            // Подсчет уникальных ретрансляторов
            account.uniqueRetrasCount = uniqStruktura.uniqueRetras.filter(e => e.incriment_account === account.incriment).length;
        });

        res.json(uniqStruktura)

    } catch (e) {
        console.log(e)
    }
}




exports.getObjectsGroups = async function (req, res) {
    const incriment = req.body.incriment
    console.log(incriment)
    try {
        const pool = await connection;

        const sqlS = `
    SELECT
        o.*,
        ao.*,
        o.objectname AS name
       
    FROM
        accountObjects AS ao
    JOIN
        objects AS o ON o.incriment = ao.uniqObjectID
        
    WHERE
        ao.uniqAccountID = ${incriment}
     `;

        const obj = await pool.request()
            .query(sqlS);

        const sqlS2 = `
    SELECT
        o.*,
        ao.*,
            o.nameGroup AS name
       
    FROM
        accountGroups AS ao
    JOIN
        groups AS o ON o.incriment = ao.uniqGroupID
    WHERE
        ao.uniqAccountID = ${incriment}
     `;

        const groups = await pool.request()
            .query(sqlS2);

        res.json({ objects: obj.recordset, groups: groups.recordset });

    } catch (e) {
        console.log(e);
    }
}

exports.getObjectCreater = async function (req, res) {
    try {
        const pool = await connection;

        const sqlS = `
            SELECT
                o.*,
                a.*,
                u.name AS username,
                u.role AS userrole,
                gu.incriment AS global_creator,
                (
                    SELECT COUNT(*)
                    FROM groupsAndObjects AS go
                    WHERE go.uniqObjectID = o.incriment
                ) AS group_count
            FROM
                objects AS o
                JOIN accountObjects AS ao ON o.incriment = ao.uniqObjectID
                JOIN accounts AS a ON ao.uniqAccountID = a.incriment
                LEFT JOIN users AS u ON o.creater = u.incriment
                LEFT JOIN users AS gu ON u.creater = gu.incriment
        `;

        const rows = await pool.request()
            .query(sqlS);
        res.json(rows.recordset);

    } catch (e) {
        console.log(e);
    }
}

exports.getGroupCreater = async function (req, res) { //поиск создателя аккаунта и юзеров
    try {
        const pool = await connection

        const sqlS = `
            SELECT
                o.*,
                a.*,
                 u.name AS username,
                u.role AS userrole,
                   gu.incriment AS global_creator,
                    (
                    SELECT COUNT(*)
                    FROM groupsAndObjects AS go
                    WHERE go.uniqGroupID = o.incriment
                ) AS object_count
            FROM
                groups AS o
                JOIN accountGroups AS ao ON o.incriment = ao.uniqGroupID
                JOIN accounts AS a ON ao.uniqAccountID = a.incriment
                 LEFT JOIN users AS u ON o.creater = u.incriment
                    LEFT JOIN users AS gu ON u.creater = gu.incriment`;
        const result = await pool.request()
            .query(sqlS);
        const group = result.recordset
        // Запрос для получения объектов
        const sqlObjects = `
            SELECT
                uo.uniqGroupID,
                o.incriment,
                o.objectname
            FROM
                groupsAndObjects AS uo
                JOIN objects AS o ON uo.uniqObjectID = o.incriment;
        `;
        const objectsResult = await pool.request().query(sqlObjects);
        const objects = objectsResult.recordset;
        // Объединение результатов
        const data = group.map(group => {
            const object = objects.filter(obj => obj.uniqGroupID === group.incriment[0]);

            return {
                ...group,
                objects: object
            };
        });
        res.json(data)

    } catch (e) {
        console.log(e)
    }
}

exports.getRetraCreater = async function (req, res) { //поиск создателя аккаунта и юзеров
    try {
        const pool = await connection

        const sqlS = `
            SELECT
                o.*,
                a.*,
                 u.name AS username,
                u.role AS userrole,
                   gu.incriment AS global_creator,
                     (
                    SELECT COUNT(*)
                    FROM retraObjects AS go
                    WHERE go.uniqRetraID = o.incriment
                ) AS object_count,
                    (
                    SELECT COUNT(*)
                    FROM retraGroups AS go
                    WHERE go.uniqRetraID = o.incriment
                ) AS group_count
                   
            FROM
                retranslations AS o
                JOIN accountRetra AS ao ON o.incriment = ao.uniqRetraID
                JOIN accounts AS a ON ao.uniqAccountID = a.incriment
                 LEFT JOIN users AS u ON o.creater = u.incriment
                    LEFT JOIN users AS gu ON u.creater = gu.incriment`;
        const rows = await pool.request()
            .query(sqlS);
        // Запрос для получения объектов
        const sqlObjects = `
            SELECT
                uo.uniqRetraID,
                o.incriment,
                o.objectname
            FROM
                retraObjects AS uo
                JOIN objects AS o ON uo.uniqObjectID = o.incriment;
        `;
        const objectsResult = await pool.request().query(sqlObjects);
        const objects = objectsResult.recordset;
        // Запрос для получения групп
        const sqlGroups = `
            SELECT
                ug.uniqRetraID,
                g.incriment,
                g.nameGroup
            FROM
                retraGroups AS ug
                JOIN groups AS g ON ug.uniqGroupID = g.incriment;
        `;
        const groupsResult = await pool.request().query(sqlGroups);
        const groups = groupsResult.recordset;

        // Объединение результатов
        const userData = rows.recordset.map(user => {
            const userObjects = objects.filter(obj => obj.uniqRetraID === user.incriment[0]);
            const userGroups = groups.filter(grp => grp.uniqRetraID === user.incriment[0]);
            return {
                ...user,
                objects: userObjects,
                groups: userGroups
            };
        });

        res.json(userData)

    } catch (e) {
        console.log(e)
    }
}
exports.getUsersContent = async function (req, res) {
    try {
        const pool = await connection;

        // Основной запрос для получения пользователей и их счетчиков
        const sqlS = `
            SELECT
                a.*,
                u.*,
                a.name AS accountname,
                gu.name AS username,
                gu.role AS userrole,
                gu.incriment AS global_creator,
                (
                    SELECT COUNT(*)
                    FROM usersObjects AS uo
                    WHERE uo.uniqUsersID = u.incriment
                ) AS object_count,
                (
                    SELECT COUNT(*)
                    FROM usersGroups AS ug
                    WHERE ug.uniqUsersID = u.incriment
                ) AS group_count
            FROM
                users AS u
                LEFT JOIN accountUsers AS au ON u.incriment = au.uniqUsersID
                LEFT JOIN accounts AS a ON au.uniqAccountID = a.incriment
                LEFT JOIN users AS gu ON u.creater = gu.incriment;
        `;
        const usersResult = await pool.request().query(sqlS);
        const users = usersResult.recordset;
        console.log(users)
        // Запрос для получения объектов
        const sqlObjects = `
            SELECT
                uo.uniqUsersID,
                o.incriment,
                o.objectname
            FROM
                usersObjects AS uo
                JOIN objects AS o ON uo.uniqObjectID = o.incriment;
        `;
        const objectsResult = await pool.request().query(sqlObjects);
        const objects = objectsResult.recordset;
        console.log(objects)
        // Запрос для получения групп
        const sqlGroups = `
            SELECT
                ug.uniqUsersID,
                g.incriment,
                g.nameGroup
            FROM
                usersGroups AS ug
                JOIN groups AS g ON ug.uniqGroupID = g.incriment;
        `;
        const groupsResult = await pool.request().query(sqlGroups);
        const groups = groupsResult.recordset;

        // Объединение результатов
        const userData = users.map(user => {
            const userObjects = objects.filter(obj => obj.uniqUsersID === user.incriment[1]);
            const userGroups = groups.filter(grp => grp.uniqUsersID === user.incriment[1]);
            return {
                ...user,
                objects: userObjects,
                groups: userGroups
            };
        });

        res.json(userData);
    } catch (e) {
        console.log(e);
        res.status(500).send('Internal Server Error');
    }
};


exports.geAccContent = async function (req, res) {
    try {
        const pool = await connection;

        // Основной запрос для получения пользователей и их счетчиков
        const sqlS = `
            SELECT
                a.*,
                               cu.*,
                a.name AS accountname,
                gu.name AS username,
                gu.role AS userrole,
                gu.incriment AS global_creator,
                (
                    SELECT COUNT(*)
                    FROM accountRetra AS ar
                    WHERE ar.uniqAccountID = a.incriment
                ) AS retra_count,
                (
                    SELECT COUNT(*)
                    FROM accountUsers AS au
                    WHERE au.uniqAccountID = a.incriment
                ) AS user_count,
                  (
                    SELECT COUNT(*)
                    FROM accountGroups AS ag
                    WHERE ag.uniqAccountID = a.incriment
                ) AS object_count,
                (
                    SELECT COUNT(*)
                    FROM accountObjects AS ao
                    WHERE ao.uniqAccountID = a.incriment
                ) AS group_count
            FROM
                accounts AS a
                LEFT JOIN accountUsers AS au ON a.incriment = au.uniqUsersID
                LEFT JOIN users AS cu ON a.uniqCreater = cu.incriment
           LEFT JOIN users AS gu ON cu.creater = gu.incriment
        `;
        const usersResult = await pool.request().query(sqlS);
        const users = usersResult.recordset;
        //   console.log(users)
        // Запрос для получения объектов
        const sqlObjects = `
            SELECT
                uo.uniqAccountID,
                o.incriment,
                o.objectname AS name
            FROM
                accountObjects AS uo
                JOIN objects AS o ON uo.uniqObjectID = o.incriment;
        `;
        const objectsResult = await pool.request().query(sqlObjects);
        const objects = objectsResult.recordset;
        // console.log(objects)
        // Запрос для получения групп
        const sqlGroups = `
            SELECT
                ug.uniqAccountID,
                g.incriment,
                g.nameGroup AS name
            FROM
                accountGroups AS ug
                JOIN groups AS g ON ug.uniqGroupID = g.incriment;
        `;
        const groupsResult = await pool.request().query(sqlGroups);
        const groups = groupsResult.recordset;

        const sqlUsers = `
            SELECT
                ug.uniqAccountID,
                g.incriment,
                g.name  AS name
            FROM
                accountUsers AS ug
                JOIN users AS g ON ug.uniqUsersID = g.incriment;
        `;
        const userssResult = await pool.request().query(sqlUsers);
        const usesrs = userssResult.recordset;

        const sqlRetras = `
            SELECT
                ug.uniqAccountID,
                g.incriment,
                g.nameRetra AS name
            FROM
                accountRetra AS ug
                JOIN retranslations AS g ON ug.uniqRetraID = g.incriment;
        `;
        const retraResult = await pool.request().query(sqlRetras);
        const retras = retraResult.recordset;
        // Объединение результатов
        const userData = users.map(user => {
            const obj = objects.filter(obj => obj.uniqAccountID === user.incriment[0]);
            const gro = groups.filter(grp => grp.uniqAccountID === user.incriment[0]);
            const use = usesrs.filter(grp => grp.uniqAccountID === user.incriment[0]);
            const ret = retras.filter(grp => grp.uniqAccountID === user.incriment[0]);
            return {
                ...user,
                objects: obj,
                groups: gro,
                users: use,
                retras: ret,
            };
        });
        res.json(userData);
    } catch (e) {
        console.log(e);
        res.status(500).send('Internal Server Error');
    }
};


exports.deleteAccount = async function (req, res) {
    const incriment = req.body.id;
    const index = req.body.index;
    const pool = await connection; // Получение подключения к базе данных
    console.log(incriment, index)
    try {
        if (index == '0') {
            const userIds = await methods('accountUsers', 'uniqUsersID', 'uniqAccountID')
            const objectIds = await methods('accountObjects', 'uniqObjectID', 'uniqAccountID')
            const groupIds = await methods('accountGroups', 'uniqGroupID', 'uniqAccountID')
            const retraIds = await methods('accountRetra', 'uniqRetraID', 'uniqAccountID')
            if (userIds.length > 0) {
                const userIdsString = userIds.join(',');
                const deleteUsersSql =
                    `DELETE FROM users
                        WHERE incriment IN(${userIdsString})
                        AND role IN('Пользователь', 'Администратор');
                    `;
                await pool.request().query(deleteUsersSql);
            }
            if (objectIds.length > 0) {
                const objectIdsString = objectIds.join(',');
                const deleteObjectsSql =
                    `DELETE FROM objects
                        WHERE incriment IN(${objectIdsString})`;
                await pool.request().query(deleteObjectsSql);
            }
            if (groupIds.length > 0) {
                const groupIdsString = groupIds.join(',');
                const deleteGroupsObjectsSql =
                    `DELETE FROM groups
                        WHERE incriment IN(${groupIdsString})`;
                await pool.request().query(deleteGroupsObjectsSql);
            }

            if (retraIds.length > 0) {
                const retraIdsString = retraIds.join(',');
                const deleteRetraObjectsSql =
                    `DELETE FROM retranslations
                        WHERE incriment IN(${retraIdsString})`;
                await pool.request().query(deleteRetraObjectsSql);
            }
            // Шаг 4: Удаляем сам аккаунт из accounts
            const deleteAccountSql =
                `DELETE FROM accounts
                    WHERE incriment = @incriment;
                `;
            await pool.request()
                .input('incriment', incriment)
                .query(deleteAccountSql);

            res.json({
                message: 'Аккаунт успешно удален'
            });
        }
        else if (index == 1) {
            await delete_method('users')
            res.json({
                message: 'Пользователь удален'
            });
        }
        else if (index == 2) {
            await delete_method('objects')
            res.json({
                message: 'Объект удален'
            });
        }
        else if (index == 5) {
            const groupIds = await methods('retraGroups', 'uniqGroupID', 'uniqRetraID')
            const objectsIds = await methods('retraObjects', 'uniqObjectID', 'uniqRetraID')
            if (groupIds.length > 0) {
                const groupIdsString = groupIds.join(',');
                const deleteRetraGroupsSql =
                    `DELETE FROM groups
                        WHERE incriment IN(${groupIdsString})`;
                await pool.request().query(deleteRetraGroupsSql);
            }

            if (objectsIds.length > 0) {
                const objectsIdsString = objectsIds.join(',');
                const deleteRetraObjectsSql =
                    `DELETE FROM objects
                        WHERE incriment IN(${objectsIdsString})`;
                await pool.request().query(deleteRetraObjectsSql);
            }
            await delete_method('retranslations')
            res.json({
                message: 'Ретранслятор удален'
            });
        }
        else {
            await delete_method('groups')
            res.json({
                message: 'Группа удалена'
            });
        }
    } catch (e) {
        // В случае ошибки откат транзакции и отправка сообщения об ошибке клиенту
        console.error(e);
        res.status(500).json({
            message: 'Произошла ошибка при удалении аккаунта'
        });
    }


    async function methods(table, kluch, ifs) {
        const findUsersSql =
            `SELECT ${kluch}
                FROM ${table}
                WHERE ${ifs} = @incriment;
            `;
        const usersResult = await pool.request()
            .input('incriment', incriment)
            .query(findUsersSql);

        const res = usersResult.recordset.map(row => row[kluch]);
        console.log('Связанные сущности:', res);
        return res
    }

    async function delete_method(table) {
        const sql = `DELETE FROM ${table} WHERE incriment = @incriment`;
        await pool.request()
            .input('incriment', incriment)
            .query(sql);

    }
};




module.exports.signup = async function (req, res) { //сохранение учетных данных нового пользователя
    const { login, password, role, idx, uz, creater } = req.body.obj;
    const objectsId = req.body.objects
    const groupsid = req.body.groups
    try {
        const pool = await connection
        const sqlS = `SELECT * FROM users WHERE name = @name AND uz=@uz`;
        const rows = await pool.request()
            .input('name', sql.NVarChar, login)
            .input('uz', sql.NVarChar, uz)
            .query(sqlS);
        if (rows.recordset.length > 0) {
            res.json({
                message: `Пользователь с таким Логином - ${rows.recordset[0].name} уже есть`, flag: false
            });
            //  return;
        }
        else {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            const insertUserQuery = `
                INSERT INTO users (idx, name, password, role, uz, creater)
                OUTPUT INSERTED.incriment
                VALUES (@idx, @login, @password, @role, @uz, @creater)
            `;
            const userResult = await pool.request()
                .input('idx', idx)
                .input('login', login)
                .input('password', hashedPassword)
                .input('role', role)
                .input('uz', uz)
                .input('creater', creater)
                .query(insertUserQuery);


            let iduz = uz ? uz : null
            //  if (uz) {
            const userIncriment = userResult.recordset[0].incriment;

            // Вставка записи в таблицу accountUsers
            const insertAccountUserQuery = `
                  INSERT INTO accountUsers (uniqAccountID, uniqUsersID)
                  VALUES (@AccountIncriment, @UserIncriment)
              `;
            await pool.request()
                .input('AccountIncriment', sql.Int, iduz)
                .input('UserIncriment', sql.Int, userIncriment)
                .query(insertAccountUserQuery);
            //   }
            if (objectsId.length !== 0) {
                // Вставка записи в таблицу usersObjects
                for (let i = 0; i < objectsId.length; i++) {
                    const insertgroupsAndObjectsQuery = `
        INSERT INTO usersObjects (uniqObjectID, uniqUsersID)
        VALUES (@uniqObjectID, @userIncriment)`;
                    const currentObject = objectsId[i];
                    await pool.request()
                        .input('uniqObjectID', sql.Int, Number(currentObject))
                        .input('userIncriment', sql.Int, userIncriment)
                        .query(insertgroupsAndObjectsQuery);
                }
            }
            if (groupsid.length !== 0) {
                // Вставка записи в таблицу usersObjects
                for (let i = 0; i < groupsid.length; i++) {
                    const insertgroupsAndObjectsQuery = `
        INSERT INTO usersGroups (uniqGroupID,uniqUsersID)
        VALUES (@uniqGroupID, @userIncriment)`;
                    const currentObject = groupsid[i];
                    await pool.request()
                        .input('uniqGroupID', sql.Int, Number(currentObject))
                        .input('userIncriment', sql.Int, userIncriment)
                        .query(insertgroupsAndObjectsQuery);
                }
            }
            res.json({
                message: 'Пользователь зарегистрирован', flag: true
            });

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred'
        });
    }
};


module.exports.page = async function (req, res) { //получение страницы с формой авторизации
    res.render('form.ejs', { message: '' });
}

module.exports.sing = async function (req, res) { // авторизация
    try {
        const pool = await connection;
        // Используем параметризованный запрос для получения пользователя по имени
        const result = await pool.request()
            .input('username', req.body.username)
            .query('SELECT * FROM users WHERE name = @username');

        if (result.recordset.length === 0) {
            res.render('form.ejs', { message: 'Пользователь не найден!' });
            return;
        }
        const users = result.recordset;
        let matchedUser = null;
        // Проверяем пароли асинхронно с помощью цикла for
        for (const user of users) {
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (isMatch) {
                matchedUser = user;
                break; // Выходим из цикла, если нашли совпадение
            }
        }
        if (!matchedUser) {
            res.render('form.ejs', { message: 'Неверный пароль!' });
            return;
        }

        const token = jwt.sign({
            userId: matchedUser.idx,
            user: matchedUser.name
        }, process.env.JWT_SECRET || 'jwt-key', { expiresIn: '300d' });

        res.cookie('AuthToken', token);
        res.cookie('name', matchedUser.name);
        res.redirect('/action');
    } catch (error) {
        console.error('Ошибка: ' + error);
        res.status(500).json({ error: 'Произошла ошибка при авторизации.' });
    }
};


module.exports.action = function (req, res) { //получение стартовой страницы приложения после авторизации
    console.log('экшион')

    if (req.user) {
        const login = req.user.name
        const role = req.user.role
        const incriment = req.user.incriment
        const device = req.headers['user-agent'];
        const platform = req.headers['sec-ch-ua-platform']
        const ip = req.ip
        //  logLogin(login, ip, platform, device) //сохранение логов входа пользователя
        console.log(login, role)
        res.render('in.ejs', {
            user: login,
            role: role,
            uniqIDCreater: incriment
        })

    }
    else {
        res.render('form.ejs')
    }
}


const fs = require('fs');


// Функция для записи логов
function logLogin(username, ip, platform, device) {
    // Получение текущей даты и времени
    const currentDate = new Date();
    // Формирование строки с данными для записи
    const logEntry = `Username: ${username}\nip: ${ip}\nLogin time: ${currentDate}\nPlatform: ${platform}\nDevice: ${device}\n\n`;

    // Запись строки в файл логов
    fs.appendFile('log.txt', logEntry, (err) => {
        if (err) {
            console.error('Ошибка записи лога:', err);
        } else {
            null//  console.log('Лог успешно записан');
        }
    });
}



module.exports.logout = async function (req, res, next) { //получение страницы с формой авторизации при выходе
    res.redirect('/');
}


module.exports.checkObject = async (req, res) => { //сохранение, удаление, обновление объектов wialon пользователя
    const { login, role, objects } = req.body;
    try {
        const pool = await connection;
        const selectBase = `SELECT id FROM userObjects`;
        const results = await pool.query(selectBase);

        if (results.recordset.length === 0) {
            for (const el of objects) {
                const postModel = `INSERT INTO userObjects(login, role, object, idw) VALUES('${login}','${role}','${el[0]}','${el[1]}')`;
                await pool.query(postModel);
            }
        } else {
            // await pool.beginTransaction();

            const deleteModel = `DELETE FROM  userObjects WHERE login='${login}'`;
            await pool.query(deleteModel);

            for (const el of objects) {
                const postModel = `INSERT INTO userObjects(login, role, object, idw) VALUES('${login}','${role}','${el[0]}','${el[1]}')`;
                await pool.query(postModel);
            }
        }

        res.json({ message: 'Объекты добавлены' })
    } catch (e) {
        console.log(e);

    }
}
module.exports.viewCheckObject = async (req, res) => { //получение названий и id объектов wialon пользователя
    const login = req.body.name
    try {
        const pool = await connection
        const selectBase = `SELECT Object, idw FROM userObjects WHERE login=@login`
        const results = await pool.request()
            .input('login', login)
            .query(selectBase)
        res.json(results.recordset)
    }
    catch (e) {
        console.log(e)
    }
}