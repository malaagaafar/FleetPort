{/*const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Trip extends Model {}

Trip.init({
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
  driverId: {
    type: DataTypes.INTEGER,
    field: 'driver_id',
    allowNull: false,
    references: {
      model: 'drivers',
      key: 'id'
    }
  },
  startLocation: {
    type: DataTypes.GEOMETRY('POINT'),
    field: 'start_location'
  },
  endLocation: {
    type: DataTypes.GEOMETRY('POINT'),
    field: 'end_location'
  },
  startAddress: {
    type: DataTypes.TEXT,
    field: 'start_address'
  },
  endAddress: {
    type: DataTypes.TEXT,
    field: 'end_address'
  },
  startTime: {
    type: DataTypes.DATE,
    field: 'start_time'
  },
  endTime: {
    type: DataTypes.DATE,
    field: 'end_time'
  },
  status: {
    type: DataTypes.ENUM('planned', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'planned'
  },
  distance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  duration: {
    type: DataTypes.INTEGER, // في الدقائق
    defaultValue: 0
  },
  fuelConsumption: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'fuel_consumption',
    defaultValue: 0
  },
  route: {
    type: DataTypes.GEOMETRY('LINESTRING')
  },
  waypoints: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  customerInfo: {
    type: DataTypes.JSONB,
    field: 'customer_info'
  },
  weather: {
    type: DataTypes.JSONB
  },
  metrics: {
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
  modelName: 'Trip',
  tableName: 'trips',
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
      fields: ['start_time']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Trip;*/}