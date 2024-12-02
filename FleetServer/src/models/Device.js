const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class PrimaryDevice extends Model {}

PrimaryDevice.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    model: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    manufacturer: {
        type: DataTypes.STRING(255),
    },
    description: {
        type: DataTypes.TEXT,
    },
    supported_sensors: {
        type: DataTypes.ARRAY(DataTypes.ENUM(
            'temperature',
            'door',
            'fuel',
            'weight',
            'camera',
            'humidity'
        )),
        defaultValue: [],
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
        type: DataTypes.STRING(255),
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    installation_guide_url: {
        type: DataTypes.STRING(255),
    },
    installation_video_url: {
        type: DataTypes.STRING(255),
    },
    trailer_type: {
        type: DataTypes.ARRAY(DataTypes.ENUM(
            'flatbed',
            'box',
            'refrigerated',
            'tanker',
            'lowboy',
            'car_carrier',
            'tipper',
            'curtainsider',
            'skeletal',
            'extendable'
        )),
    },
    type: {
        type: DataTypes.ENUM(
            'truck',
            'van',
            'pickup',
            'refrigerated',
            'tanker',
            'trailer'
        ),
    },
    category: {
        type: DataTypes.STRING(50),
        defaultValue: 'primary_devices',
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    sequelize,
    modelName: 'PrimaryDevice',
    tableName: 'primary_devices',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = PrimaryDevice;