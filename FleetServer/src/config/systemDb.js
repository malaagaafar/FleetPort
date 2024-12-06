const { Sequelize } = require('sequelize');

const systemDb = new Sequelize(
    process.env.SYSTEM_DATABASE_URL || "postgresql://postgres:250920@localhost:5432/fleet_system",
    {
        dialect: 'postgres',
        logging: false
    }
);

module.exports = systemDb; 