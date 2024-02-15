
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const passport = require('passport')
const routes = require('./backend/routes/routes')
const userRoutes = require('./backend/routes/userRoutes.js')
const configRoutes = require('./backend/routes/configRoutes')
const kursorRoutes = require('./backend/routes/kursorRoutes')
//const isToken = require('./middleware/auth.js')
const https = require('https');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const app = express();
const wialonModule = require('./backend/modules/wialon.module');
const databaseService = require('./backend/services/database.service');
const globalstart = require('./backend/controllers/data.controller.js');
const WebSocket = require('ws');
const webpush = require('web-push');
require('events').EventEmitter.prototype._maxListeners = 0;

//const socked = require('./backend/services/database.services.js')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())
require('./backend/middleware/passport')(passport); // pass passport for configuration
app.use(bodyParser.json())
app.use(cookieParser());
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static(__dirname + '/public'));
app.use(routes)
app.use(userRoutes)
app.use(configRoutes)
app.use(kursorRoutes)

require('dotenv').config();
const port = process.env.PORT

const options = {
    key: fs.readFileSync('./cursor-gps.ru/privkey1.pem'),
    cert: fs.readFileSync('./cursor-gps.ru/cert1.pem'),
};
//  https.createServer(options, app)
const initServer = async () => {
    app.listen(port, () => {
        console.log(`Сервер запущен, порт:${port}`);
    });


    /* process.on('uncaughtException', (err) => {
         if (err.code === 'ETIMEDOUT') {
             console.log(new Date(), 'Ошибка подключения к серверу: истекло время ожидания');
             // Перезапуск сервера
             setTimeout(async () => {
                 //  await globalstart.start(session)
                 // process.exit(1) // Перезапуск сервера через 1 секунду
                 // initServer()
             }, 3000);
         } else {
             console.log(new Date(), 'Необработанная ошибка:', err.message);
             setTimeout(async () => {
                 await globalstart.start(session)
                 // process.exit(1) // Перезапуск сервера через 1 секунду
                 // initServer()
             }, 3000);
         }
     });*/
};

let session;
async function init() {
    await initServer()
<<<<<<< HEAD
    //  const res = await wialon()
    //  console.log(res)
    // if (res !== 'ошибка') {
    //   console.log('сессия открыта')
    //  await globalstart.start(session)
    // setInterval(globalstart.start, 300000, session)
    //  }
=======
    const res = await wialon()
    console.log(res)
    if (res !== 'ошибка') {
        console.log('сессия открыта')
<<<<<<< HEAD
        await globalstart.start(session)
        setInterval(globalstart.start, 300000, session)

=======
        //  await globalstart.start(session)
        // setInterval(globalstart.start, 300000, session)
>>>>>>> e9f22440f82388095a6a4be73f5a1302fd11e4fd
    }
>>>>>>> cb7a480ad05ca0d5e86bc617d5e5bd10b6582a47

}
init()
//0f481b03d94e32db858c7bf2d8415204BC9192516432699D521630B59B32E63DE759A503
//0f481b03d94e32db858c7bf2d8415204977173E354D49AA7AFA37B01431539AEAC5DAD5E
//0f481b03d94e32db858c7bf2d8415204289C57FB5B35C22FC84E9F4ED84D5063558E1178
//0f481b03d94e32db858c7bf2d8415204616F1C781302A0F13D8C8C61B8B8CCBCEB8D19EB

//0f481b03d94e32db858c7bf2d841520483AA3DFA6B70F0D652D0D81E1837E52CB73B4320

//0f481b03d94e32db858c7bf2d8415204053B81B65B49F2370AA9ABEC5A05DCE9EA16B835
//0f481b03d94e32db858c7bf2d8415204DEEDFF25A757DC4510358300A187F0A9537446D0
async function wialon() {
    const token = process.env.TOKEN// await getTokenFromDB(login)
    console.log(token)
    session = await wialonModule.login(token);
    const params = {
        'tzOffset': 10800,
        "language": 'ru',
    }
    if (session !== 'ошибка') {
        session.request('render/set_locale', params)
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                console.log(data)
            });
        return 'ok'
    }
    else {
        return 'ошибка'
    }


}
exports.geSession = async () => {
    return new Promise(async (resolve, reject) => {
        if (session) { // Если сессия уже инициализирована
            resolve(session);
        } else {
            // Добавьте interval для попытки повторения, пока сессия не будет инициализирована
            const interval = setInterval(() => {
                if (session) {
                    clearInterval(interval); // Остановите interval, когда сессия будет готова
                    resolve(session);
                }
            }, 500);
        }
    });
}

