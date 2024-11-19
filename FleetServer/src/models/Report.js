const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Report extends Model {}

Report.init({
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
      'daily',
      'weekly',
      'monthly',
      'custom',
      'vehicle',
      'driver',
      'maintenance',
      'fuel',
      'safety',
      'efficiency'
    ),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  dateRange: {
    type: DataTypes.JSONB,
    field: 'date_range',
    allowNull: false
  },
  filters: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  format: {
    type: DataTypes.ENUM('pdf', 'excel', 'csv', 'json'),
    defaultValue: 'pdf'
  },
  schedule: {
    type: DataTypes.JSONB // للتقارير المجدولة
  },
  status: {
    type: DataTypes.ENUM('generated', 'failed', 'scheduled'),
    defaultValue: 'generated'
  },
  generatedBy: {
    type: DataTypes.INTEGER,
    field: 'generated_by',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  recipients: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  fileUrl: {
    type: DataTypes.STRING,
    field: 'file_url'
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
  modelName: 'Report',
  tableName: 'reports',
  timestamps: true,
  indexes: [
    {
      fields: ['company_id']
    },
    {
      fields: ['type']
    },
    {
      fields: ['created_at']
    }
  ]
});

module.exports = Report;