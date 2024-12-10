const api = require('../config/api');

class FuelLogService {
    async getFuelLogsSummary(userId) {
        try {
            const response = await api.get(`/fuel-logs/summary?userId=${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching fuel logs summary:', error);
            throw error;
        }
    }

    async getRecentFuelLogs(userId, limit = 5) {
        try {
            const response = await api.get(`/fuel-logs/recent?userId=${userId}&limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching recent fuel logs:', error);
            throw error;
        }
    }
}

module.exports = new FuelLogService(); 