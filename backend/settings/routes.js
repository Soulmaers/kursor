

module.exports = (app) => {
    const passport = require('passport')
    const usersController = require('../Controller/usersController')
    const dataWialon = require('../Controller/dataWialon')
    //  const dataWialon = require('../Controller/datawialonGeo')
    const modelController = require('../Controller/modelController')
    // const modelController = require('../Controller/modelController')


    app
        .route('/api/users')
        .get(passport.authenticate('jwt', { session: false }), usersController.getAllUsers)

    app
        .route('/api/auth/signup')
        .post(usersController.signup)
    app
        .route('/api/auth/signin')
        .post(usersController.signin)

    app
        .route('/api/wialon')
        .post(dataWialon.datawialon)

    app
        .route('/api/datawialonGeo')
        .post(dataWialon.datawialonGeo)
    app
        .route('/api/tech')
        .post(modelController.tech)

    app
        .route('/api/model')
        .post(modelController.model)

    app
        .route('/api/tyres')
        .post(modelController.tyres)

    app
        .route('/api/techView')
        .post(modelController.techView)

    app
        .route('/api/modelView')
        .post(modelController.modelView)

    app
        .route('/api/tyresView')
        .post(modelController.tyresView)

    app
        .route('/api/delete')
        .post(modelController.deleteView)

    app
        .route('/api/paramsDelete')
        .post(modelController.paramsDeleteView)

}




