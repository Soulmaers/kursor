const express = require('express')
const controller = require('../controllers/auth.js')
const isToken = require('../middleware/auth.js')
const passport = require('passport')
const router = express.Router()
const jwt = require('jsonwebtoken');

module.exports = router

router.get('/', controller.page)
router.post('/', controller.sing)
router.get('/logout', controller.logout)
router.get('/action', isToken, passport.authenticate('jwt', { session: false }), controller.action)
router.post('/signup', controller.signup)
router.post('/delete/:id', controller.delete)
router.post('/update/:id', controller.update)
router.get('/users', controller.users)
router.post('/api/saveProfil', controller.saveProfil)
router.post('/api/findProfil', controller.findProfil)
router.post('/api/deleteProfil/:id', controller.deleteProfil)
router.post('/api/checkObject', controller.checkObject)
router.post('/api/viewCheckObject', controller.viewCheckObject)
router.post('/api/findLastIdUser', controller.findLastIdUser)

router.post('/api/getUsers', controller.getUsers)
router.post('/api/addAccount', controller.addAccount)
router.post('/api/getAccounts', controller.getAccounts)
router.post('/api/getAccountUsers', controller.getAccountUsers)
router.post('/api/deleteAccount', controller.deleteAccount)

router.get('/3339', controller.tests)
