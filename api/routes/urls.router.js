const express = require('express')
const {shorten, customUrl} = require('../controllers/url.controller')


const router = express.Router()

router.post('/shorten', shorten)
router.post('/custom', customUrl)

module.exports = router