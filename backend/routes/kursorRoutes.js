

const express = require('express')

const controllerKursor = require('../controllers/kursor')
const router = express.Router()


module.exports = router

router.post('/api/getKursorObjects', controllerKursor.getKursorObjects)
router.post('/api/objects', controllerKursor.objects)
router.post('/api/geoLastInterval', controllerKursor.geoLastInterval)
router.post('/api/getMetas', controllerKursor.getMetas)
router.post('/api/setSensStorMeta', controllerKursor.setSensStorMeta)
router.post('/api/getSensStorMeta', controllerKursor.getSensStorMeta)
router.post('/api/getSens', controllerKursor.getSens)
router.post('/api/saveValuePWR', controllerKursor.saveValuePWR)
router.post('/api/getValuePWR', controllerKursor.getValueToBase)
router.post('/api/deleteParams', controllerKursor.deleteParams)
router.post('/api/getDataParamsInterval', controllerKursor.getDataParamsInterval)
router.post('/api/getPressureOil', controllerKursor.getParamsToPressureAndOil)
router.post('/api/setSummator', controllerKursor.setSummator)
router.post('/api/getSummator', controllerKursor.getSummator)

