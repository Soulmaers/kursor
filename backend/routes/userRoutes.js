const express = require('express')
const controller = require('../controllers/auth.js')
const controllerData = require('../controllers/data.controller.js')
const isToken = require('../middleware/auth.js')
const passport = require('passport')
const router = express.Router()
const jwt = require('jsonwebtoken');
const controllerFile = require('../controllers/file.controller')


module.exports = router


router.get('/', controller.page)
router.post('/', controller.sing)
router.get('/logout', controller.logout)
//router.get('/spisok', isLoggedIn, controller.spisok)

router.get('/action', isToken, passport.authenticate('jwt', { session: false }), controller.action)
router.get('/.well-known/acme-challenge/4v9ZCBiUNfu21nZvYwwbeETy47W-KHIuK_rJO-kOvLQ', controllerFile.getText)

//router.post('/getData', controllerData.getData)
router.post('/signup', controller.signup)
router.post('/delete/:id', controller.delete)
router.post('/update/:id', controller.update)
router.get('/users', controller.users)
router.post('/api/saveProfil', controller.saveProfil)
router.post('/api/findProfil', controller.findProfil)
router.post('/api/deleteProfil/:id', controller.deleteProfil)

router.post('/api/checkObject', controller.checkObject)
router.post('/api/viewCheckObject', controller.viewCheckObject)

