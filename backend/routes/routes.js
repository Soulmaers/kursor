
const express = require('express')
const controllerWialon = require('../controllers/dataWialon')
const controllerModel = require('../controllers/modelController')
const controllerGeo = require('../controllers/geo.controller')
const controllerIcon = require('../controllers/icons.controller')
const controllerAlarm = require('../controllers/alarm.controller')
const controllerTarir = require('../controllers/tarir.controller')
const controllerTech = require('../controllers/tech.controller')
const router = express.Router()


module.exports = router


router.get('/api/dataSpisok', controllerWialon.dataSpisok)
router.post('/api/spisokList', controllerWialon.spisok)

router.post('/api/wialon', controllerWialon.datawialon)
router.post('/api/wialonAll', controllerWialon.datawialonAll)
router.post('/api/parametrs', controllerWialon.parametrs)
router.post('/api/sensors', controllerWialon.parametrs)

router.post('/api/geoloc', controllerGeo.geoloc)
router.post('/api/alarmFind', controllerAlarm.alarmFind)



router.post('/api/savePr', controllerTech.savePr)
router.post('/api/techView', controllerTech.techView)
router.post('/api/techViewAll', controllerTech.techViewAll)






router.post('/api/generate', controllerModel.generate)
router.get('/api/findId', controllerModel.findId)
router.post('/api/rotate', controllerModel.rotate)
router.post('/api/listTyresId', controllerModel.listTyresId)



router.post('/api/icon', controllerIcon.icon)
router.post('/api/iconFind', controllerIcon.iconFind)


router.post('/api/to', controllerModel.to)
router.post('/api/toView', controllerModel.toView)



router.post('/api/tarirSave', controllerTarir.tarirSave)
router.post('/api/tarirView', controllerTarir.tarirView)



router.post('/api/saveStatus', controllerModel.saveStatus)
router.post('/api/viewStatus', controllerModel.viewStatus)

