{/*const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class SensorData extends Model {}

SensorData.init({
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
  tripId: {
    type: DataTypes.INTEGER,
    field: 'trip_id',
    references: {
      model: 'trips',
      key: 'id'
    }
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  location: {
    type: DataTypes.GEOMETRY('POINT')
  },
  speed: {
    type: DataTypes.DECIMAL(5, 2)
  },
  acceleration: {
    type: DataTypes.DECIMAL(5, 2)
  },
  engineRpm: {
    type: DataTypes.INTEGER,
    field: 'engine_rpm'
  },
  engineTemp: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'engine_temp'
  },
  fuelLevel: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'fuel_level'
  },
  batteryVoltage: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'battery_voltage'
  },
  tirePressure: {
    type: DataTypes.JSONB,
    field: 'tire_pressure'
  },
  oilPressure: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'oil_pressure'
  },
  diagnosticCodes: {
    type: DataTypes.JSONB,
    field: 'diagnostic_codes'
  },
  data: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'SensorData',
  tableName: 'sensor_data',
  timestamps: true,
  updatedAt: false,
  indexes: [
    {
      fields: ['company_id']
    },
    {
      fields: ['vehicle_id']
    },
    {
      fields: ['trip_id']
    },
    {
      fields: ['timestamp']
    }
  ]
});

module.exports = SensorData;*/}