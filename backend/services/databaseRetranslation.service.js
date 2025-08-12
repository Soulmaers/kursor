
const { connection, sql } = require('../config/db')
const databaseRetranslation = require('./databaseRetranslation.service');
const { ReportSettingsManager } = require('../modules/reportSettingsManagerModule/class/ReportSettingsManager')


exports.addObjects = async (object) => {
    // console.log(object)
    const { idx, objectname, phonenumber, imeidevice, uz, uniqRetraID, nameRetra } = object
    //   console.log(idx, objectname, phonenumber, imeidevice, uz, uniqRetraID, nameRetra)
    try {
        const pool = await connection;
        const query = `SELECT incriment FROM objects WHERE idx=@idx AND incriment_retra=@incriment_retra`;
        const result = await pool.request()
            .input('idx', String(object.idx))
            .input('incriment_retra', String(uniqRetraID))
            .query(query)
        //  console.log(result.recordset)
        if (result.recordset.length > 0) {
            const updateFlagQuery = `
        UPDATE objects SET flag = 'true',imeidevice=@imeidevice  WHERE idx=@idx AND incriment_retra = @uniqRetraID`;
            await pool.request()
                .input('uniqRetraID', uniqRetraID)
                .input('idx', String(object.idx))
                .input('imeidevice', String(imeidevice))
                .query(updateFlagQuery);
            return
        }
        const instance = new ReportSettingsManager(String(object.idx))
        await instance.setSettings()
        // Вставляем новый объект в таблицу objects
        const insertObjectsQuery = `
            INSERT INTO objects (idx, objectname, phonenumber, imeidevice, uz,incriment_retra,name_retra)
            OUTPUT INSERTED.incriment
            VALUES (@idx, @objectname, @phonenumber, @imeidevice,@uz,@uniqRetraID,@nameRetra)
        `;
        const insertObjectsResult = await pool.request()
            .input('idx', String(idx))
            .input('objectname', objectname)
            .input('phonenumber', phonenumber)
            .input('imeidevice', imeidevice)
            .input('uniqRetraID', uniqRetraID)
            .input('nameRetra', nameRetra)
            .input('uz', uz)
            .query(insertObjectsQuery);

        const insertedIds = insertObjectsResult.recordset.map(row => row.incriment);
        //  console.log(insertedIds)
        const insertAccountObjectsQuery = `
            INSERT INTO accountObjects (uniqAccountID, uniqObjectID)
            VALUES (@accountIncriment, @objectIncriment)
        `;

        const insertRetraObjectsQuery = `
            INSERT INTO retraObjects (uniqRetraID, uniqObjectID)
            VALUES (@retraIncriment, @objectsIncriment)
        `;

        await Promise.all([
            pool.request()
                .input('accountIncriment', sql.Int, uz)
                .input('objectIncriment', sql.Int, insertedIds)
                .query(insertAccountObjectsQuery),

            pool.request()
                .input('retraIncriment', sql.Int, uniqRetraID)
                .input('objectsIncriment', sql.Int, insertedIds)
                .query(insertRetraObjectsQuery)
        ]);
        return insertedIds[0];

    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        throw error;
    }
};




exports.deleteObjects = async (table) => {
    const pool = await connection
    try {
        const updateFlagQuery = `DELETE FROM ${table} WHERE flag='false'`;
        await pool.request()
            .query(updateFlagQuery);

        return 'удалено'
    }
    catch (e) {
        console.log(e)
    }
}
exports.updateFlagForExistingObjects = async (uniqRetraID, table) => {
    const pool = await connection;
    const updateFlagQuery = `UPDATE ${table} SET flag ='false' WHERE incriment_retra = @uniqRetraID`;

    await pool.request()
        .input('uniqRetraID', uniqRetraID)
        .query(updateFlagQuery);
}

exports.addGroups = async (object) => {
    const { idx, nameGroup, uz, arrayIdObjects, uniqRetraID, nameRetra } = object
    try {
        const pool = await connection;
        const query = `SELECT idx, incriment FROM groups WHERE idx=@idx AND incriment_retra=@incriment_retra`;
        const result = await pool.request()
            .input('idx', String(object.idx))
            .input('incriment_retra', String(uniqRetraID))
            .query(query)
        const promises = arrayIdObjects.map(async e => await databaseRetranslation.addObjects(e))
        const incrimentsObjects = await Promise.all(promises)
        if (result.recordset.length > 0) {
            const updateFlagQuery = `UPDATE groups SET flag = 'true' WHERE idx=@idx AND incriment_retra = @uniqRetraID`;
            await pool.request()
                .input('uniqRetraID', uniqRetraID)
                .input('idx', String(object.idx))
                .query(updateFlagQuery);
            const newObject = incrimentsObjects.filter(e => e !== undefined)
            const insertGroupsAndObjectsPromises = newObject.map(currentObject => {
                const insertGroupsAndObjectsQuery = `
                      INSERT INTO groupsAndObjects (uniqObjectID, uniqGroupID)
                      VALUES (@uniqObjectID, @groupIncriment)
                  `;
                return pool.request()
                    .input('uniqObjectID', sql.Int, Number(currentObject))
                    .input('groupIncriment', sql.Int, result.recordset[0].incriment)
                    .query(insertGroupsAndObjectsQuery);
            });

            await Promise.all(insertGroupsAndObjectsPromises);
        }
        else {
            // Вставляем новый объект в таблицу objects
            const insertObjectsQuery = `
            INSERT INTO groups (idx, nameGroup, uz,incriment_retra,name_retra)
            OUTPUT INSERTED.incriment
            VALUES (@idx, @nameGroup, @uz,@uniqRetraID,@nameRetra)
        `;
            const insertGroupResult = await pool.request()
                .input('idx', String(idx))
                .input('nameGroup', nameGroup)
                .input('uz', uz)
                .input('uniqRetraID', uniqRetraID)
                .input('nameRetra', nameRetra)
                .query(insertObjectsQuery);

            const insertedIds = insertGroupResult.recordset.map(row => row.incriment);

            const insertAccountObjectsQuery = `
            INSERT INTO accountGroups (uniqAccountID, uniqGroupID)
            VALUES (@accountIncriment, @groupIncriment)
        `;
            const insertRetraObjectsQuery = `
            INSERT INTO retraGroups (uniqRetraID, uniqGroupID)
            VALUES (@retraIncriment, @groupsIncriment)
        `;

            await Promise.all([
                pool.request()
                    .input('accountIncriment', sql.Int, uz)
                    .input('groupIncriment', sql.Int, insertedIds)
                    .query(insertAccountObjectsQuery),

                pool.request()
                    .input('retraIncriment', sql.Int, uniqRetraID)
                    .input('groupsIncriment', sql.Int, insertedIds)
                    .query(insertRetraObjectsQuery)
            ]);
            //   console.log(incrimentsObjects)
            const insertGroupsAndObjectsPromises = incrimentsObjects.map(currentObject => {
                console.log(currentObject)
                const insertGroupsAndObjectsQuery = `
                INSERT INTO groupsAndObjects (uniqObjectID, uniqGroupID)
                VALUES (@uniqObjectID, @groupIncriment)
            `;
                return pool.request()
                    .input('uniqObjectID', sql.Int, Number(currentObject))
                    .input('groupIncriment', sql.Int, insertedIds)
                    .query(insertGroupsAndObjectsQuery);
            });
            //   console.log(insertGroupsAndObjectsPromises)
            await Promise.all(insertGroupsAndObjectsPromises);
        }


        // console.log('Группа добавлена успешно');

    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        throw error;
    }
};


