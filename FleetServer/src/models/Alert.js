const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Alert extends Model {}

Alert.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('speed', 'geofence', 'maintenance', 'sensor', 'battery', 'custom'),
    allowNull: false
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false
  },
  vehicleId: {
    type: DataTypes.INTEGER,
    field: 'vehicle_id',
    allowNull: false,
    references: {
      model: 'vehicles',
      key: 'id'
    }
  },
  driverId: {
    type: DataTypes.INTEGER,
    field: 'driver_id',
    references: {
      model: 'drivers',
      key: 'id'
    }
  },
  companyId: {
    type: DataTypes.INTEGER,
    field: 'company_id',
    allowNull: false,
    references: {
      model: 'companies',
      key: 'id'
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  location: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('new', 'acknowledged', 'resolved'),
    defaultValue: 'new'
  },
  resolvedBy: {
    type: DataTypes.INTEGER,
    field: 'resolved_by',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  resolvedAt: {
    type: DataTypes.DATE,
    field: 'resolved_at'
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at'
  }
}, {
  sequelize,
  modelName: 'Alert',
  tableName: 'alerts',
  timestamps: true,
  indexes: [
    {
      fields: ['company_id']
    },
    {
      fields: ['vehicle_id']
    },
    {
      fields: ['driver_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['type']
    }
  ]
});

module.exports = Alert;