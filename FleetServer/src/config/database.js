const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD, // تم تغييرها من DB_PASS إلى DB_PASSWORD
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
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

module.exports = { sequelize };