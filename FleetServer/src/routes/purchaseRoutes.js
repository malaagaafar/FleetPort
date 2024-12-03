const express = require('express');
const router = express.Router();
const { getAvailableDevicesForAssignment, handlePurchase, getPurchasedDevices, getPurchasedSensors, getAvailableDevicesForSensor, assignSensorToDevice, assignDeviceToVehicle} = require('../controllers/purchaseController'); // تأكد من استيراد الدالة بشكل صحيح
const { authenticateToken } = require('../middleware/auth');

// مسارات الأجهزة والمستشعرات المشتراة
router.get('/purchased-devices', getPurchasedDevices);
router.get('/purchased-sensors', getPurchasedSensors);
router.get('/available-for-sensor', getAvailableDevicesForSensor);
router.post('/assign-sensor', assignSensorToDevice);
router.post('/assign-device', assignDeviceToVehicle);
router.get('/available-devices', getAvailableDevicesForAssignment);


module.exports = router;
// مسار لتسجيل عملية شراء
router.post('/', handlePurchase); // استخدم الدالة المستوردة

module.exports = router; // تأكد من تصدير router