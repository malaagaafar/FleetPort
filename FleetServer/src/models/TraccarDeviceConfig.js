const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class TraccarDeviceConfig extends Model {}

TraccarDeviceConfig.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  device_serial_number: {
    type: DataTypes.STRING(50),
    references: {
      model: 'purchased_devices',
      key: 'serial_number',
    },
  },
  traccar_id: {
    type: DataTypes.INTEGER,
    unique: true,
  },
  traccar_status: {
    type: DataTypes.STRING(20),
  },
  traccar_disabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  last_update: {
    type: DataTypes.DATE,
  },
  last_position_id: {
    type: DataTypes.BIGINT,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  attributes: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  groupId: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  calendarId: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  sequelize,
  modelName: 'TraccarDeviceConfig',
  tableName: 'traccar_device_configs',
  timestamps: false, // لأننا نستخدم created_at و updated_at بدلاً من timestamps الافتراضية
});

module.exports = TraccarDeviceConfig;