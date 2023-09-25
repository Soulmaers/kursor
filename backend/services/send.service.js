const nodemailer = require('nodemailer');
const databaseService = require('./database.service')
const request = require("request");

exports.convertMessage = (mess) => {
    let msg;
    if (mess.event === 'Заправка') {
        msg = `Событие: ${mess.event}\n${mess.group}\nОбъект: ${mess.name}\nЗаправлено: ${mess.litrazh}\nВремя заправки: ${mess.time}`
    }
    if (mess.event === 'Простой') {
        msg = `Событие: ${mess.event}\n${mess.group}\nОбъект: ${mess.name}\nВремя простоя: ${mess.alarm}\nВремя события: ${mess.time}`
    }
    if (mess.event === 'Предупреждение') {
        msg = `Событие: ${mess.event}\nОбъект: ${mess.name}\n${mess.tyres}\nПараметр: ${mess.param}\n${mess.alarm}\nВремя события: ${mess.time}`
    }
    if (mess.event === 'Слив') {
        msg = `Событие: ${mess.event}\n${mess.group}\nОбъект: ${mess.name}\nСлив: ${mess.litrazh}\nВремя события: ${mess.time}`
    }
    return msg
}



exports.sendEmail = (mess) => {
    //  console.log(mess, 'отправка на почту')
    const message = mess.msg[0]
    const msg = this.convertMessage(message)
    //  console.log(msg)
    mess.logins.forEach(async el => {
        const contact = await databaseService.findToBaseProfil(el)
        if (contact.result.length !== 0) {
            const email = contact.result[0].email

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
        }
        else {
            return
        }
    })
}


exports.sendWhat = (mess) => {
    //ultramsg.com
    const message = mess.msg[0]
    const msg = this.convertMessage(message)
    mess.logins.forEach(async el => {
        const contact = await databaseService.findToBaseProfil(el)
        console.log(msg)
        if (contact.result.length !== 0) {
            const phone = parseFloat(contact.result[0].phone)

            var option = {
                method: 'POST',
                url: 'https://api.ultramsg.com/instance45156/messages/chat',
                headers: { 'content-type': ' application/x-www-form-urlencoded' },
                form: {
                    "token": "0cnqlft2roemo3j4",
                    "to": phone,
                    "body": msg
                }
            };
            request(option, function (error, response, body) {
                if (error) throw new Error(error);
                console.log(body);
            });
        }
        else {
            return
        }
    })
}

exports.sendTeleg = (mess) => {
    // console.log(mess, 'отправка в телегу')
}

exports.sendSMS = (mess) => {
    // console.log(mess, 'отправка смс')
}
