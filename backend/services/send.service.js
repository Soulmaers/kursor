const nodemailer = require('nodemailer');
const databaseService = require('./database.service')
const request = require("request");

exports.convertMessage = (mess) => { //Шаблонирование строки уведомления
    let msg;
    if (mess.event === 'Заправка') {
        msg = `Событие: ${mess.event}\u2028${mess.group}\u2028Объект: ${mess.name}\u2028Заправлено: ${mess.litrazh} л.\u2028${mess.time}`
    }
    if (mess.event === 'Простой') {
        msg = `Событие: ${mess.event}\u2028${mess.group}\u2028Объект: ${mess.name}\nВремя простоя: ${mess.alarm}\u2028${mess.time}`
    }
    if (mess.event === 'Предупреждение') {
        msg = `Событие: ${mess.event}\u2028Объект: ${mess.name}\u2028${mess.tyres}\u2028Параметр: ${mess.param}\u2028${mess.alarm}\u2028${mess.time}`
    }
    if (mess.event === 'Слив') {
        msg = `Событие: ${mess.event}\u2028${mess.group}\u2028Объект: ${mess.name}\u2028Слив: ${mess.litrazh} л.\u2028${mess.time}`
    }
    if (mess.event === 'Потеря связи') {
        msg = `Событие: ${mess.event}\u2028${mess.group}\u2028Объект: ${mess.name}\u2028${mess.lasttime}`
    }
    return msg
}

exports.sendEmail = async (mess, login) => {  //отправка сообщения на электронную почту
    const message = mess
    const msg = this.convertMessage(message)
    const contact = await databaseService.findToBaseProfil(login)  //получение контактов из БД
    if (contact.length !== 0) {
        contact.forEach(el => {
            const email = el.email
            let smtpTransport;
            try {
                smtpTransport = nodemailer.createTransport({
                    host: 'smtp.mail.ru',
                    port: 465,
                    secure: true, // true for 465, false for other ports 587
                    auth: {
                        user: "develop@cursor-gps.ru",
                        pass: process.env.MAIL_PASS  //NphLycnf9gqPysYJt3jf
                    }
                });
            } catch (e) {
                return console.log('Error: ' + e.name + ":" + e.message);
            }

            let mailOptions = {
                from: 'develop@cursor-gps.ru', // sender address
                to: email, // list of receivers
                subject: 'Уведомление', // Subject line
                text: msg // plain text body
            };
            smtpTransport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    // return console.log(error);
                    return console.log(error);
                } else {
                    console.log('отправлено')

                }

            })
        })
    }
    else {
        return
    }
}

exports.sendWhat = async (mess, login) => { // отправка сообщения на whatsapp
    const message = mess
    const msg = this.convertMessage(message)
    const contact = await databaseService.findToBaseProfil(login) //получение контактов из БД
    if (contact.length !== 0) {
        contact.forEach(el => {
            const phone = parseFloat(el.phone)
            var options = {
                'method': 'POST',
                'url': 'https://wappi.pro/api/sync/message/send?profile_id=2c69ae90-ce24',
                'headers': {
                    'Authorization': 'd1ef53ec05c096936e8e4f970a350ba44ac34dff'
                },
                body: `{ "body": "${msg}", "recipient": "${phone}" }`
            };
            request(options, async function (error, response) {
                if (error) throw new Error(error);
            });

        });


    }
    else {
        return
    }
}

exports.sendTeleg = (mess) => {
    // console.log(mess, 'отправка в телегу')
}

exports.sendSMS = (mess) => {
    // console.log(mess, 'отправка смс')
}
