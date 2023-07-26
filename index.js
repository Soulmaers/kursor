
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const passport = require('passport')
const routes = require('./backend/routes/routes')
const userRoutes = require('./backend/routes/userRoutes')
const configRoutes = require('./backend/routes/configRoutes')
//const isToken = require('./middleware/auth.js')
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const app = express();

const WebSocket = require('ws');
require('events').EventEmitter.prototype._maxListeners = 0;



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
module.exports = app
require('dotenv').config();
const port = process.env.PORT
const server = app.listen(port, () => console.log(`Сервер запущен, порт:${port}`))


// Создаем WebSocket-сервер
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    // Обработка подключения WebSocket-клиента
    console.log('WebSocket client connected');
    setTimeout(function () {
        const value = ['26.07.2023 03:37', 'Sitrack н891ах198', '3 Ось Левое Внеш', '5', '24', 'Критически низкое давление',]
        sendToClient(value);
    }, 5000);
    function sendToClient(value) {
        console.log('функция')
        let val;
        value[5] !== 'Потеря связи с датчиком' ? val = value[3] + ' ' + 'Бар' : val = value[4]
        const event = 'Уведомление'
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                const message = JSON.stringify([{
                    event: event, time: `Время: ${value[0]}`, name: `Объект: ${value[1]}`, tyres: `Колесо: ${value[2]}`, alarm: `Событие: ${value[5]}`, param: `Параметр: ${val}`
                }])

                client.send(message); // Отправляем сообщение клиенту
            }
        });
    }
    // Обработка сообщений от WebSocket-клиента
    ws.on('message', (message) => {
        console.log('Received message:', message);
    });
    // Обработка закрытия соединения WebSocket-клиента
    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});