
const jwt = require('jsonwebtoken');

module.exports = function isToken(req, res, next) { //проверка Токена
    jwt.verify(req.cookies['AuthToken'], 'jwt-key', (err, authorizedData) => {
        if (err) {
            //  console.log('ERROR: Could not connect to the protected route');
            return res.render('form.ejs', { message: 'Срок жизни токена истек' })
        } else {
            next();
        }

    })
}


