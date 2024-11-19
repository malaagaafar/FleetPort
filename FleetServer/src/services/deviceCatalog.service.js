const db = require('../config/database');
const paymentService = require('./paymentservice');


class DeviceCatalogService {
    async getAvailableDevices({ 
        page = 1, 
        limit = 10, 
        type = null,
        sortBy = 'price',
        sortOrder = 'asc'
    }) {
        try {
            let query = `
                SELECT 
                    id,
                    name,
                    type,
                    model,
                    manufacturer,
                    description,
                    supported_sensors,
                    specifications,
                    price,
                    installation_fee,
                    image_url
                FROM primary_devices
                WHERE is_active = true
            `;

            const params = [];

            if (type) {
                params.push(type);
                query += ` AND type = $${params.length}`;
            }

            query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
            
            // إضافة الصفحات
            const offset = (page - 1) * limit;
            query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
            params.push(limit, offset);

            const { rows } = await db.query(query, params);
            
            // الحصول على العدد الإجمالي للأجهزة
            const countResult = await db.query(
                'SELECT COUNT(*) FROM primary_devices WHERE is_active = true',
            );
            const totalCount = parseInt(countResult.rows[0].count);

            return {
                devices: rows,
                pagination: {
                    total: totalCount,
                    page: page,
                    limit: limit,
                    pages: Math.ceil(totalCount / limit)
                }
            };
        } catch (error) {
            throw new Error(`خطأ في الحصول على الأجهزة المتاحة: ${error.message}`);
        }
    }

    async getDeviceById(id) {
        try {
            const query = `
                SELECT *
                FROM primary_devices
                WHERE id = $1 AND is_active = true
            `;
            
            const { rows } = await db.query(query, [id]);
            if (rows.length === 0) {
                throw new Error('الجهاز غير موجود');
            }
            
            return rows[0];
        } catch (error) {
            throw new Error(`خطأ في الحصول على تفاصيل الجهاز: ${error.message}`);
        }
    }

    async purchaseDevice({ userId, deviceId, quantity, serialNumbers, imeiNumbers, phoneNumbers }) {
        try {
            // بدء المعاملة
            await db.query('BEGIN');

            // التحقق من وجود الجهاز وسعره
            const device = await this.getDeviceById(deviceId);
            
            // التحقق من صحة البيانات
            if (!serialNumbers || !imeiNumbers || !phoneNumbers) {
                throw new Error('يجب توفير جميع البيانات المطلوبة');
            }

            if (serialNumbers.length !== quantity || 
                imeiNumbers.length !== quantity || 
                phoneNumbers.length !== quantity) {
                throw new Error('عدد الأرقام التسلسلية وأرقام IMEI وأرقام الهواتف يجب أن يتطابق مع الكمية المطلوبة');
            }
            
            // إنشاء سجلات للأجهزة المشتراة
            const purchasedDevices = [];
            for (let i = 0; i < quantity; i++) {
                const result = await db.query(`
                    INSERT INTO purchased_primary_devices (
                        user_id,
                        device_id,
                        serial_number,
                        imei,
                        phone_number,
                        status,
                        warranty_start,
                        warranty_end
                    ) VALUES ($1, $2, $3, $4, $5, 'new', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year')
                    RETURNING *
                `, [
                    userId,
                    deviceId,
                    serialNumbers[i],
                    imeiNumbers[i],
                    phoneNumbers[i]
                ]);
                
                purchasedDevices.push(result.rows[0]);
            }

            await db.query('COMMIT');
            return purchasedDevices;
        } catch (error) {
            await db.query('ROLLBACK');
            throw new Error(`خطأ في عملية الشراء: ${error.message}`);
        }
    }

    async getUserPurchasedDevices(userId) {
        try {
            const query = `
                SELECT 
                    pd.*,
                    p.name,
                    p.model,
                    p.manufacturer,
                    p.specifications,
                    p.supported_sensors
                FROM purchased_primary_devices pd
                JOIN primary_devices p ON p.id = pd.device_id
                WHERE pd.user_id = $1
                ORDER BY pd.created_at DESC
            `;
            
            const { rows } = await db.query(query, [userId]);
            return rows;
        } catch (error) {
            throw new Error(`خطأ في الحصول على الأجهزة المشتراة: ${error.message}`);
        }
    }

    async initiateDevicePurchase({ userId, deviceId, quantity, serialNumbers, imeiNumbers, phoneNumbers }) {
        try {
            // التحقق من وجود الجهاز وسعره
            const device = await this.getDeviceById(deviceId);
            
            // حساب المبلغ الإجمالي
            const totalAmount = (device.price + device.installation_fee) * quantity;

            // إنشاء نية الدفع
            const paymentIntent = await paymentService.createPaymentIntent({
                amount: totalAmount,
                userId,
                metadata: {
                    type: 'device_purchase',
                    deviceId,
                    quantity,
                    serialNumbers: JSON.stringify(serialNumbers),
                    imeiNumbers: JSON.stringify(imeiNumbers),
                    phoneNumbers: JSON.stringify(phoneNumbers)
                }
            });

            return {
                paymentIntent,
                amount: totalAmount,
                device: {
                    id: device.id,
                    name: device.name,
                    price: device.price,
                    installation_fee: device.installation_fee
                }
            };
        } catch (error) {
            throw new Error(`خطأ في بدء عملية الشراء: ${error.message}`);
        }
    }
}


module.exports = new DeviceCatalogService();