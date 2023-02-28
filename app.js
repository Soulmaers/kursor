const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const passport = require('passport')
const path = require('path')
const jwts = require('./backend//middleware/passport')
//var session = request('express-session')

const routes = require('./backend/settings/routes')
const app = express();


var morgan = require('morgan');
//var flash = require('connect-flash');

//app.use(passport.session()); // persistent login sessions
//app.use(flash()); // use connect-flash for flash messages stored in session
app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())
require('./backend/middleware/passport')(passport); // pass passport for configuration


app.use(bodyParser.json())
app.use(cookieParser());
app.use(morgan('dev')); // log every request to the console





app.set('view engine', 'ejs'); // set up ejs for templating






app.use(express.static(__dirname + '/public'));


app.use(routes)

module.exports = app





