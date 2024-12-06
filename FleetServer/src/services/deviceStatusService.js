const { sequelize } = require('../config/database');
const systemDb = require('../config/systemDb');

async function updateDeviceStatuses() {
    try {
        // جلب آخر المواقع من قاعدة بيانات Traccar
        const positions = await systemDb.query(`
            SELECT DISTINCT ON (device_id)
                device_id, device_time
            FROM positions
            ORDER BY device_id, device_time DESC
        `);

        // تحديث الأجهزة التي لم ترسل مواقع منذ أكثر من دقيقتين
        for (const position of positions[0]) {
            const lastUpdate = new Date(position.device_time);
            const now = new Date();
            const diffMinutes = (now - lastUpdate) / 1000 / 60;

            if (diffMinutes > 2) {
                await sequelize.query(`
                    UPDATE traccar_device_configs 
                    SET status_changed_at = CURRENT_TIMESTAMP
                    WHERE traccar_id = :deviceId
                `, {
                    replacements: { deviceId: position.device_id }
                });
            }
        }
    } catch (error) {
        console.error('Error updating device statuses:', error);
    }
}

// تشغيل الوظيفة كل دقيقة
setInterval(updateDeviceStatuses, 60000);

module.exports = { updateDeviceStatuses }; 