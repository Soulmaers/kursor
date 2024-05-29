const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const routes = require('./backend/routes/routes');
const userRoutes = require('./backend/routes/userRoutes.js');
const configRoutes = require('./backend/routes/configRoutes');
const kursorRoutes = require('./backend/routes/kursorRoutes');
const https = require('https');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const { Worker, isMainThread } = require('worker_threads');
const app = express();
const wialonModule = require('./backend/modules/wialon.module');
const WebSocket = require('ws');
require('events').EventEmitter.prototype._maxListeners = 0;
require('dotenv').config();

const { getSession, setSession } = require('./backend/config/db');

const port = process.env.PORT || 3333;

let interval;

const initServer = async () => {
    try {
        app.listen(port, () => {
            console.log(`Сервер запущен, порт:${port}`);
        });
    } catch (error) {
        console.error(`Ошибка при запуске сервера: ${error.message}`);
    }
};

async function wialon() {
    const token = process.env.TOKEN;
    console.log(token);
    const session = await wialonModule.login(token);
    const params = {
        'tzOffset': 10800,
        "language": 'ru',
    };
    if (session !== 'ошибка') {
        setSession(session); // Устанавливаем сессию
        await session.request('render/set_locale', params);
        return 'ok';
    } else {
        return 'ошибка';
    }
}

if (isMainThread) {
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(passport.initialize());
    require('./backend/middleware/passport')(passport);
    app.use(cookieParser());
    app.set('view engine', 'ejs');
    app.use(express.static(__dirname + '/public'));
    app.use(routes);
    app.use(userRoutes);
    app.use(configRoutes);
    app.use(kursorRoutes);

    const options = {
        key: fs.readFileSync('./cursor-gps.ru/privkey1.pem'),
        cert: fs.readFileSync('./cursor-gps.ru/cert1.pem'),
    };

    async function init() {
        await initServer();
        try {
            const res = await wialon();
            const session = await getSession()
            new WialonOrigin(session);
            interval = setInterval(() => {
                new WialonOrigin(session);
            }, 120000);
        } catch (error) {
            clearInterval(interval);
            console.error("Ошибка инициализации:", new Date(), error);
        }
    }

    init();

    const ListenPortTP = require('./backend/modules/navtelecom/ChatServerTerminal.js');
    const ListenPortTPNew = require('./backend/modules/wialonRetranslation/ParseBuffer.js');
    const ListenPortIPS = require('./backend/modules/wialonIPS/ParseBuffer.js');
    const WialonOrigin = require('./backend/modules/wialon/WialonOrigin.js');

    new ListenPortTP(21626);
    new ListenPortTPNew(20163);
    exports.ips = new ListenPortIPS(20332);
} else {
    console.log('Этот код не должен выполняться внутри воркера.');
}