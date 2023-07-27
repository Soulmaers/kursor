
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
const databaseService = require('./backend/services/database.service');
const WebSocket = require('ws');
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

require('dotenv').config();
const port = process.env.PORT
const server = app.listen(port, () => console.log(`Сервер запущен, порт:${port}`))



/*

// Создаем WebSocket-сервер
const wss = new WebSocket.Server({ server });
const findVar = () => {
    wss.on('connection', (ws) => {
        let dannie;
        if (databaseService.myVariable && databaseService.myVariable !== dannie) {
            console.log('да')
            dannie = databaseService.myVariable
            let val;
            dannie[1][2] !== 'Потеря связи с датчиком' ? val = dannie[1][2] + ' ' + 'Бар' : val = dannie[1][3] + '' + 't'
            const event = 'Уведомление'

            const value = [{
                event: event, time: `Время ${dannie[0]}`, name: `Объект: ${dannie[1][0]}`, tyres: `Колесо: ${dannie[1][1]}`,
                param: `Параметр: ${val}`, alarm: `Событие: ${dannie[2]}`
            }]
            console.log(value)
            console.log('конст?')
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    console.log(client.readyState)
                    client.send(JSON.stringify(value)); // Отправляем сообщение клиенту
                }
            });
        }
        ws.on('message', (message) => {
            console.log('Received message:', message);
        });
        // Обработка закрытия соединения WebSocket-клиента
        ws.on('close', () => {
            console.log('WebSocket client disconnected');
        });
    })
}

findVar()
setInterval(findVar, 5000)

*/
