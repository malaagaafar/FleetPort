const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');
const upload = require('../middleware/upload');

// تطبيق المصادقة على جميع المسارات
router.use(auth.authenticate);

// جدولة وإدارة الصيانة
router.post(
  '/schedule',
  validation.scheduleMaintenance,
  maintenanceController.scheduleMaintenanceCheck
);

router.put(
  '/records/:recordId/status',
  validation.updateMaintenanceStatus,
  maintenanceController.updateMaintenanceStatus
);

// سجلات وتاريخ الصيانة
router.get(
  '/vehicle/:vehicleId/history',
  maintenanceController.getMaintenanceHistory
);

router.get(
  '/upcoming',
  maintenanceController.getUpcomingMaintenance
);

// المرفقات
router.post(
  '/records/:recordId/attachments',
  upload.single('file'),
  maintenanceController.addMaintenanceAttachment
);

// التقارير والإحصائيات
router.get(
  '/stats',
  maintenanceController.getMaintenanceStats
);

router.get(
  '/report',
  validation.dateRange,
  maintenanceController.generateMaintenanceReport
);

module.exports = router;