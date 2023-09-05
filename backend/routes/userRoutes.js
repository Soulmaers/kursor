const express = require('express')
const controller = require('../controllers/auth')
const controllerData = require('../controllers/data.controller')
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


router.post('/getData', controllerData.getData)
router.post('/signup', controller.signup)
router.post('/delete/:id', controller.delete)
router.post('/update/:id', controller.update)
router.get('/users', controller.users)
router.post('/api/saveProfil', controller.saveProfil)
router.post('/api/findProfil', controller.findProfil)
router.post('/api/deleteProfil/:id', controller.deleteProfil)

router.post('/api/checkObject', controller.checkObject)
router.post('/api/viewCheckObject', controller.viewCheckObject)

