const logger = require('../utils/logger');

class ErrorHandler {
  static async handleError(err, req, res, next) {
    // تسجيل الخطأ
    logger.error({
      error: {
        message: err.message,
        stack: err.stack,
        code: err.code
      },
      request: {
        method: req.method,
        url: req.url,
        body: req.body,
        user: req.user?.userId
      }
    });

    // تصنيف الأخطاء
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'خطأ في التحقق من صحة البيانات',
        errors: Object.values(err.errors).map(e => ({
          field: e.path,
          message: e.message
        }))
      });
    }

    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(409).json({
        status: 'error',
        message: 'البيانات موجودة مسبقاً',
        field: Object.keys(err.keyPattern)[0]
      });
    }

    // أخطاء العمل المخصصة
    if (err.isBusinessError) {
      return res.status(err.statusCode || 400).json({
        status: 'error',
        message: err.message,
        code: err.code
      });
    }

    // الأخطاء العامة
    res.status(err.status || 500).json({
      status: 'error',
      message: process.env.NODE_ENV === 'production' 
        ? 'حدث خطأ في النظام'
        : err.message
    });
  }

  static notFound(req, res) {
    res.status(404).json({
      status: 'error',
      message: 'المسار غير موجود'
    });
  }

  // أخطاء مخصصة للعمل
  static BusinessError = class BusinessError extends Error {
    constructor(message, code = 'BUSINESS_ERROR', statusCode = 400) {
      super(message);
      this.name = 'BusinessError';
      this.code = code;
      this.statusCode = statusCode;
      this.isBusinessError = true;
    }
  }
}

module.exports = ErrorHandler;