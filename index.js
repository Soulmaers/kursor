
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

require('dotenv').config();
const port = process.env.PORT
const initServer = () => {
    return new Promise((resolve) => {
        app.listen(port, () => {
            console.log(`Сервер запущен, порт:${port}`);
            resolve();
        });
    });
}
async function init() {
    await initServer()
    await wialon()
    //   globalstart.test()
    //  globalstart.hunterTime()
    //  setInterval(globalstart.test, 300000)
    //  setInterval(globalstart.hunterTime, 50000)
    console.log('сессия открыта')
}
init()

let session;
async function wialon() {
    const token = process.env.TOKEN// await getTokenFromDB(login)
    console.log(token)
    session = await wialonModule.login(token);
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



