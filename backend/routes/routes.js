
const express = require('express')
const controllerWialon = require('../controllers/dataWialon')
const controllerModel = require('../controllers/modelController')
const controllerGeo = require('../controllers/geo.controller')
const controllerIcon = require('../controllers/icons.controller')
const controllerAlarm = require('../controllers/alarm.controller')
const controllerTarir = require('../controllers/tarir.controller')
const controllerTech = require('../controllers/tech.controller')
const controllerData = require('../controllers/data.controller')

const router = express.Router()


module.exports = router





router.post('/api/dataSpisok', controllerData.dataSpisok)
router.post('/api/spisokList', controllerWialon.spisok)
router.post('/api/up', controllerData.up)
router.post('/api/viewLogs', controllerData.viewLogs)
router.post('/api/quantityLogs', controllerWialon.quantityLogs)


router.post('/api/getSensorsWialonToBase', controllerWialon.getSensorsWialonToBase)
router.post('/api/getSensorsWialonToBaseId', controllerWialon.getSensorsWialonToBaseId)
router.get('/api/wialonObjects', controllerWialon.wialonObjects)
router.post('/api/wialonObjectsId', controllerWialon.wialonObjectsId)


router.post('/api/wialonNew', controllerWialon.datawialonNew)
router.post('/api/wialon', controllerWialon.datawialon)
router.post('/api/wialonAll', controllerWialon.datawialonAll)
router.post('/api/parametrs', controllerWialon.parametrs)
router.post('/api/sensors', controllerWialon.sensors)
router.post('/api/sensorsName', controllerWialon.sensorsName)
router.post('/api/loadInterval', controllerWialon.loadInterval)
router.post('/api/lastSensors', controllerWialon.lastSensors)
router.post('/api/viewChart', controllerWialon.viewChart)
router.post('/api/viewSortChart', controllerWialon.viewSortChart)
router.post('/api/viewStructura', controllerWialon.viewStructura)
router.post('/api/updateSensors', controllerWialon.updateSensors)
//router.post('/api/viewChartGeo', controllerWialon.viewChartGeo)
router.get('/api/shablons', controllerWialon.shablons)
router.post('/api/titleShablon', controllerWialon.titleShablon)
router.post('/api/file', controllerWialon.file)
router.post('/api/chartData', controllerWialon.chartData)
router.post('/api/fileDown', controllerWialon.fileDown)



router.post('/api/geoloc', controllerGeo.geoloc)
router.post('/api/getGeo', controllerGeo.getGeo)
router.post('/api/getTreks', controllerGeo.getTreks)
router.post('/api/getEventMarkers', controllerGeo.getEventMarkers)
//router.post('/api/geoLastInterval', controllerGeo.geoLastInterval)



router.post('/api/alarmFind', controllerAlarm.alarmFind)
router.get('/api/alert', controllerAlarm.alert)
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
router.post('/api/saveStatus', controllerIcon.saveStatus)
router.post('/api/saveList', controllerIcon.saveList)
router.post('/api/viewList', controllerIcon.viewList)


router.post('/api/to', controllerModel.to)
router.post('/api/toView', controllerModel.toView)



router.post('/api/tarirSave', controllerTarir.tarirSave)
router.post('/api/tarirView', controllerTarir.tarirView)




router.post('/api/viewStatus', controllerModel.viewStatus)


