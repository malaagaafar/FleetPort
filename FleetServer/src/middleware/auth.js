const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/database');

class Auth {
  static async authenticate(req, res, next) {
    try {
      // التحقق من وجود التوكن
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'لم يتم توفير رمز المصادقة' });
      }

      // التحقق من صحة التوكن
      const decoded = jwt.verify(token, config.jwtSecret);
      
      // التحقق من وجود المستخدم وحالته
      const user = await User.findById(decoded.userId);
      if (!user || user.status !== 'active') {
        return res.status(401).json({ message: 'المستخدم غير موجود أو غير نشط' });
      }

      // إضافة معلومات المستخدم إلى الطلب
      req.user = {
        userId: user._id,
        company: user.company,
        role: user.role
      };

      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'رمز المصادقة غير صالح' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'انتهت صلاحية رمز المصادقة' });
      }
      next(error);
    }
  }

  static authorizeRoles(...roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: 'ليس لديك الصلاحية للوصول إلى هذا المورد' 
        });
      }
      next();
    };
  }

  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ message: 'يجب توفير رمز التحديث' });
      }

      const decoded = jwt.verify(refreshToken, config.refreshTokenSecret);
      const user = await User.findById(decoded.userId);

      if (!user || user.status !== 'active') {
        return res.status(401).json({ message: 'المستخدم غير موجود أو غير نشط' });
      }

      const newToken = jwt.sign(
        { userId: user._id, company: user.company },
        config.jwtSecret,
        { expiresIn: '1h' }
      );

      res.json({ token: newToken });
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'رمز التحديث غير صالح' });
      }
      throw error;
    }
  }
}

module.exports = Auth;