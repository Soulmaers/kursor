const express = require('express')

const controllerConfigurator = require('../controllers/configurator.controller')
const router = express.Router()


module.exports = router

router.post('/api/updateModel', controllerConfigurator.updateModel)
router.post('/api/tyres', controllerConfigurator.tyres)
router.post('/api/delete', controllerConfigurator.deleteModel)
router.post('/api/paramsDelete', controllerConfigurator.deleteTyres)
router.post('/api/modalBar', controllerConfigurator.modalBar)
router.post('/api/barDelete', controllerConfigurator.deleteBar)
router.post('/api/modelView', controllerConfigurator.modelView)
router.post('/api/tyresView', controllerConfigurator.tyresView)
router.post('/api/barView', controllerConfigurator.barView)


//поиск id и сохранение объекта в базу
router.get('/api/lastIdObject', controllerConfigurator.lastIdObject)
router.get('/api/lastIdGroup', controllerConfigurator.lastIdGroup)
router.post('/api/saveObject', controllerConfigurator.saveObject)
router.post('/api/setGroup', controllerConfigurator.setGroup)
router.post('/api/uniqImeiAndPhone', controllerConfigurator.uniqImeiAndPhone)
router.post('/api/validationCloneGroupName', controllerConfigurator.validationCloneGroupName)
router.post('/api/getObjects', controllerConfigurator.getObjects)
router.post('/api/getGroups', controllerConfigurator.getGroups)
router.post('/api/getIdGroup', controllerConfigurator.getIdGroup)
router.post('/api/setSubGroups', controllerConfigurator.setSubGroups)
router.post('/api/deleteObject', controllerConfigurator.deleteObject)
router.post('/api/deleteObjectInGroups', controllerConfigurator.deleteObjectInGroups)
router.post('/api/deleteGroupToBaseGroups', controllerConfigurator.deleteGroupToBaseGroups)
router.post('/api/updateGroup', controllerConfigurator.updateGroup)
router.post('/api/updateObject', controllerConfigurator.updateObject)

