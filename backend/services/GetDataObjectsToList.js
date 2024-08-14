const { connection, sql } = require('../config/db')
const databaseService = require('./database.service');

class GetDataObjectsToList {

    static getAccountsAddListKursor = async () => {
        const pool = await connection;
        try {
            let accountResult = await pool.request()
                .query(`
                SELECT 
                    incriment AS inc_account,
                    name,
                    uniqCreater,
                    idx AS id
                FROM accounts;
            `);
            return accountResult.recordset
        }
        catch (e) {
            console.log(e)
        }
    }


    static getAccountsAddListIngener = async (userId) => {
        const pool = await connection;
        try {
            let accountResult = await pool.request()
                .input('incriment', sql.Int, Number(userId))
                .query(`
                SELECT 
                    incriment AS inc_account,
                    name,
                    uniqCreater,
                    idx AS id
                FROM accounts WHERE uniqCreater=@incriment;
            `);
            return accountResult.recordset
        }
        catch (e) {
            console.log(e)
        }
    }


    static getAccountsAddListIntegrator = async (userId) => {
        try {
            const pool = await connection;

            // Получаем creater для данного userId
            let userResult = await pool.request()
                .input('userId', sql.Int, Number(userId))
                .query(`
                SELECT 
                    incriment 
                FROM users 
                WHERE creater = @userId;
            `);

            let createrId = userResult.recordset.map(e => e.incriment)
            // Получаем аккаунты пользователя
            let accountResult = await pool.request()
                .input('incriment', sql.Int, Number(userId))
                .query(`
                SELECT 
                    incriment AS inc_account,
                    name,
                    uniqCreater,
                    idx AS id
                FROM accounts;
            `);

            let accounts = accountResult.recordset.filter(it => it.uniqCreater === Number(userId) || createrId.includes(it.uniqCreater));
            return accounts
        }
        catch (e) {
            console.log(e)
        }
    }

    static getUserGroupsAndObjects = async (userId) => {
        try {
            const pool = await connection;

            // Получаем группы и объекты, связанные с данным пользователем
            let groupAndObjectResult = await pool.request()
                .input('userId', sql.Int, Number(userId))
                .query(`
                SELECT 
                    g.incriment AS inc_group, 
                    g.nameGroup, 
                    g.idx AS group_id,
                    o.incriment AS inc_object, 
                    o.objectname,
                    o.idx AS object_id,
                       o.typeobject,
                       o.imeidevice
                FROM usersGroups ug
                JOIN groups g ON ug.uniqGroupID = g.incriment
                JOIN groupsAndObjects go ON g.incriment = go.uniqGroupID
                JOIN objects o ON go.uniqObjectID = o.incriment
                WHERE ug.uniqUsersID = @userId
                ORDER BY g.incriment, o.incriment;
            `);

            // Обработка групп и объектов
            const groups = groupAndObjectResult.recordset.reduce((acc, row) => {
                if (!acc[row.inc_group]) {
                    acc[row.inc_group] = {
                        inc_group: row.inc_group,
                        group_name: row.nameGroup,
                        group_id: row.group_id,
                        objects: []
                    };
                }
                acc[row.inc_group].objects.push({
                    inc_object: row.inc_object,
                    object_name: row.objectname,
                    object_id: row.object_id,
                    typeobject: row.typeobject,
                    group_name: row.nameGroup,
                    group_id: row.group_id,
                    imeidevice: row.imeidevice
                });
                return acc;
            }, {});

            // Получаем объекты, которые не принадлежат ни одной группе, но связаны с пользователем
            let ungroupedObjectsResult = await pool.request()
                .input('userId', sql.Int, Number(userId))
                .query(`
                SELECT 
                    o.incriment AS inc_object, 
                    o.objectname,
                    o.idx AS object_id,
                       o.typeobject,
                          o.imeidevice
                FROM usersObjects uo
                JOIN objects o ON uo.uniqObjectID = o.incriment
                WHERE uo.uniqUsersID = @userId
                ORDER BY o.incriment;
            `);

            let accounts = [{
                user_id: userId,
                groups: Object.values(groups),
                ungroupedObjects: ungroupedObjectsResult.recordset.map(row => ({
                    inc_object: row.inc_object,
                    object_name: row.objectname,
                    object_id: row.object_id,
                    typeobject: row.typeobject,
                    imeidevice: row.imeidevice
                }))
            }];

            // Обновляем объекты в группах и вне групп
            await Promise.all([
                ...accounts[0].groups.flatMap(group =>
                    group.objects.map(async (obj) => {
                        const params = await databaseService.loadParamsViewList(obj.object_name, Number(obj.object_id), obj);
                        const cleanParams = JSON.parse(JSON.stringify(params)); // Убираем циклические ссылки
                        Object.assign(obj, cleanParams); // Обновляем объект данными из loadParamsViewList
                    })
                ),
                ...accounts[0].ungroupedObjects.map(async (obj) => {
                    const params = await databaseService.loadParamsViewList(obj.object_name, Number(obj.object_id), obj);
                    const cleanParams = JSON.parse(JSON.stringify(params)); // Убираем циклические ссылки
                    Object.assign(obj, cleanParams); // Обновляем объект данными из loadParamsViewList
                })
            ]);

            return accounts;
        } catch (err) {
            console.error('Ошибка при получении данных:', err);
        }
    };


