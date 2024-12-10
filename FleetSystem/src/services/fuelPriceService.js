const axios = require('axios');

class FuelPriceService {
    async getCurrentPrices() {
        try {
            // يمكن استبدال هذا برابط API حقيقي
            const response = await axios.get('API_URL/fuel-prices');
            return response.data;
        } catch (error) {
            console.error('Error fetching fuel prices:', error);
            // إرجاع القيم الافتراضية في حال فشل الطلب
            return {
                diesel91: 0,
                diesel95: 0,
                diesel98: 0
            };
        }
    }

    // يمكن إضافة cache للأسعار لتقليل الطلبات على API
    async getCachedPrices() {
        // التنفيذ حسب الحاجة
    }
}

module.exports = new FuelPriceService(); 