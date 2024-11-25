const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    database: process.env.DB_NAME || 'cport',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '250920',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    define: {
        timestamps: true, // إذا كنت تريد استخدام الطوابع الزمنية
        underscored: true, // إذا كنت تريد استخدام الأسماء المنخفضة
    },
    logging: false,
    dialectOptions: {
        ssl: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// اختبار الاتصال
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('تم الاتصال بقاعدة البيانات بنجاح.');
    } catch (error) {
        console.error('فشل الاتصال بقاعدة البيانات:', error);
    }
};

testConnection();

module.exports = { sequelize };  // تصدير sequelize مباشرة