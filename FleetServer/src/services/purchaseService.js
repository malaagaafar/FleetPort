const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize'); // استيراد QueryTypes مباشرة من sequelize
const { Purchase, PurchasedDevice, SerialDevice, PurchasedSensor, SerialSensors } = require('../models/Purchase.js');

class PurchaseService {
        async processPurchase({ id, items, total, date, userId }) {
            try {
                console.log('items', typeof items)
                // التأكد من أن items هو مصفوفة
                let typedItems = items;
                if (typeof items === 'string') {
                    // إذا كانت items سلسلة نصية، نقوم بتحويلها إلى مصفوفة
                    typedItems = JSON.parse(items);
                    console.log('typedItems', typedItems)
                }
        
                if (!Array.isArray(typedItems)) {
                    throw new Error('يجب أن تكون items مصفوفة');
                }
        
                // تسجيل عملية الشراء في جدول Purchases
                await Purchase.create({
                    id,
                    items: JSON.stringify(items),  // تأكد من تحويل items إلى JSON
                    total,
                    date,
                    user_id: userId,
                    processed: true,
                    created_at: new Date(),
                    updated_at: new Date()
                });
        
                // معالجة كل منتج وتسجيله
                for (const product of typedItems) {
                    // التأكد من أن البيانات صحيحة
                    if (!product.id || !product.quantity || !product.category) {
                        console.error('بيانات المنتج غير صحيحة:', product);
                        throw new Error('بيانات المنتج غير مكتملة');
                    }
        
                    const { id: deviceId, quantity, category } = product;
                    console.log('معالجة المنتج:', { deviceId, quantity, category });
        
                    for (let i = 0; i < quantity; i++) {
                        let availableSerial;
                        if (category === 'primary_devices') {
                            // البحث عن رقم تسلسلي متاح
                            [availableSerial] = await sequelize.query(
                                `UPDATE "serial_devices"
                                 SET "available" = false
                                 WHERE "device_id" = :deviceId AND "available" = true
                                 RETURNING "serial_number"`,
                                {
                                    replacements: { deviceId },
                                    type: QueryTypes.SELECT
                                }
                            );
                            console.log('availableSerial', availableSerial)
                            if (!availableSerial) {
                                throw new Error('لا يوجد أرقام تسلسلية متاحة للجهاز');
                            }
        
                            await PurchasedDevice.create({
                                order_id: id,
                                user_id: userId,
                                device_id: deviceId,
                                serial_number: availableSerial.serial_number
                            });
                        } else if (category === 'sensors') {
                            // البحث عن رقم تسلسلي متاح للمستشعر
                            [availableSerial] = await sequelize.query(
                                `UPDATE "serial_sensors"
                                 SET "available" = false
                                 WHERE "sensor_id" = :deviceId AND "available" = true
                                 RETURNING "serial_number"`,
                                {
                                    replacements: { deviceId },
                                    type: QueryTypes.SELECT
                                }
                            );
        
                            if (!availableSerial) {
                                throw new Error('لا يوجد أرقام تسلسلية متاحة للمستشعر');
                            }
        
                            await PurchasedSensor.create({
                                order_id: id,
                                user_id: userId,
                                sensor_id: deviceId,
                                serial_number: availableSerial.serial_number
                            });
                        }
                    }
                }
        
                return { message: 'تم تسجيل عملية الشراء بنجاح' };
            } catch (error) {
                console.error('خطأ في معالجة عملية الشراء:', error);
                throw error;
            }
        }
}

module.exports = new PurchaseService();