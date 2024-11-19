const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class MarketplaceListing extends Model {}

MarketplaceListing.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  type: {
    type: DataTypes.ENUM('delivery', 'transport', 'rental'),
    allowNull: false
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
  priceAmount: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'price_amount',
    allowNull: false
  },
  priceCurrency: {
    type: DataTypes.STRING(3),
    field: 'price_currency',
    defaultValue: 'SAR'
  },
  location: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: false
  },
  locationAddress: {
    type: DataTypes.TEXT,
    field: 'location_address'
  },
  startDate: {
    type: DataTypes.DATE,
    field: 'start_date'
  },
  endDate: {
    type: DataTypes.DATE,
    field: 'end_date'
  },
  requirements: {
    type: DataTypes.JSONB,
    defaultValue: {
      vehicleType: null,
      minCapacity: null,
      specialFeatures: []
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'pending', 'completed', 'cancelled'),
    defaultValue: 'active'
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
  modelName: 'MarketplaceListing',
  tableName: 'marketplace_listings',
  timestamps: true,
  indexes: [
    {
      fields: ['company_id']
    },
    {
      fields: ['type']
    },
    {
      fields: ['status']
    },
    {
      fields: ['start_date']
    },
    {
      fields: ['end_date']
    }
  ]
});

module.exports = MarketplaceListing;