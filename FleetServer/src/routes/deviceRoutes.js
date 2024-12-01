const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

// تصحيح المسارات
router.get('/', deviceController.getDevices);
router.get('/sensors', deviceController.getSensors);
router.post('/connect-traccar', deviceController.connectToTraccar); // تصحيح اسم الدالة
router.put('/update-traccar-status/:serialNumber', deviceController.updateDeviceTraccarStatus);
module.exports = router;