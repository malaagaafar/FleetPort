const express = require('express');
//const { authenticateToken } = require('../middleware/auth');
const positionController = require('../controllers/positionController');

const router = express.Router();

// تطبيق middleware المصادقة على جميع المسارات
//router.use(authenticateToken);

// المسارات
router.post('/positions', positionController.savePositions);
router.get('/positions/last/:deviceId', positionController.getLastPosition);
router.get('/positions/range', positionController.getPositionsInTimeRange);

module.exports = router; 