

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
        .get(dataWialon.datawialon)
    app
        .route('/api/wialon2')
        .get(dataWialon.datawialon2)
    app
        .route('/api/wialon3')
        .get(dataWialon.datawialon3)
    app
        .route('/api/datawialonGeo')
        .get(dataWialon.datawialonGeo)
    app
        .route('/api/datawialonGeo2')
        .get(dataWialon.datawialonGeo2)
    app
        .route('/api/datawialonGeo3')
        .get(dataWialon.datawialonGeo3)

    app
        .route('/api/model')
        .post(modelController.model)
    app
        .route('/api/model2')
        .post(modelController.model2)
    app
        .route('/api/model3')
        .post(modelController.model3)
    app
        .route('/api/tyres')
        .post(modelController.tyres)
    app
        .route('/api/tyres2')
        .post(modelController.tyres2)
    app
        .route('/api/tyres3')
        .post(modelController.tyres3)
    app
        .route('/api/model')
        .get(modelController.modelView)
    app
        .route('/api/model2')
        .get(modelController.modelView2)
    app
        .route('/api/model3')
        .get(modelController.modelView3)
    app
        .route('/api/tyres')
        .get(modelController.tyresView)
    app
        .route('/api/tyres2')
        .get(modelController.tyresView2)
    app
        .route('/api/tyres3')
        .get(modelController.tyresView3)
    app
        .route('/api/delete')
        .delete(modelController.deleteView)
    app
        .route('/api/delete2')
        .delete(modelController.deleteView2)
    app
        .route('/api/delete3')
        .delete(modelController.deleteView3)
    app
        .route('/api/paramsDelete')
        .delete(modelController.paramsDeleteView)
    app
        .route('/api/paramsDelete2')
        .delete(modelController.paramsDeleteView2)
    app
        .route('/api/paramsDelete3')
        .delete(modelController.paramsDeleteView3)
}




