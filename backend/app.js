const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const path = require('path')

const routes = require('./settings/routes')
const app = express();




app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(passport.initialize())
require('./middleware/passport.js')(passport);

const indexHTML = path.resolve(__dirname, './public/index.html');
app.use('/', express.static('public'));
app.get('/', (req, res) => res.sendFile(indexHTML));




routes(app);


module.exports = app



