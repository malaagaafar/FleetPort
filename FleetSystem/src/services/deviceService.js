const pool = require('../config/database');

class DeviceService {
    async upsertDevice(device) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            // فقط تحديث أو إدخال الجهاز بدون حذف السجلات
            await client.query(`
                INSERT INTO devices (
                    id,
                    unique_id,
                    name,
                    status,
                    last_update
                )
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (unique_id) 
                DO UPDATE SET
                    id = EXCLUDED.id,
                    name = EXCLUDED.name,
                    status = EXCLUDED.status,
                    last_update = EXCLUDED.last_update
            `, [
                device.id,
                device.uniqueId,
                device.name,
                device.status,
                device.lastUpdate
            ]);

            await client.query('COMMIT');
            console.log(`Device ${device.uniqueId} upserted successfully`);

        } catch (error) {
            await client.query('ROLLBACK');
            console.error(`Error upserting device ${device.uniqueId}:`, error);
            throw error;
        } finally {
            client.release();
        }
    }

    async syncDevices(traccarDevices) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            // 1. جلب جميع الأجهزة الحالية
            const existingDevices = await client.query(`
                SELECT id, unique_id FROM devices
            `);

            for (const device of traccarDevices) {
                try {
                    // 2. إدخال أو تحديث كل جهاز
                    await client.query(`
                        INSERT INTO devices (
                            id,
                            unique_id,
                            name,
                            status,
                            last_update
                        )
                        VALUES ($1, $2, $3, $4, $5)
                        ON CONFLICT (unique_id) 
                        DO UPDATE SET
                            name = EXCLUDED.name,
                            status = EXCLUDED.status,
                            last_update = EXCLUDED.last_update
                    `, [
                        device.id,
                        device.uniqueId,
                        device.name,
                        device.status,
                        device.lastUpdate
                    ]);

                } catch (error) {
                    console.error(`Error syncing device ${device.uniqueId}:`, error);
                    throw error;
                }
            }

            // 3. حذف الأجهزة غير الموجودة
            const traccarDeviceIds = traccarDevices.map(d => d.uniqueId);
            await client.query(`
                DELETE FROM devices 
                WHERE unique_id NOT IN (${traccarDeviceIds.map((_, i) => `$${i + 1}`).join(',')})
            `, traccarDeviceIds);

            await client.query('COMMIT');
            console.log('Devices synced successfully');

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error syncing devices:', error);
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new DeviceService(); 