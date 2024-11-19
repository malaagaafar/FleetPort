const winston = require('winston');
require('winston-daily-rotate-file');

class Logger {
  constructor() {
    const logFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    );

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      transports: [
        // تسجيل الأخطاء في ملف
        new winston.transports.DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxFiles: '30d'
        }),
        // تسجيل كل المستويات
        new winston.transports.DailyRotateFile({
          filename: 'logs/combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '30d'
        })
      ]
    });

    // إضافة تسجيل في وحدة التحكم في بيئة التطوير
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }));
    }
  }

  error(message, meta = {}) {
    this.logger.error(message, meta);
  }

  warn(message, meta = {}) {
    this.logger.warn(message, meta);
  }

  info(message, meta = {}) {
    this.logger.info(message, meta);
  }

  debug(message, meta = {}) {
    this.logger.debug(message, meta);
  }

  // تسجيل أحداث العمل
  logBusinessEvent(event, data = {}) {
    this.logger.info('Business Event', {
      event,
      data,
      timestamp: new Date().toISOString()
    });
  }

  // تسجيل أداء API
  logAPIMetrics(req, res, duration) {
    this.logger.info('API Metrics', {
      method: req.method,
      url: req.url,
      duration,
      statusCode: res.statusCode,
      userAgent: req.get('user-agent')
    });
  }

  // تسجيل أحداث الأمان
  logSecurityEvent(event, user, details = {}) {
    this.logger.warn('Security Event', {
      event,
      user,
      details,
      ip: details.ip,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new Logger();