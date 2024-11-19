const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class MaintenanceRecord extends Model {}

MaintenanceRecord.init({
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
    allowNull: false,
    references: {
      model: 'vehicles',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('routine', 'repair', 'inspection', 'emergency'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  scheduledDate: {
    type: DataTypes.DATE,
    field: 'scheduled_date'
  },
  completedDate: {
    type: DataTypes.DATE,
    field: 'completed_date'
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'scheduled'
  },
  mileage: {
    type: DataTypes.INTEGER
  },
  parts: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  laborHours: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'labor_hours'
  },
  technician: {
    type: DataTypes.JSONB
  },
  documents: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT
  },
  nextServiceDate: {
    type: DataTypes.DATE,
    field: 'next_service_date'
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
  modelName: 'MaintenanceRecord',
  tableName: 'maintenance_records',
  timestamps: true,
  indexes: [
    {
      fields: ['company_id']
    },
    {
      fields: ['vehicle_id']
    },
    {
      fields: ['scheduled_date']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = MaintenanceRecord;