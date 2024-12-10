import api from '@/config/api';

const fuelLogService = {
    getFuelLogsSummary: async (userId) => {
        console.log('getFuelLogsSummary', userId);
        try {
            const response = await api.get(`/fuel-logs/summary?userId=${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching fuel logs summary:', error);
            throw error;
        }
    },

    getRecentFuelLogs: async (userId, limit = 5) => {
        try {
            const response = await api.get(`/fuel-logs/recent?userId=${userId}&limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching recent fuel logs:', error);
            throw error;
        }
    }
};

export default fuelLogService;