const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const WebSocket = require('ws');
const { sequelize } = require('./models'); // استيراد Sequelize

// استيراد الإعدادات والتكوينات
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const SocketHandler = require('./websocket/socketHandler');

// استيراد المسارات
/*const vehicleRoutes = require('./routes/vehicleRoutes');
const driverRoutes = require('./routes/driverRoutes');
const tripRoutes = require('./routes/tripRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');*/
const authRoutes = require('./routes/authRoutes');

class App {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupDatabase();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // الإعدادات الأساسية
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(compression());

    // تحديد معدل الطلبات
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 دقيقة
      max: 100 // الحد الأقصى للطلبات لكل IP
    });
    this.app.use('/api/', limiter);

    // تسجيل الطلبات
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
      });
      next();
    });
  }

  async setupDatabase() {
    try {
      // اختبار الاتصال بقاعدة البيانات
      await sequelize.authenticate();
      logger.info('Connected to PostgreSQL successfully');
      
      // مزامنة النماذج مع قاعدة البيانات (بدون إعادة إنشاء الجداول)
      await sequelize.sync({ alter: false });
      logger.info('Database models synchronized');
    } catch (error) {
      logger.error('PostgreSQL connection error:', error);
      process.exit(1);
    }
  }

  setupRoutes() {
    // المسارات الرئيسية
    /*this.app.use('/api/vehicles', vehicleRoutes);
    this.app.use('/api/drivers', driverRoutes);
    this.app.use('/api/trips', tripRoutes);
    this.app.use('/api/sensors', sensorRoutes);
    this.app.use('/api/marketplace', marketplaceRoutes);*/
    this.app.use('/api/auth', authRoutes);

    // مسار الصحة
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date(),
        uptime: process.uptime(),
        database: sequelize.authenticate()
          .then(() => 'connected')
          .catch(() => 'disconnected')
      });
    });

    // التعامل مع المسارات غير الموجودة
    this.app.use('*', (req, res) => {
      res.status(404).json({
        status: 'error',
        message: 'Route not found'
      });
    });
  }

  setupErrorHandling() {
    this.app.use(errorHandler.handleError);
  }

  setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });
    this.socketHandler = new SocketHandler(wss);
  }

  start() {
    const port = process.env.PORT || 3000;
    const server = this.app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });

    // إعداد WebSocket
    this.setupWebSocket(server);

    // التعامل مع الإغلاق الآمن
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      server.close(async () => {
        await sequelize.close();
        logger.info('Server closed. Database connection closed.');
        process.exit(0);
      });
    });
  }
}

// إنشاء وتشغيل التطبيق
const app = new App();
app.start();

module.exports = app;