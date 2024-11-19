const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Schedule extends Model {}

Schedule.init({
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
  type: {
    type: DataTypes.ENUM(
      'driver_shift',
      'maintenance',
      'delivery',
      'route',
      'inspection'
    ),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  startDate: {
    type: DataTypes.DATE,
    field: 'start_date',
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    field: 'end_date',
    allowNull: false
  },
  recurringPattern: {
    type: DataTypes.JSONB,
    field: 'recurring_pattern'
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    field: 'assigned_to',
    references: {
      model: 'users',
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
  status: {
    type: DataTypes.ENUM('active', 'completed', 'cancelled', 'on_hold'),
    defaultValue: 'active'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  location: {
    type: DataTypes.GEOMETRY('POINT')
  },
  notifications: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  createdBy: {
    type: DataTypes.INTEGER,
    field: 'created_by',
    references: {
      model: 'users',
      key: 'id'
    }
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
  modelName: 'Schedule',
  tableName: 'schedules',
  timestamps: true,
  indexes: [
    {
      fields: ['company_id']
    },
    {
      fields: ['type']
    },
    {
      fields: ['start_date']
    },
    {
      fields: ['assigned_to']
    },
    {
      fields: ['vehicle_id']
    },
    {
      fields: ['driver_id']
    }
  ]
});

module.exports = Schedule;