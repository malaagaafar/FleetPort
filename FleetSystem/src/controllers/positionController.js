const positionService = require('../services/positionService');
const db = require('../config/database');

class PositionController {
    async savePositions(req, res) {
        try {
            const positions = req.body;
            const savedPositions = await positionService.savePositions(positions);
            res.json(savedPositions);
        } catch (error) {
            console.error('Controller error:', error);
            res.status(500).json({ error: 'Error saving positions' });
        }
    }

    async getLastPosition(req, res) {
        try {
            const deviceId = parseInt(req.params.deviceId);
            const position = await positionService.getLastPosition(deviceId);
            if (!position) {
                return res.status(404).json({ error: 'Position not found' });
            }
            res.json(position);
        } catch (error) {
            console.error('Controller error:', error);
            res.status(500).json({ error: 'Error fetching position' });
        }
    }

    async getPositionsInTimeRange(req, res) {
        try {
            const { deviceId, startTime, endTime } = req.query;
            const positions = await positionService.getPositionsInTimeRange(
                parseInt(deviceId),
                new Date(startTime),
                new Date(endTime)
            );
            res.json(positions);
        } catch (error) {
            console.error('Controller error:', error);
            res.status(500).json({ error: 'Error fetching positions' });
        }
    }
}

module.exports = new PositionController(); 