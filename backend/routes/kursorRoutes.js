

const express = require('express')

const controllerKursor = require('../controllers/kursor')
const router = express.Router()


module.exports = router

router.post('/api/getKursorObjects', controllerKursor.getKursorObjects)
router.post('/api/objects', controllerKursor.objects)
router.post('/api/getParamsKursor', controllerKursor.getParamsKursor)
router.post('/api/geoLastIntervalKursor', controllerKursor.geoLastIntervalKursor)
router.post('/api/objectId', controllerKursor.objectId)