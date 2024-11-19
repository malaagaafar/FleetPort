const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class FuelRecord extends Model {}

FuelRecord.init({
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
    references: {
      model: 'drivers',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  pricePerUnit: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'price_per_unit'
  },
  location: {
    type: DataTypes.GEOMETRY('POINT')
  },
  stationName: {
    type: DataTypes.STRING(100),
    field: 'station_name'
  },
  odometer: {
    type: DataTypes.INTEGER
  },
  fuelType: {
    type: DataTypes.ENUM('petrol', 'diesel', 'electric', 'hybrid'),
    field: 'fuel_type'
  },
  fullTank: {
    type: DataTypes.BOOLEAN,
    field: 'full_tank',
    defaultValue: true
  },
  notes: {
    type: DataTypes.TEXT
  },
  receipt: {
    type: DataTypes.STRING // URL للصورة
  },
  tripId: {
    type: DataTypes.INTEGER,
    field: 'trip_id',
    references: {
      model: 'trips',
      key: 'id'
    }
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
  modelName: 'FuelRecord',
  tableName: 'fuel_records',
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
      fields: ['date']
    }
  ]
});

module.exports = FuelRecord;