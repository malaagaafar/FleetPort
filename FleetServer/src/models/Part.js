const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Part extends Model {}

Part.init({
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
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  partNumber: {
    type: DataTypes.STRING(50),
    field: 'part_number',
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  },
  category: {
    type: DataTypes.STRING(50)
  },
  manufacturer: {
    type: DataTypes.STRING(100)
  },
  model: {
    type: DataTypes.STRING(100)
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  minQuantity: {
    type: DataTypes.INTEGER,
    field: 'min_quantity',
    defaultValue: 1
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'unit_price'
  },
  location: {
    type: DataTypes.STRING(100) // موقع التخزين
  },
  supplier: {
    type: DataTypes.JSONB
  },
  compatibility: {
    type: DataTypes.JSONB, // قائمة المركبات المتوافقة
    defaultValue: []
  },
  images: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  documents: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('active', 'discontinued', 'out_of_stock'),
    defaultValue: 'active'
  },
  lastOrderDate: {
    type: DataTypes.DATE,
    field: 'last_order_date'
  },
  warrantyPeriod: {
    type: DataTypes.INTEGER,
    field: 'warranty_period' // بالأيام
  },
  notes: {
    type: DataTypes.TEXT
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
  modelName: 'Part',
  tableName: 'parts',
  timestamps: true,
  indexes: [
    {
      fields: ['company_id']
    },
    {
      fields: ['part_number']
    },
    {
      fields: ['category']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Part;