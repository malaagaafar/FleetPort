const axios = require('axios');

class FuelCardService {
    async getCardBalance(cardId) {
        try {
            const response = await axios.get(`${process.env.FUEL_CARD_API}/cards/${cardId}/balance`);
            return response.data;
        } catch (error) {
            console.error('Error fetching card balance:', error);
            throw error;
        }
    }

    async getCardTransactions(cardId, startDate, endDate) {
        try {
            const response = await axios.get(`${process.env.FUEL_CARD_API}/cards/${cardId}/transactions`, {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }
    }

    async topUpCard(cardId, amount) {
        try {
            const response = await axios.post(`${process.env.FUEL_CARD_API}/cards/${cardId}/topup`, {
                amount,
                currency: 'CAD'
            });
            return response.data;
        } catch (error) {
            console.error('Error topping up card:', error);
            throw error;
        }
    }

    // ربط البطاقة بسائق/مركبة معينة
    async assignCard(cardId, { driverId, vehicleId }) {
        try {
            const response = await axios.post(`${process.env.FUEL_CARD_API}/cards/${cardId}/assign`, {
                driverId,
                vehicleId
            });
            return response.data;
        } catch (error) {
            console.error('Error assigning card:', error);
            throw error;
        }
    }

    // الحصول على تقرير مفصل
    async getDetailedReport(cardId, options) {
        try {
            const response = await axios.get(`${process.env.FUEL_CARD_API}/cards/${cardId}/report`, {
                params: options
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching report:', error);
            throw error;
        }
    }
}

module.exports = new FuelCardService(); 