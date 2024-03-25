

const express = require('express')

const controllerKursor = require('../controllers/kursor')
const router = express.Router()


module.exports = router

router.post('/api/getKursorObjects', controllerKursor.getKursorObjects)
router.post('/api/objects', controllerKursor.objects)
router.post('/api/getParamsKursor', controllerKursor.getParamsKursor)
router.post('/api/geoLastInterval', controllerKursor.geoLastInterval)
router.post('/api/objectId', controllerKursor.objectId)
router.post('/api/getGeoKursor', controllerKursor.getGeoKursor)
router.post('/api/getParamsKursorIntervalController', controllerKursor.getParamsKursorIntervalController)
router.post('/api/getMetas', controllerKursor.getMetas)
router.post('/api/setSensStorMeta', controllerKursor.setSensStorMeta)
router.post('/api/getSensStorMeta', controllerKursor.getSensStorMeta)
router.post('/api/getSens', controllerKursor.getSens)
router.post('/api/getSensAll', controllerKursor.getSensAll)
router.post('/api/saveValuePWR', controllerKursor.saveValuePWR)
router.post('/api/getValuePWR', controllerKursor.getValueToBase)
router.post('/api/deleteParams', controllerKursor.deleteParams)
router.post('/api/getDataParamsInterval', controllerKursor.getDataParamsInterval)
router.post('/api/updateTarirTable', controllerKursor.updateTarirTableToBase)
router.post('/api/getTarirTable', controllerKursor.getTarirDataToBase)
router.post('/api/setSummator', controllerKursor.setSummator)
router.post('/api/getSummator', controllerKursor.getSummator)
