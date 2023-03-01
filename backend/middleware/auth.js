
const jwt = require('jsonwebtoken');


module.exports = function isToken(req, res, next) {
    console.log('job')
    jwt.verify(req.cookies['AuthToken'], 'jwt-key', (err, authorizedData) => {
        if (err) {
            console.log('1')

            console.log('ERROR: Could not connect to the protected route');
            return res.render('form.ejs', { message: 'Срок жизни токена истек' })
        } else {
            console.log('2')
            console.log(authorizedData)

            next();
        }

    })
}