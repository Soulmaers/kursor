
const bitrix = require('../modules/bitrix/BitrixLogic')
const bitrixGetData = require('../modules/bitrix/BitrixGetData')
const axios = require('axios');





exports.webhookBitrixPressure = async (req, res) => { //отдаем протекторы по колесу
    const idw = req.query.id;
    try {
        const result = await bitrixGetData.BitrixGetData.getProtektorBitrix(idw); // Получение данных из БД
        const parametrs = bitrix.BitrixLogic.createData(result)
        const postData = {
            TEMPLATE_ID: 226,
            DOCUMENT_ID: [
                "crm",
                "Bitrix\\Crm\\Integration\\BizProc\\Document\\Dynamic",
                `DYNAMIC_146_${idw}`
            ],
            PARAMETERS: parametrs
        }
        res.json(parametrs)
        // Отправка данных на вебхук
        const response = await axios.post('https://logistics24.bitrix24.ru/rest/6/ihgxtr70t1iraeis/bizproc.workflow.start', postData);
        // Отправляем ответ сервера обратно клиенту
    } catch (error) {
        console.error('Error during data processing:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.webhookBitrixEvents = async (req, res) => { //отдаем протекторы по колесу
    const id_bitrix = req.query.id;
    const flag = req.query.flag;
    try {
        const result = await bitrixGetData.BitrixGetData.getIdObject(id_bitrix) // Получение данных из БД
        const idObject = result.length !== 0 ? result[0].idObject :
            res.json("Нет такого id");
        const mess = flag === '1' ? await bitrixGetData.BitrixGetData.setIDBitrixEvent(id_bitrix, idObject) :
            await bitrixGetData.BitrixGetData.deleteIDBitrixEvent(id_bitrix, idObject)
        console.log(mess)

        // Отправляем ответ сервера обратно клиенту
    } catch (error) {
        console.error('Error during data processing:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};


exports.webhookBitrixObject = async (req, res) => { //отдаем протекторы по колесу
    const idw = req.query.id;
    try {
        const result = await bitrixGetData.BitrixGetData.getDataBitrix(idw); // Получение данных из БД
        const idObject = result[0].idw
        const struktura = await bitrix.BitrixLogic.getStruktura(result)
        const parametrs = bitrix.BitrixLogic.createDataObject(struktura)
        const yandexMapsUrl = `https://yandex.ru/maps/?ll=${struktura.lon},${struktura.lat}&z=12&l=map&pt=${struktura.lon},${struktura.lat}`;
        //  const clickableLink = `<a href="${yandexMapsUrl}"`;
        parametrs['Parameter7'] = `${struktura.lon},${struktura.lat}`
        parametrs['Parameter8'] = yandexMapsUrl
        const postData = {
            TEMPLATE_ID: 314,
            DOCUMENT_ID: [
                "crm",
                "Bitrix\\Crm\\Integration\\BizProc\\Document\\Dynamic",
                `DYNAMIC_134_${idw} `
            ],
            PARAMETERS: parametrs
        }

        res.json(parametrs)
        // Отправка данных на вебхук
        const response = await axios.post('https://logistics24.bitrix24.ru/rest/6/ihgxtr70t1iraeis/bizproc.workflow.start', postData);

        // Токен доступа к API Яндекс.Карт
        /* const API_KEY = 'd07a6a59-c26d-44fa-9cf8-7702a0ad1c98';
 
         // Функция для получения данных о местоположении
         async function fetchLocation(lat, lon) {
             const url = `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${API_KEY}&geocode=${lon},${lat}`;
             try {
                 const response = await axios.get(url);
                 console.log(response.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted); // Обработка полученных данных
             } catch (error) {
                 console.error('Ошибка при запросе к Yandex Maps:', error);
             }
         }
 
         // Пример использования функции
         fetchLocation(struktura.lat, struktura.lon);*/


        // Отправляем ответ сервера обратно клиенту
    } catch (error) {
        console.error('Error during data processing:', error);
        res.status(500).json({ message: "Internal server error" });
    }


}


exports.pushEvent = async (arr, id, geo, group, name, start, idBitrix, time) => {
    console.log('отправил уведомление')
    const parametrs = await bitrix.BitrixLogic.createDataEvent(arr, geo, name, id, idBitrix, time)
    console.log(parametrs)

    const postData = {
        TEMPLATE_ID: 316,
        DOCUMENT_ID: [
            "crm",
            "Bitrix\\Crm\\Integration\\BizProc\\Document\\Dynamic",
            `DYNAMIC_134_${30}`
        ],
        PARAMETERS: parametrs
    }
    const response = await axios.post('https://logistics24.bitrix24.ru/rest/6/ihgxtr70t1iraeis/bizproc.workflow.start', postData);
    console.log(response.status)
}


// Функция для отправки сообщения
async function sendDelete() {

    const options = {
        method: 'POST',
        url: 'https://wappi.pro/api/sync/chat/delete?profile_id=2c69ae90-ce24',
        headers: {
            'Authorization': 'd1ef53ec05c096936e8e4f970a350ba44ac34dff',
            'Content-Type': 'application/json'
        },
        data: { recipient: "79956328283" }

    };

    try {
        const response = await axios(options);
        console.log(response.data)
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}
//sendDelete()




const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

let userSessions = {};
let processedMessages = new Set(); // Множество для отслеживания уже обработанных сообщений

async function sendMessage(contact, message) {
    console.log(contact, message);
    const options = {
        method: 'POST',
        url: 'https://wappi.pro/api/sync/message/send?profile_id=2c69ae90-ce24',
        headers: {
            'Authorization': 'd1ef53ec05c096936e8e4f970a350ba44ac34dff',
            'Content-Type': 'application/json'
        },
        data: {
            body: message,
            recipient: contact
        }
    };

    try {
        const response = await axios(options);
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}
const filePath = path.join(__dirname, 'conversations.xlsx');

function saveConversationToExcel(contact, message, session) {
    let workbook;

    if (fs.existsSync(filePath)) {
        workbook = XLSX.readFile(filePath);
    } else {
        workbook = XLSX.utils.book_new();
        const sheet = XLSX.utils.aoa_to_sheet([['Contact', 'Message', 'Step', 'Name', 'Phone', 'Timestamp']]);
        XLSX.utils.book_append_sheet(workbook, sheet, 'Conversations');
    }

    const sheet = workbook.Sheets['Conversations'];

    const newRow = [contact, message, session ? session.step : '', session ? session.name : '', session ? session.phone : '', new Date().toISOString()];
    XLSX.utils.sheet_add_aoa(sheet, [newRow], { origin: -1 });

    XLSX.writeFile(workbook, filePath);
}

exports.postWappi = async (req, res) => {
    const messages = req.body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).send('No messages received');
    }

    for (const messageData of messages) {
        const messageId = messageData.id;
        const contact = messageData.from;
        const message = messageData.body;
        console.log('Received message from:', contact);
        console.log('Message body:', message);

        if (processedMessages.has(messageId)) {
            // Если сообщение уже обработано, пропускаем его
            continue;
        }

        processedMessages.add(messageId);

        try {
            console.log(userSessions[contact])
            if (userSessions[contact] && userSessions[contact].finished) {
                // Если взаимодействие уже завершено, игнорируем новые сообщения
                continue;
            }
            if (!userSessions[contact]) {
                // Первый контакт
                userSessions[contact] = { step: 1, finished: false };
                saveConversationToExcel(contact, message, userSessions[contact]);
                await sendMessage(contact, 'Здравствуйте! Спасибо за ваш интерес. Как я могу к вам обращаться?');
                saveConversationToExcel('Курсор', 'Здравствуйте! Спасибо за ваш интерес. Как я могу к вам обращаться?', userSessions[contact]);
                userSessions[contact].step++;
            } else {
                const session = userSessions[contact];

                if (session.step === 2) {
                    // Получили имя
                    session.name = message;
                    saveConversationToExcel(contact, message, session);
                    await sendMessage(contact, 'Отлично! Пожалуйста, оставьте свой email, чтобы мы могли отправить вам подробную информацию');
                    saveConversationToExcel('Курсор', 'Отлично! Пожалуйста, оставьте свой email, чтобы мы могли отправить вам подробную информацию', session);
                    session.step++;
                } else if (session.step === 3) {
                    const url = `https://drive.google.com/file/d/13epRGSrnY06JM5nLKnrRtO-V7kqs7Bud/view?usp=sharing`
                    session.email = message;
                    saveConversationToExcel(contact, message, session);
                    await sendMessage(contact, `Вот ссылка на ознакомительную презентацию ${url}`);
                    saveConversationToExcel('Курсор', `Вот ссылка на ознакомительную презентацию ${url}`, session);
                    session.step++;
                    session.finished = true; // Завершаем сессию
                } else {
                    // Записываем сообщения для всех шагов
                    saveConversationToExcel(contact, message, session);
                }
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }

    res.status(200).send('Webhook received');
};