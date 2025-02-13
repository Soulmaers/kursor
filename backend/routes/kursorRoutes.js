

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
router.post('/api/saveSetParams', controllerKursor.saveSetParams)


router.post('/api/deleteConfigParam', controllerKursor.deleteConfigParam)
router.post('/api/getConfigParam', controllerKursor.getConfigParam)
router.post('/api/deleteParams', controllerKursor.deleteParams)
router.post('/api/getDataParamsInterval', controllerKursor.getDataParamsInterval)
router.post('/api/getPressureOil', controllerKursor.getParamsToPressureAndOil)
router.post('/api/setSummator', controllerKursor.setSummator)
router.post('/api/getSummator', controllerKursor.getSummator)

router.post('/api/getOldObjects', controllerKursor.getOldObjects)
router.post('/api/updateIdOBjectToBase', controllerKursor.updateIdOBjectToBase)
router.post('/api/deleteAltableObject', controllerKursor.deleteAllTableObjects)


router.post('/api/getAccountResourseID', controllerKursor.getAccountResourseID)
router.post('/api/getPropertyPermissions', controllerKursor.getPropertyPermissions)
router.post('/api/getValuePWR', controllerKursor.getValueToBase)


router.post('/api/getRefills', controllerKursor.getRefills)



