
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
};

let session;
async function init() {
    await initServer()

    const res = await wialon()
    console.log(res)
    if (res !== 'ошибка') {
        console.log('сессия открыта')
        new WialonOrigin(session);
        setInterval(() => {
            new WialonOrigin(session);
        }, 120000);
        await globalstart.start(session)
        setInterval(globalstart.start, 300000, session)
    }

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

const ListenPortTP = require('./backend/modules/navtelecom/ChatServerTerminal.js')
const ListenPortTPNew = require('./backend/modules/wialonRetranslation/ParseBuffer.js')
const ListenPortIPS = require('./backend/modules/wialonIPS/ParseBuffer.js')
const WialonOrigin = require('./backend/modules/wialon/WialonOrigin.js')
new ListenPortTP(21626)
new ListenPortTPNew(20163)
exports.ips = new ListenPortIPS(20332)
































