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
router.post('/api/addObject', controller.addObject)
router.post('/api/addGroup', controller.addGroup)
router.post('/api/addRetra', controller.addRetra)

router.post('/api/getAccounts', controller.getAccounts)
router.post('/api/getAccountCreater', controller.getAccountCreater)
router.post('/api/getAccountUsers', controller.getAccountUsers)
router.post('/api/getUsersContent', controller.getUsersContent)
router.post('/api/getObjectCreater', controller.getObjectCreater)
router.post('/api/getGroupCreater', controller.getGroupCreater)
router.post('/api/getRetraCreater', controller.getRetraCreater)


router.post('/api/editAccount', controller.editAccount)
router.post('/api/editUser', controller.editUser)
router.post('/api/editObject', controller.editObject)
router.post('/api/editGroup', controller.editGroup)
router.post('/api/editRetra', controller.editRetra)

router.post('/api/updateObjectUser', controller.updateObjectUser)
router.post('/api/updateGroupUser', controller.updateGroupUser)
router.post('/api/updateObjectsAndUsers', controller.updateObjectsAndUsers)
router.post('/api/updateGroupsAndUsers', controller.updateGroupsAndUsers)
router.post('/api/deleteUsersObjectGroupRetra', controller.deleteUsersObjectGroupRetra)


router.post('/api/setHistorys', controller.setHistorys)

router.get('/api/geAccContent', controller.geAccContent)

router.post('/api/deleteAccount', controller.deleteAccount)

router.get('/3339', controller.tests)

router.post('/api/getHistoryStor', controller.getHistoryStor)


router.post('/api/getObjectsGroups', controller.getObjectsGroups)
