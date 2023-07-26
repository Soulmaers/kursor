
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

require('events').EventEmitter.prototype._maxListeners = 0;



app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())
require('./backend/middleware/passport')(passport); // pass passport for configuration

//app.use(isToken)




app.use(bodyParser.json())
app.use(cookieParser());
//const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

//app.use(morgan('combined', { stream: accessLogStream }));
//app.use(morgan('dev')); // log every request to the console
app.set('view engine', 'ejs'); // set up ejs for templating



app.use(express.static(__dirname + '/public'));
app.use(routes)
app.use(userRoutes)
app.use(configRoutes)
module.exports = app



require('dotenv').config();
const port = process.env.PORT




app.listen(port, () => console.log(`Сервер запущен, порт:${port}`))