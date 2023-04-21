
const express = require('express')
const controller = require('../controllers/auth')
const controllerWialon = require('../controllers/dataWialon')
const controllerModel = require('../controllers/modelController')
const isToken = require('../middleware/auth.js')
const passport = require('passport')
const router = express.Router()
const jwt = require('jsonwebtoken');



module.exports = router


router.get('/', controller.page)
router.post('/', controller.sing)
router.get('/logout', controller.logout)
//router.get('/spisok', isLoggedIn, controller.spisok)

router.get('/action', isToken, passport.authenticate('jwt', { session: false }), controller.action)

router.post('/signup', controller.signup)
router.post('/delete/:id', controller.delete)
router.post('/update/:id', controller.update)
router.get('/users', controller.users)



router.post('/api/wialon', controllerWialon.datawialon)
router.post('/api/wialonAll', controllerWialon.datawialonAll)

router.post('/api/datawialonGeo', controllerWialon.datawialonGeo)

//router.post('/api/tech', controllerModel.tech)
router.post('/api/modalBar', controllerModel.modalBar)


//router.post('/api/model', controllerModel.model)
router.post('/api/tyres', controllerModel.tyres)
router.post('/api/techView', controllerModel.techView)
router.post('/api/techViewAll', controllerModel.techViewAll)
router.post('/api/barView', controllerModel.barView)
router.post('/api/barViewAll', controllerModel.barViewAll)


router.post('/api/modelView', controllerModel.modelView)
router.post('/api/tyresView', controllerModel.tyresView)

router.post('/api/delete', controllerModel.deleteView)
router.post('/api/paramsDelete', controllerModel.paramsDeleteView)
router.post('/api/barDelete', controllerModel.barDelete)



router.post('/api/listModel', controllerModel.listModel)
router.post('/api/listTyres', controllerModel.listTyres)

router.post('/api/savePr', controllerModel.savePr)
router.post('/api/alarmFind', controllerModel.alarmFind)
router.post('/api/speedData', controllerModel.speedData)
router.post('/api/generate', controllerModel.generate)
router.get('/api/findId', controllerModel.findId)
router.post('/api/rotate', controllerModel.rotate)
router.post('/api/listTyresId', controllerModel.listTyresId)
router.post('/api/updateModel', controllerModel.updateModel)
router.post('/api/icon', controllerModel.icon)
router.post('/api/iconWindows', controllerModel.iconWindows)
router.post('/api/iconFind', controllerModel.iconFind)
router.post('/api/iconFindWindows', controllerModel.iconFindWindows)
router.post('/api/deleteSatic', controllerModel.deleteStatic)
router.post('/api/to', controllerModel.to)
router.post('/api/toView', controllerModel.toView)
router.post('/api/checkObject', controllerModel.checkObject)
router.post('/api/viewCheckObject', controllerModel.viewCheckObject)

