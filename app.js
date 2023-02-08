const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const passport = require('passport')
const path = require('path')

const routes = require('./backend/settings/routes')
const app = express();

var session = require('express-session');
var morgan = require('morgan');
var flash = require('connect-flash');

require('./backend/middleware/passport')(passport); // pass passport for configuration

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(passport.initialize())

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
  secret: 'vidyapathaisalwaysrunning',
  resave: true,
  saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


app.use(express.static(__dirname + '/public'));
//const inHTML = path.resolve(__dirname, 'public/in.html');
//app.get('/cont', (req, res) => res.sendFile(inHTML))


routes(app);
module.exports = app





