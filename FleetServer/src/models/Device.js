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
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('type1', 'type2'), // استبدل بالقيم المناسبة
        allowNull: false,
    },
    trailer_type: {
        type: DataTypes.ARRAY(DataTypes.STRING), // استبدل بالنوع المناسب
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
    supported_sensors: {
        type: DataTypes.ARRAY(DataTypes.STRING), // استبدل بالنوع المناسب
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
        type: DataTypes.STRING,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    installation_guide_url: {
        type: DataTypes.STRING,
    },
    installation_video_url: {
        type: DataTypes.STRING,
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
        defaultValue: 'device',
    },
}, {
    sequelize,
    modelName: 'PrimaryDevice',
    tableName: 'primary_devices',
});

module.exports = PrimaryDevice;