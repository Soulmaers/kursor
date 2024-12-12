const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const routes = require('./backend/routes/routes');
const userRoutes = require('./backend/routes/userRoutes.js');
const configRoutes = require('./backend/routes/configRoutes');
const kursorRoutes = require('./backend/routes/kursorRoutes');
const https = require('https');
const http = require('http');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const pako = require('pako');
const { Worker, isMainThread } = require('worker_threads');
const app = express();
11
const WebSocket = require('ws');
require('events').EventEmitter.prototype._maxListeners = 0;
require('dotenv').config();
1
const ControllRetranslations = require('./backend/services/ControllRetranslations.js');

const port = process.env.PORT || 3333;


const options = {
    key: fs.readFileSync('./cursor-gps.ru/certificate.key'),
    cert: fs.readFileSync('./cursor-gps.ru/certificate.crt'),
};


// Запуск HTTPS-сервера
const initServer = async () => {
    try {
        https.createServer(options, app).listen(port, () => {
            console.log(`HTTPS сервер запущен на порту ${port}`);
        })
    } catch (error) {
        console.error(`Ошибка при запуске сервера: ${error.message}`);
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

    async function init() {
        try {
            //  deflate()
            await initServer();
            new ControllRetranslations()
        } catch (error) {
            clearInterval(interval);
            console.error("Ошибка инициализации:", new Date(), error);
        }
    }

    init();

} else {
    console.log('Этот код не должен выполняться внутри воркера.');
}