    static getAccountGroupsAndObjects = async (accounts) => {
        try {
            const pool = await connection;

            // Параллельно получаем группы и объекты для всех аккаунтов
            await Promise.all(accounts.map(async (account) => {
                // Получаем группы и объекты для каждого аккаунта
                let groupAndObjectResult = await pool.request()
                    .input('accountId', sql.Int, account.inc_account)
                    .query(`
                    SELECT 
                        g.incriment AS inc_group, 
                        g.nameGroup, 
                        g.idx AS group_id,
                        o.incriment AS inc_object, 
                        o.objectname,
                        o.idx AS object_id,
                        o.typeobject,
                           o.imeidevice
                    FROM accountGroups ag
                    JOIN groups g ON ag.uniqGroupID = g.incriment
                    JOIN groupsAndObjects go ON g.incriment = go.uniqGroupID
                    JOIN objects o ON go.uniqObjectID = o.incriment
                    WHERE ag.uniqAccountID = @accountId
                    ORDER BY g.incriment, o.incriment;
                `);

                // Обработка групп и объектов
                const groups = groupAndObjectResult.recordset.reduce((acc, row) => {
                    if (!acc[row.inc_group]) {
                        acc[row.inc_group] = {
                            inc_group: row.inc_group,
                            group_name: row.nameGroup,
                            group_id: row.group_id,
                            objects: []
                        };
                    }
                    acc[row.inc_group].objects.push({
                        inc_object: row.inc_object,
                        object_name: row.objectname,
                        object_id: row.object_id,
                        typeobject: row.typeobject,
                        group_name: row.nameGroup,
                        group_id: row.group_id,
                        imeidevice: row.imeidevice

                    });
                    return acc;
                }, {});

                // Получаем объекты, которые не принадлежат ни одной группе
                let ungroupedObjectsResult = await pool.request()
                    .input('accountId', sql.Int, account.inc_account)
                    .query(`
                    SELECT 
                        o.incriment AS inc_object, 
                        o.objectname,
                        o.idx AS object_id,
                           o.typeobject,
                              o.imeidevice
                    FROM accountObjects ao
                    JOIN objects o ON ao.uniqObjectID = o.incriment
                    LEFT JOIN groupsAndObjects go ON o.incriment = go.uniqObjectID
                    WHERE ao.uniqAccountID = @accountId
                    AND go.uniqObjectID IS NULL
                    ORDER BY o.incriment;
                `);
                // Обновляем данные объектов
                account.groups = Object.values(groups);
                account.ungroupedObjects = ungroupedObjectsResult.recordset.map(row => ({
                    inc_object: row.inc_object,
                    object_name: row.objectname,
                    object_id: row.object_id,
                    typeobject: row.typeobject,
                    imeidevice: row.imeidevice
                }));
                await GetDataObjectsToList.getStruktura(account)
            }));


            return accounts;
        } catch (err) {
            console.error('Ошибка при получении данных:', err);
        }
    }

    static async getStruktura(account) {

        // Обновляем объекты в группах и вне групп
        await Promise.all([
            ...account.groups.flatMap(group =>
                group.objects.map(async (obj) => {
                    const params = await databaseService.loadParamsViewList(obj.object_name, Number(obj.object_id), obj);
                    const cleanParams = JSON.parse(JSON.stringify(params)); // Убираем циклические ссылки
                    Object.assign(obj, cleanParams); // Обновляем объект данными из loadParamsViewList
                })
            ),
            ...account.ungroupedObjects.map(async (obj) => {
                const params = await databaseService.loadParamsViewList(obj.object_name, Number(obj.object_id), obj);
                const cleanParams = JSON.parse(JSON.stringify(params)); // Убираем циклические ссылки
                Object.assign(obj, cleanParams); // Обновляем объект данными из loadParamsViewList
            })
        ]);
        return account
    }
}


module.exports = GetDataObjectsToList