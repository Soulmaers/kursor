const { parentPort } = require('worker_threads');
const wialonService = require('./wialon.service.js')
const wialonModule = require('../modules/wialon.module.js');
parentPort.on('message', async (data) => {
    const { login, token } = data
    try {
        const session = await wialonModule.login(token);
        const result = await processSensorData(login, session);
        parentPort.postMessage(result);
    } catch (error) {
        parentPort.postMessage({ error: error.message });
    }
});


async function processSensorData(login, session) {

    const data = await wialonService.getAllGroupDataFromWialon(session);
    if (!data) return [];
    const time = Math.floor(Date.now() / 1000);
    const results = [];
    // Проходим по каждой группе
    for (const elem of data.items) {
        const { nm: nameGroup, id: idGroup, u: nameObject } = elem;
        // Проходим по каждому объекту в группе
        for (const el of nameObject) {
            try {
                const [all, phone] = await Promise.all([
                    wialonService.getAllParamsIdDataFromWialon(el, session),
                    wialonService.getUniqImeiAndPhoneIdDataFromWialon(el, session)
                ]);
                // Проверяем наличие данных
                if (all.item && phone.item) {
                    results.push({
                        login,
                        data: String(time),
                        idg: String(idGroup),
                        name_g: nameGroup,
                        idObject: String(all.item.id),
                        nameObject: String(all.item.nm),
                        imei: phone.item.uid ? String(phone.item.uid) : null,
                        phone: phone.item.ph ? String(phone.item.ph) : null
                    });
                }
            } catch (error) {
                console.error(`Ошибка при получении данных для объекта ${el}: ${error}`);
                // Можно решить, добавлять ли в результат null или вообще пропустить этот шаг
            }
        }
    }
    return results; // Возвращаем массив без null значений
}





