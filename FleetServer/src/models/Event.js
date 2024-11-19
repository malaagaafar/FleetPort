const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Event extends Model {}

Event.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  vehicleId: {
    type: DataTypes.INTEGER,
    field: 'vehicle_id',
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
  tripId: {
    type: DataTypes.INTEGER,
    field: 'trip_id',
    references: {
      model: 'trips',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM(
      'speed_violation',
      'harsh_braking',
      'harsh_acceleration',
      'idle_time',
      'maintenance_alert',
      'accident',
      'system_alert'
    ),
    allowNull: false
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false
  },
  location: {
    type: DataTypes.GEOMETRY('POINT')
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  data: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  description: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('new', 'acknowledged', 'resolved', 'ignored'),
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
  modelName: 'Event',
  tableName: 'events',
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
      fields: ['trip_id']
    },
    {
      fields: ['timestamp']
    },
    {
      fields: ['type']
    },
    {
      fields: ['severity']
    }
  ]
});

module.exports = Event;