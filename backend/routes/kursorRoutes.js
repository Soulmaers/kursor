

const express = require('express')

const controllerKursor = require('../controllers/kursor')
const router = express.Router()


module.exports = router

router.post('/api/getKursorObjects', controllerKursor.getKursorObjects)
