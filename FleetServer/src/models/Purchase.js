// models/Purchase.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Purchase extends Model {}

Purchase.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    items: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    processed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updated_at :{
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Purchase',
    tableName: 'purchases', // اسم الجدول الفعلي
});

// models/PurchasedDevice.js
class PurchasedDevice extends Model {}

PurchasedDevice.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        autoIncrement: true,
    },
    order_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    device_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    serial_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    assigned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'PurchasedDevice',
    tableName: 'purchased_devices', // اسم الجدول الفعلي

});

// models/SerialDevice.js
class SerialDevice extends Model {}

SerialDevice.init({
    device_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    serial_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    sequelize,
    modelName: 'SerialDevice',
    tableName: 'serial_devices', // اسم الجدول الفعلي

});

class SerialSensors extends Model {}

SerialSensors.init({
    sensor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    serial_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    sequelize,
    modelName: 'SerialDevice',
    tableName: 'serial_sensors', // اسم الجدول الفعلي

});

class PurchasedSensor extends Model {}

PurchasedSensor.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    order_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    sensor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    serial_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    assigned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'PurchasedSensor',
    tableName: 'purchased_sensors', // اسم الجدول الفعلي

});

module.exports = {
    Purchase,
    PurchasedDevice,
    PurchasedSensor,
    SerialDevice,
    SerialSensors
};