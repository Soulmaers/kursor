const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const passport = require('passport')
const routes = require('./backend/settings/routes')
//const isToken = require('./middleware/auth.js')
const app = express();


var morgan = require('morgan');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())
require('./backend/middleware/passport')(passport); // pass passport for configuration

//app.use(isToken)




app.use(bodyParser.json())
app.use(cookieParser());
//app.use(morgan('dev')); // log every request to the console
app.set('view engine', 'ejs'); // set up ejs for templating






app.use(express.static(__dirname + '/public'));
app.use(routes)
module.exports = app





