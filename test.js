const deleteAccount = async function (req, res) {
    const incriment = req.body.id;
    const index = req.body.index;
    const userRole = req.body.role; // Получаем роль пользователя из запроса
    const pool = await connection;

    try {
        const isCursor = userRole === 'Курсор'; // Проверяем, является ли пользователь "Курсор"

        if (index == '0') {
            // Получаем связанные сущности
            const userIds = await methods('accountUsers', 'uniqUsersID', 'uniqAccountID');
            const objectIds = await methods('accountObjects', 'uniqObjectID', 'uniqAccountID');
            const groupIds = await methods('accountGroups', 'uniqGroupID', 'uniqAccountID');
            const retraIds = await methods('accountRetra', 'uniqRetraID', 'uniqAccountID');

            if (isCursor) {
                // Если роль "Курсор", удаляем сущности
                if (userIds.length > 0) {
                    await deleteEntities('users', userIds);
                }
                if (objectIds.length > 0) {
                    await deleteEntities('objects', objectIds);
                }
                if (groupIds.length > 0) {
                    await deleteEntities('groups', groupIds);
                }
                if (retraIds.length > 0) {
                    await deleteEntities('retranslations', retraIds);
                }
                await deleteEntity('accounts', incriment);
            } else {
                // Если роль не "Курсор", помечаем сущности как удаленные
                if (userIds.length > 0) {
                    await setFlagFalse('users', userIds);
                }
                if (objectIds.length > 0) {
                    await setFlagFalse('objects', objectIds);
                }
                if (groupIds.length > 0) {
                    await setFlagFalse('groups', groupIds);
                }
                if (retraIds.length > 0) {
                    await setFlagFalse('retranslations', retraIds);
                }
                await setFlagFalse('accounts', [incriment]);
            }

            res.json({
                message: 'Операция завершена'
            });
        } else if (index == '1') {
            if (isCursor) {
                await deleteEntity('users', incriment);
            } else {
                await setFlagFalse('users', [incriment]);
            }
            res.json({ message: 'Пользователь удален' });
        } else if (index == '2') {
            if (isCursor) {
                await deleteEntity('objects', incriment);
            } else {
                await setFlagFalse('objects', [incriment]);
            }
            res.json({ message: 'Объект удален' });
        } else if (index == '5') {
            const groupIds = await methods('retraGroups', 'uniqGroupID', 'uniqRetraID');
            const objectsIds = await methods('retraObjects', 'uniqObjectID', 'uniqRetraID');

            if (isCursor) {
                if (groupIds.length > 0) {
                    await deleteEntities('groups', groupIds);
                }
                if (objectsIds.length > 0) {
                    await deleteEntities('objects', objectsIds);
                }
                await deleteEntity('retranslations', incriment);
            } else {
                if (groupIds.length > 0) {
                    await setFlagFalse('groups', groupIds);
                }
                if (objectsIds.length > 0) {
                    await setFlagFalse('objects', objectsIds);
                }
                await setFlagFalse('retranslations', [incriment]);
            }
            res.json({ message: 'Ретранслятор удален' });
        } else {
            if (isCursor) {
                await deleteEntity('groups', incriment);
            } else {
                await setFlagFalse('groups', [incriment]);
            }
            res.json({ message: 'Группа удалена' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: 'Произошла ошибка при выполнении операции'
        });
    }

    async function methods(table, kluch, ifs) {
        const query =
            `SELECT ${kluch}
             FROM ${table}
             WHERE ${ifs} = @incriment;
            `;
        const result = await pool.request()
            .input('incriment', incriment)
            .query(query);

        return result.recordset.map(row => row[kluch]);
    }

    async function deleteEntities(table, ids) {
        const idsString = ids.join(',');
        const sql = `DELETE FROM ${table} WHERE incriment IN (${idsString})`;
        await pool.request().query(sql);
    }

    async function deleteEntity(table, incriment) {
        const sql = `DELETE FROM ${table} WHERE incriment = @incriment`;
        await pool.request().input('incriment', incriment).query(sql);
    }

    async function setFlagFalse(table, ids) {
        const idsString = ids.join(',');
        const sql = `UPDATE ${table} SET FLAG = 'FALSE' WHERE incriment IN (${idsString})`;
        await pool.request().query(sql);
    }
};