const express = require('express');
const authMiddleware = require('../middleware/auth');
const PositionController = require('../controllers/positionController');

const router = express.Router();
const positionController = new PositionController();

// تطبيق middleware الأمان على جميع المسارات
router.use(authMiddleware);

// المسارات كما هي...
router.post('/positions', positionController.savePositions);
router.get('/positions/last/:deviceId', positionController.getLastPosition);
router.get('/positions/range', positionController.getPositionsInTimeRange);

module.exports = router; 