const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const routes = require('./backend/routes/routes');
const userRoutes = require('./backend/routes/userRoutes.js');
const configRoutes = require('./backend/routes/configRoutes');
const kursorRoutes = require('./backend/routes/kursorRoutes');

const axios = require('axios')
const https = require('https');
const cors = require('cors');
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
const { y } = require('pdfkit');

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
async function geocoding() {
    const coordinates = [
        [47.25359, 38.9354616667], // Нью-Йорк
        [34.0522, -118.2437], // Лос-Анджелес
        [51.5074, -0.1278] // Лондон
    ];
    const apiKey = '9614b4770a4f42de900e70207075c2b8'
    const requests = coordinates.map(coord => {
        const [lat, lon] = coord;
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lon}&key=${apiKey}&language=ru`;
        return axios.get(url);
    });

    try {
        const responses = await Promise.all(requests);

        const addresses = responses.map(response => {
            const city = response.data.results[0].components.city || '';
            const road = response.data.results[0].components.road || '';
            const house_number = response.data.results[0].components.house_number || '';

            return `${city}, ${road}, ${house_number}`.trim();
        }
        );
        console.log(addresses);
    } catch (error) {
        console.error('Ошибка при запросе:', error);
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
            await initServer();
            new ControllRetranslations()
            //  await geocoding()
        } catch (error) {
            clearInterval(interval);
            console.error("Ошибка инициализации:", new Date(), error);
        }
    }

    init();


} else {
    console.log('Этот код не должен выполняться внутри воркера.');
}









