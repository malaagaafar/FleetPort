const pool = require('../config/database');
const simulatorService = require('./simulatorService');

class DeviceStatusSimulator {
    constructor() {
        this.devices = [
            { id: 9780, name: '7', uniqueId: '123213', status: 'online' },
            { id: 10143, name: '6', uniqueId: '123498', status: 'online' }
        ];
        this.timer = null;
        this.simulationInterval = 120000; // كل دقيقتين
    }

    async updateDeviceStatus(device) {
        try {
            // احتمالية 30% أن يصبح الجهاز offline
            const shouldGoOffline = Math.random() < 0.3;
            const newStatus = shouldGoOffline ? 'offline' : 'online';

            // تحديث حالة الجهاز في الذاكرة
            device.status = newStatus;

            // تحديث حالة الجهاز في قاعدة البيانات
            await pool.query(`
                UPDATE devices 
                SET status = $1, 
                    last_update = CURRENT_TIMESTAMP 
                WHERE id = $2
            `, [newStatus, device.id]);

            // إضافة سجل في جدول تغييرات الحالة
            await pool.query(`
                INSERT INTO device_status_changes 
                (device_id, status) 
                VALUES ($1, $2)
            `, [device.id, newStatus]);

            // إخبار simulatorService بالحالة الجديدة
            if (newStatus === 'online') {
                simulatorService.enableDevice(device.id);
            } else {
                simulatorService.disableDevice(device.id);
            }

            console.log(`Simulated status change for device ${device.id}: ${newStatus}`);
        } catch (error) {
            console.error(`Error updating device status for device ${device.id}:`, error);
        }
    }

    async start() {
        console.log('Starting device status simulation...');
        
        this.timer = setInterval(async () => {
            try {
                for (const device of this.devices) {
                    await this.updateDeviceStatus(device);
                }
            } catch (error) {
                console.error('Error in device status simulation:', error);
            }
        }, this.simulationInterval);
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            console.log('Device status simulation stopped');
        }
    }
}

module.exports = new DeviceStatusSimulator(); 