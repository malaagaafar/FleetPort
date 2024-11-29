const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Sensor extends Model {}

Sensor.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('sensorType1', 'sensorType2'), // استبدل بالقيم المناسبة
        allowNull: false,
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    manufacturer: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.TEXT,
    },
    specifications: {
        type: DataTypes.JSONB,
        defaultValue: {},
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    installation_fee: {
        type: DataTypes.DECIMAL(10, 2),
    },
    image_url: {
        type: DataTypes.STRING,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    stock: {
        type: DataTypes.INTEGER,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'sensor',
    },
}, {
    sequelize,
    modelName: 'Sensor',
    tableName: 'sensors',
});

module.exports = Sensor;