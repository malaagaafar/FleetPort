const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class FleetDriverAccount extends Model {}

FleetDriverAccount.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    driverId: {
        type: DataTypes.INTEGER,
        field: 'driver_id',
        references: {
            model: 'drivers',
            key: 'id'
        },
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    passwordHash: {
        type: DataTypes.STRING(255),
        field: 'password_hash',
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending_review', 'active', 'inactive', 'suspended'),
        defaultValue: 'active'
    },
    deviceToken: {
        type: DataTypes.STRING(255),
        field: 'device_token'
    },
    verificationCode: {
        type: DataTypes.STRING(6),
        field: 'verification_code'
    },
    verificationExpiresAt: {
        type: DataTypes.DATE,
        field: 'verification_expires_at'
    },
    lastLogin: {
        type: DataTypes.DATE,
        field: 'last_login'
    }
}, {
    sequelize,
    modelName: 'FleetDriverAccount',
    tableName: 'fleet_driver_accounts',
    timestamps: true,
    underscored: true
});

// تعريف العلاقات
FleetDriverAccount.associate = (models) => {
    FleetDriverAccount.belongsTo(models.Driver, {
        foreignKey: 'driver_id',
        as: 'driver'
    });
};

module.exports = FleetDriverAccount; 