
const express = require('express')
const controllerWialon = require('../controllers/dataWialon')
const controllerModel = require('../controllers/modelController')
const controllerIcon = require('../controllers/icons.controller')
const controllerAlarm = require('../controllers/alarm.controller')
const controllerTarir = require('../controllers/tarir.controller')
const controllerTech = require('../controllers/tech.controller')
const controllerData = require('../controllers/data.controller')
const controllerBitrix = require('../controllers/bitrix.controller')
const controllerShablon = require('../controllers/shablon.controller')
const controllerTyres = require('../controllers/tyres.controller')
const router = express.Router()


module.exports = router
router.post('/api/dannie', controllerData.dannie)


router.post('/api/dataSpisok', controllerData.dataSpisok)
router.post('/api/spisokList', controllerWialon.spisok)
router.post('/api/viewLogs', controllerData.viewLogs)
router.post('/api/quantityLogs', controllerWialon.quantityLogs)

router.get('/api/wialonObjects', controllerWialon.wialonObjects)
router.post('/api/objectsId', controllerWialon.objectsId)

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
router.post('/api/techViewAll', controllerTech.techViewAll)
router.post('/api/summaryYestoday', controllerTech.summaryYestoday)
router.post('/api/summaryIdwToBase', controllerTech.summaryIdwToBase)

router.post('/api/generate', controllerModel.generate)
router.get('/api/findId', controllerModel.findId)
router.get('/api/findLastId', controllerModel.findLastId)
router.post('/api/rotate', controllerModel.rotate)
router.post('/api/listTyresId', controllerModel.listTyresId)
router.post('/api/setModelTyres', controllerModel.setModelTyres)
router.get('/api/getModelTyres', controllerModel.getModelTyres)
router.post('/api/setTyres', controllerModel.setTyres)
router.post('/api/updateTyres', controllerModel.updateTyres)
router.get('/api/getTyresToSlad', controllerModel.getTyresToSlad)

router.post('/api/setTyresHistory', controllerModel.setTyresHistory)


router.get('/api/findLastIdTyres', controllerTyres.findLastIdTyres)
router.post('/api/saveDataToDBTyres', controllerTyres.saveDataToDBTyres)
router.get('/api/getAllTyres', controllerTyres.getAllTyres)
router.post('/api/updateDataInDB', controllerTyres.updateDataInDB)
router.post('/api/updateTyreSklad', controllerTyres.updateTyreSklad)
router.post('/api/updateWheel', controllerTyres.updateWheel)
router.post('/api/saveDataHistoryToDBTyres', controllerTyres.saveDataHistoryToDBTyres)
router.post('/api/getTyresPosition', controllerTyres.getTyresPosition)
router.post('/api/getHistoryTyresToID', controllerTyres.getHistoryTyresToID)
router.post('/api/getHistoryValueWheel', controllerTyres.getHistoryValueWheel)




router.post('/api/updateFilterTable', controllerModel.updateFilterTable)



router.post('/api/icon', controllerIcon.icon)
router.post('/api/iconFind', controllerIcon.iconFind)
router.post('/api/saveList', controllerIcon.saveList)
router.post('/api/viewList', controllerIcon.viewList)

router.post('/api/updateTarirTable', controllerTarir.updateTarirTableToBase)
router.post('/api/getTarirTable', controllerTarir.getTarirDataToBase)
router.post('/api/tarirView', controllerTarir.tarirView)

router.get('/api/guide_to', controllerShablon.getGuide)
router.post('/api/get_shablon', controllerShablon.getshablon)
router.post('/api/save_shablon', controllerShablon.setShablon)
router.post('/api/getToToBase', controllerShablon.getToToBase)



router.get('/api/webhookBitrixObject', controllerBitrix.webhookBitrixObject)
router.get('/api/webhookBitrixPressure', controllerBitrix.webhookBitrixPressure)
router.get('/api/webhookBitrixEvents', controllerBitrix.webhookBitrixEvents)





router.post('/api/saveDataModelTyres', controllerTyres.saveDataModelTyres)
router.get('/api/getModelTyresGuide', controllerTyres.getModelTyresGuide)

router.post('/postWappi', controllerBitrix.postWappi)


