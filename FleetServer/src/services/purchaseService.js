const { sequelize, QueryTypes } = require('../config/database');
const { Purchase, PurchasedDevice, SerialDevice, PurchasedSensor, SerialSensors } = require('../models/Purchase.js');


class PurchaseService {
    async recordPurchase({ id, items, total, date, userId, created_at = new Date(), updated_at = new Date() }) {
        try {
            // استخدام نموذج Sequelize لإنشاء عملية الشراء
            await Purchase.create({
                id,
                items: JSON.stringify(items),  // تأكد من تحويل items إلى JSON
                total,
                date,
                user_id: userId, // تأكد من استخدام user_id بدلاً من userId
                created_at,
                updated_at
            });

            console.log('Purchase recorded successfully.');
        } catch (error) {
            console.error('Error recording purchase:', error);
            throw new Error('خطأ في تسجيل عملية الشراء.');
        }
    }

    async processPurchasesByUser(userId) {
        console.log('Processing', userId)
        try {
            // استرجاع عمليات الشراء غير المعالجة للمستخدم
            const purchases = await Purchase.findAll({
                where: {
                    user_id: userId,
                    processed: false,
                },
            });
            console.log('Processing', purchases.length)

            if (purchases.length === 0) {
                throw new Error('No unprocessed orders found for this user');
            }
    
            for (const purchase of purchases) {
                const cleanedItems = purchase.items.replace(/\\"/g, '"').slice(1, -1); // إزالة محارف الهروب الزائدة
                const products = JSON.parse(cleanedItems);

                for (const product of products) {
                    const {id: deviceId, quantity, category} = product;

                    if (category === 'primary_devices') {
                        console.log('primary_devices in')
                        // معالجة الأجهزة
                        const availableSerials = await sequelize.query(
                            `SELECT "serial_number", "device_id", "available"
                             FROM "serial_devices" 
                             WHERE "device_id" = :deviceId AND "available" = true
                             LIMIT :quantity`,
                            {
                                replacements: { deviceId, quantity },  // هذه هي القيم التي سيتم تمريرها إلى الاستعلام
                                type: sequelize.QueryTypes.SELECT  // تعيين نوع الاستعلام إلى SELECT
                            }
                        );
                        console.log('avaSer', availableSerials)

                        if (availableSerials.length < quantity) {
                            throw new Error('Not enough available serial numbers for devices');
                        }
    
                        for (let i = 0; i < quantity; i++) {
                            const serialNumber = availableSerials[i].serial_number;
    
                            await PurchasedDevice.create({
                                order_id: purchase.id,
                                user_id: userId,
                                device_id: deviceId,
                                serial_number: serialNumber,
                            });
    
                            // تحديث حالة الرقم التسلسلي
                            await SerialDevice.update(
                                { available: false },
                                { where: { serial_number: serialNumber } }
                            );
                        }
                    } else if (category === 'sensors') {
                        console.log('sensors in')
                        // معالجة الأجهزة
                        const availableSerials = await sequelize.query(
                            `SELECT "serial_number", "sensor_id", "available"
                             FROM "serial_sensors" 
                             WHERE "sensor_id" = :deviceId AND "available" = true
                             LIMIT :quantity`,
                            {
                                replacements: { deviceId, quantity },  // هذه هي القيم التي سيتم تمريرها إلى الاستعلام
                                type: sequelize.QueryTypes.SELECT  // تعيين نوع الاستعلام إلى SELECT
                            }
                        );
                        console.log('avaSer', availableSerials)

                        if (availableSerials.length < quantity) {
                            throw new Error('Not enough available serial numbers for devices');
                        }
    
                        for (let i = 0; i < quantity; i++) {
                            const serialNumber = availableSerials[i].serial_number;
    
                            await PurchasedSensor.create({
                                order_id: purchase.id,
                                user_id: userId,
                                sensor_id: deviceId,
                                serial_number: serialNumber,
                            });
    
                            // تحديث حالة الرقم التسلسلي
                            await SerialSensors.update(
                                { available: false },
                                { where: { serial_number: serialNumber } }
                            );
                        }
                    }
                }
    
                // تحديث حالة عملية الشراء إلى processed
                await Purchase.update(
                    { processed: true },
                    { where: { id: purchase.id } }
                );
            }
        } catch (error) {
            console.error('Error processing purchases:', error);
            throw error;
        }
    }
}

module.exports = new PurchaseService();