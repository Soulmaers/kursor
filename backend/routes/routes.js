
const express = require('express')
const controllerWialon = require('../controllers/dataWialon')
const controllerModel = require('../controllers/modelController')
const controllerIcon = require('../controllers/icons.controller')
const controllerAlarm = require('../controllers/alarm.controller')
const controllerTarir = require('../controllers/tarir.controller')
const controllerTech = require('../controllers/tech.controller')
const controllerData = require('../controllers/data.controller')

const router = express.Router()


module.exports = router

router.post('/api/dataSpisok', controllerData.dataSpisok)
router.post('/api/spisokList', controllerWialon.spisok)
router.post('/api/viewLogs', controllerData.viewLogs)
router.post('/api/quantityLogs', controllerWialon.quantityLogs)

router.get('/api/wialonObjects', controllerWialon.wialonObjects)
router.post('/api/wialonObjectsId', controllerWialon.wialonObjectsId)

router.get('/api/shablons', controllerWialon.shablons)
router.post('/api/titleShablon', controllerWialon.titleShablon)
router.post('/api/file', controllerWialon.file)
router.post('/api/fileDown', controllerWialon.fileDown)

router.post('/api/getEventMarkers', controllerWialon.getEventMarkers)

router.post('/api/alarmFind', controllerAlarm.alarmFind)
router.post('/api/logs', controllerAlarm.logs)
router.post('/api/logsView', controllerAlarm.logsView)
router.post('/api/logsViewId', controllerAlarm.logsViewId)
router.post('/api/saveEvent', controllerAlarm.saveEvent)
router.post('/api/viewEvent', controllerAlarm.viewEvent)
router.post('/api/alarmViewId', controllerAlarm.alarmViewId)



router.post('/api/savePr', controllerTech.savePr)
router.post('/api/techView', controllerTech.techView)
router.post('/api/techViewAll', controllerTech.techViewAll)
router.post('/api/summary', controllerTech.summary)
router.post('/api/summaryYestoday', controllerTech.summaryYestoday)
router.post('/api/summaryIdwToBase', controllerTech.summaryIdwToBase)



router.post('/api/generate', controllerModel.generate)
router.get('/api/findId', controllerModel.findId)
router.post('/api/rotate', controllerModel.rotate)
router.post('/api/listTyresId', controllerModel.listTyresId)



router.post('/api/icon', controllerIcon.icon)
router.post('/api/iconFind', controllerIcon.iconFind)
router.post('/api/saveList', controllerIcon.saveList)
router.post('/api/viewList', controllerIcon.viewList)


router.post('/api/to', controllerModel.to)
router.post('/api/toView', controllerModel.toView)



router.post('/api/tarirSave', controllerTarir.tarirSave)
router.post('/api/tarirView', controllerTarir.tarirView)




router.post('/api/viewStatus', controllerModel.viewStatus)


