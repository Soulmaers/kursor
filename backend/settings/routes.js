
const express = require('express')
const controller = require('../controllers/auth')
const controllerWialon = require('../controllers/dataWialon')
const controllerModel = require('../controllers/modelController')
const isLoggedIn = require('../middleware/auth.js')
const passport = require('passport')
const router = express.Router()

module.exports = router

router.get('/', controller.page)
router.post('/', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}))


router.get('/profile', isLoggedIn, controller.profile)
router.get('/logout', controller.logout)
router.get('/spisok', isLoggedIn, controller.spisok)


router.post('/api/wialon', controllerWialon.datawialon)
router.post('/api/wialonAll', controllerWialon.datawialonAll)

router.post('/api/datawialonGeo', controllerWialon.datawialonGeo)

router.post('/api/tech', controllerModel.tech)
router.post('/api/model', controllerModel.model)
router.post('/api/tyres', controllerModel.tyres)
router.post('/api/techView', controllerModel.techView)

router.post('/api/modelView', controllerModel.modelView)
router.post('/api/tyresView', controllerModel.tyresView)

router.post('/api/delete', controllerModel.deleteView)
router.post('/api/paramsDelete', controllerModel.paramsDeleteView)

router.post('/api/listModel', controllerModel.listModel)
router.post('/api/listTyres', controllerModel.listTyres)


