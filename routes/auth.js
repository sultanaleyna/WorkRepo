const express = require('express');
const router = express.Router()
const dataController = require('/controllers/dataController')

router.post('/token', dataController.getToken)
router.patch('/data', dataController.getData)

module.exports = router