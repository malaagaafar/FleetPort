const { sequelize, QueryTypes } = require('../config/database');

class PurchaseService {
    async recordPurchase({ id, items, total, date, userId }) {
        try {
                const query = `
                INSERT INTO purchases (id, items, total, date, user_id)
                VALUES (:id, :items, :total, :date, :userId)
                `;

                await sequelize.query(query, {
                replacements: { 
                    id, 
                    items: JSON.stringify(items),  // تأكد من تحويل items إلى JSON
                    total, 
                    date, 
                    userId 
                },
                type: sequelize.QueryTypes.INSERT
                });

            console.log('Purchase recorded successfully.');
        } catch (error) {
            console.error('Error recording purchase:', error);
            throw new Error('خطأ في تسجيل عملية الشراء.');
        }
    }
}

module.exports = new PurchaseService();