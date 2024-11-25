const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

// تأكد من أن المسار صحيح
router.get('/', deviceController.getDevices);
//router.get('/:id', deviceController.getDeviceById);
router.get('/sensors', deviceController.getSensors);



module.exports = router;