exports.net = require('net');

<<<<<<< HEAD
const ListenPortTP = require('./backend/modules/navtelecom/ChatServerTerminal.js')
const ListenPortTPNew = require('./backend/modules/wialonRetranslation/ParseBuffer.js')
new ListenPortTP(21626)
=======
class ListenPortTP {
    constructor(port) {
        this.port = port
        this.createServer(this.port)
    }

    createServer(port) {
        const tcpServer = net.createServer((socket) => {
            console.log('TCP Client connected');
            //  console.log(socket)
            new ChartServerTerminal(socket)
            new SendingCommandToTerminal(socket)
        });
        tcpServer.listen(port, () => {
            console.log(`TCP протокол слушаем порт ${port}`);
        });
    }
}

class ListenPortTPNew {
    constructor(port) {
        this.port = port
        this.createServer(this.port)
    }

    createServer(port) {
        console.log(port)
        const tcpServer = net.createServer((socket) => {
            console.log('TCP Client connected new');
            //  console.log(socket)

            socket.on('data', async (data) => {
                //  console.log(data)
                let buf = data
                const size = buf.readInt32LE()
                buf = buf.slice(4)
                const imei = buf.slice(0, 15).toString()
                buf = buf.slice(16)
                const time = buf.readUInt32BE()
                buf = buf.slice(4)
                const mask = buf.readUInt32BE()
                buf = buf.slice(4)
                const res = parse()
                const res1 = parse()
                res1.nameBlock = buf.slice(0, 8).toString()
                buf = buf.slice(9)
                res1.value = buf.slice(0, 1).toString()
                buf = buf.slice(2)
                const res2 = parse()
                res2.nameBlock = buf.slice(0, 5).toString()
                buf = buf.slice(6)
                res2.value = buf.slice(0, 7).toString()
                buf = buf.slice(8)
                const res3 = parse()
                res3.nameBlock = buf.slice(0, 10).toString()
                buf = buf.slice(11)
                res3.value = Number(buf.readBigInt64BE())
                buf = buf.slice(8)
                const res4 = parse()
                const res5 = parse()
                const res6 = parse()
                const res7 = parse()
                const res8 = parse()
                const res9 = parse()
                // const res10 = parse()
                res9.nameBlock = buf.slice(0, 15).toString()
                buf = buf.slice(16)
                res9.value = Number(buf.readBigInt64BE())
                buf = buf.slice(8)
                const res10 = parse()
                const res11 = parse()
                const res12 = parse()
                const res13 = parse()
                console.log(buf)
                console.log(res3, res8, res9, res10, res11, res12)

                function parse() {
                    const blockLine = buf.readUInt16BE()
                    buf = buf.slice(2)
                    const sizeBlock = buf.readUInt32BE()
                    buf = buf.slice(4)
                    const atributeHidden = buf.readUInt8()
                    buf = buf.slice(1)
                    const typeBlock = buf.readUInt8()
                    buf = buf.slice(1)
                    let nameBlock;
                    let value;
                    switch (typeBlock) {
                        case 3:
                            nameBlock = buf.slice(0, (sizeBlock - 7)).toString()
                            buf = buf.slice((sizeBlock - 6))
                            value = buf.readUInt32BE()
                            buf = buf.slice(4)

                    }
                    return ({ blockLine: blockLine, sizeBlock: sizeBlock, atributeHidden: atributeHidden, typeBlock: typeBlock, nameBlock: nameBlock, value: value })
                }
            })
        })

        tcpServer.listen(port, () => {
            console.log(`TCP протокол слушаем порт ${port}`);
        });
    }


}


const ChartServerTerminal = require('./backend/modules/navtelecom/ChatServerTerminal.js')
const SendingCommandToTerminal = require('./backend/modules/navtelecom/SendingCommandToTerminal.js')
<<<<<<< HEAD
new ListenPortTP(21626)

=======
//new ListenPortTP(21626)
>>>>>>> cb7a480ad05ca0d5e86bc617d5e5bd10b6582a47
new ListenPortTPNew(20163)
>>>>>>> e9f22440f82388095a6a4be73f5a1302fd11e4fd


























