const nodemailer = require('nodemailer');
const databaseService = require('./database.service')
const request = require("request");

exports.convertMessage = (mess) => {
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



exports.sendEmail = async(mess, login) => {
     const message = mess
    const msg = this.convertMessage(message)
         const contact = await databaseService.findToBaseProfil(login)
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
  }

exports.sendWhat = async(mess,login) => {
    console.log('сколько раз отправляю?')
    const message = mess
    const msg = this.convertMessage(message)
          const contact = await databaseService.findToBaseProfil(login)
        console.log(msg)
        if (contact.result.length !== 0) {
            const phone = parseFloat(contact.result[0].phone)
                     console.log(phone)
            console.log(typeof msg)
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
                console.log(response.body);
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
