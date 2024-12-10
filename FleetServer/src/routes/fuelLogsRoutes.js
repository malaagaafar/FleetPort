const express = require('express');
const router = express.Router();
const fuelLogsController = require('../controllers/fuelLogsController');

// جلب ملخص سجلات الوقود
router.get('/summary', fuelLogsController.getFuelLogsSummary);

// جلب السجلات الأخيرة
router.get('/recent', fuelLogsController.getRecentFuelLogs);

// جلب سجل محدد
router.get('/:id', fuelLogsController.getFuelLog);

// إضافة سجل جديد
router.post('/', fuelLogsController.createFuelLog);

// تحديث سجل
router.put('/:id', fuelLogsController.updateFuelLog);

// تأكيد سجل
router.put('/:id/confirm', fuelLogsController.confirmFuelLog);

module.exports = router;