const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Vehicle extends Model {}

Vehicle.init({
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
  plateNumber: {
    type: DataTypes.STRING(20),
    field: 'plate_number',
    unique: true,
    allowNull: false
  },
  make: {
    type: DataTypes.STRING(50)
  },
  model: {
    type: DataTypes.STRING(50)
  },
  year: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1900,
      max: new Date().getFullYear() + 1
    }
  },
  vin: {
    type: DataTypes.STRING(17),
    unique: true,
    validate: {
      len: [17, 17]
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'maintenance', 'inactive'),
    defaultValue: 'active'
  },
  lastMaintenanceDate: {
    type: DataTypes.DATE,
    field: 'last_maintenance_date'
  },
  nextMaintenanceDate: {
    type: DataTypes.DATE,
    field: 'next_maintenance_date'
  },
  mileage: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  fuelType: {
    type: DataTypes.ENUM('petrol', 'diesel', 'electric', 'hybrid'),
    field: 'fuel_type'
  },
  fuelCapacity: {
    type: DataTypes.DECIMAL(6, 2),
    field: 'fuel_capacity'
  },
  specifications: {
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
  modelName: 'Vehicle',
  tableName: 'vehicles',
  timestamps: true,
  indexes: [
    {
      fields: ['company_id']
    },
    {
      fields: ['plate_number']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Vehicle;