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
