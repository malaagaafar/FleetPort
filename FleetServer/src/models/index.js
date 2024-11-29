const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');
const PrimaryDevice = require('./Device');
const Sensor = require('./Sensor');
const { Purchase, PurchasedDevice, PurchasedSensor } = require('./Purchase');

// تعريف العلاقات
PurchasedDevice.belongsTo(PrimaryDevice, {
    foreignKey: 'device_id',
    as: 'device',
    targetKey: 'id'
});

PurchasedSensor.belongsTo(Sensor, {
    foreignKey: 'sensor_id',
    as: 'sensor',
    targetKey: 'id'
});

// تحديث وحدة التحكم لاستخدام العلاقات المعرفة
const getPurchasedDevices = async (req, res) => {
    try {
        const { userId } = req.query;
        console.log('Fetching devices for user:', userId);

        const purchasedDevices = await PurchasedDevice.findAll({
            where: { user_id: userId },
            include: {
                model: PrimaryDevice,
                as: 'device',
                attributes: ['name', 'type', 'model', 'manufacturer', 'image_url']
            },
            order: [['created_at', 'DESC']]
        });

        console.log('Found purchased devices:', JSON.stringify(purchasedDevices, null, 2));

        res.json({
            success: true,
            data: purchasedDevices
        });
    } catch (error) {
        console.error('خطأ في جلب الأجهزة المشتراة:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب الأجهزة المشتراة',
            error: error.message
        });
    }
};

const getPurchasedSensors = async (req, res) => {
    try {
        const { userId } = req.query;
        console.log('Fetching sensors for user:', userId);

        const purchasedSensors = await PurchasedSensor.findAll({
            where: { user_id: userId },
            include: {
                model: Sensor,
                as: 'sensor',
                attributes: ['name', 'type', 'model', 'manufacturer', 'image_url']
            },
            order: [['created_at', 'DESC']]
        });

        console.log('Found purchased sensors:', JSON.stringify(purchasedSensors, null, 2));

        res.json({
            success: true,
            data: purchasedSensors
        });
    } catch (error) {
        console.error('خطأ في جلب المستشعرات المشتراة:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب المستشعرات المشتراة',
            error: error.message
        });
    }
};

module.exports = {
    PrimaryDevice,
    Sensor,
    Purchase,
    PurchasedDevice,
    PurchasedSensor,
    getPurchasedDevices,
    getPurchasedSensors
};