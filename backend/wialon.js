
const wialon = require('wialon');
const express = require('express');
const connection = require('./config/db')
const request = require("request");
const { prms } = require('./params');

const app = express();
app.use(express.json());


//0f481b03d94e32db858c7bf2d8415204289C57FB5B35C22FC84E9F4ED84D5063558E1178-токен основной



function mail(value, mess) {
    // console.log(value)
    // console.log('ватсап')
    const tyres = mess[value[0][2]]
    let val;
    let message;
    if (value[0][5] !== 'Норма') {
        value[0][5] !== 'Потеря связи с датчиком' ? val = value[0][3] + ' ' + 'Бар' : val = ''
        message = `Сообщение: Опасность! Требуется немедленная остановка.\nВремя: ${value[0][0]}\nМашина:  ${value[0][1]}\nСобытие: ${value[0][5]}\nПараметр: ${val}\nКолесо:  ${tyres}`
        console.log(message + 'не норма')
    }
    /*
    else {
        message = `Сообщение: Показатели в норме.\nВремя: ${value[0][0]}\nМашина:  ${value[0][1]}\nСобытие: ${value[0][5]}\nПараметр: ${value[0][3]}Бар\nКолесо:  ${tyres}`
        console.log(message + 'норма')
    }*/


    /*
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
        }*/
    /*
        let mailOptions = {
            from: 'develop@cursor-gps.ru', // sender address
            to: 'soulmaers@gmail.com, m.trofimov@cursor-gps.ru', // list of receivers
            subject: 'Аларм', // Subject line
            text: message // plain text body
        };
        smtpTransport.sendMail(mailOptions, (error, info) => {
            if (error) {
                // return console.log(error);
                return console.log(error);
            } else {
                console.log('отправлено')
            }
    
        })*/
    /*
    var options = {
        method: 'POST',
        url: 'https://api.ultramsg.com/instance45156/messages/chat',
        headers: { 'content-type': ' application/x-www-form-urlencoded' },
        form: {
            "token": "0cnqlft2roemo3j4",
            "to": 89627295770,
            "body": message
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });*/

    var option = {
        method: 'POST',
        url: 'https://api.ultramsg.com/instance45156/messages/chat',
        headers: { 'content-type': ' application/x-www-form-urlencoded' },
        form: {
            "token": "0cnqlft2roemo3j4",
            "to": 89062565462,
            "body": message
        }
    };
    request(option, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
    });
}





async function ggg(id) {
    const allobj = {};
    const flagss = 4096
    const prmss = {
        'id': id,
        'flags': flagss
    }
    return new Promise(function (resolve, reject) {
        session.request('core/search_item', prmss)
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                //  console.log(data)
                const nameSens = Object.entries(data.item.sens)
                const arrNameSens = [];

                nameSens.forEach(el => {
                    arrNameSens.push([el[1].n, el[1].p])
                    //  arrNameSens.push(el[1].p)
                })
                const prms = {
                    "unitId":
                        id,
                    "sensors": []
                }
                session.request('unit/calc_last_message', prms)
                    .catch(function (err) {
                        console.log(err);
                    })
                    .then(function (data) {
                        if (data) {
                            const valueSens = [];
                            Object.entries(data).forEach(e => {
                                valueSens.push(e[1])
                            })
                            // console.log(valueSens)
                            // console.log(arrNameSens)
                            const allArr = [];
                            arrNameSens.forEach((e, index) => {
                                allArr.push([...e, valueSens[index]])

                            })
                            //  console.log(allArr)
                            allArr.forEach(it => {
                                allobj[it[1]] = it[0]
                            })
                        }
                        // console.log(allobj)
                        resolve(allobj)
                    });
            })
    })
}





//mail()
//const y = c

/*
createDateTest()
function createDateTest() {
    let today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    today = day + '.' + month + '.' + year;
    let time = new Date();
    const hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    time = hour + ':' + minutes

    const todays = today + ' ' + time
    console.log(todays)
    return [todays]
    // console.log(today)
}*/


