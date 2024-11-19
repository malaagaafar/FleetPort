const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Company = require('../models/Company');
const config = require('../config/database');
const NotificationService = require('./notificationService');
const logger = require('../utils/logger');

class AuthService {
  async login(email, password) {
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        throw new Error('بيانات الاعتماد غير صحيحة');
      }

      if (user.isLocked()) {
        throw new Error('الحساب مقفل. يرجى المحاولة لاحقاً');
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        await user.incrementLoginAttempts();
        throw new Error('بيانات الاعتماد غير صحيحة');
      }

      // إعادة تعيين محاولات تسجيل الدخول
      await user.resetLoginAttempts();

      // تحديث آخر تسجيل دخول
      user.lastLogin = new Date();
      await user.save();

      // إنشاء التوكن
      const token = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user);

      return {
        token,
        refreshToken,
        user: user.toJSON()
      };
    } catch (error) {
      logger.error('Login failed:', {
        email,
        error: error.message
      });
      throw error;
    }
  }

  generateToken(user) {
    return jwt.sign(
      {
        userId: user._id,
        company: user.company,
        role: user.role
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      { userId: user._id },
      config.refreshTokenSecret,
      { expiresIn: config.refreshTokenExpiration }
    );
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.refreshTokenSecret);
      const user = await User.findById(decoded.userId);

      if (!user || user.status !== 'active') {
        throw new Error('المستخدم غير موجود أو غير نشط');
      }

      const token = this.generateToken(user);
      return { token };
    } catch (error) {
      logger.error('Token refresh failed:', {
        error: error.message
      });
      throw new Error('فشل تحديث التوكن');
    }
  }

  async forgotPassword(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('البريد الإلكتروني غير مسجل');
      }

      // إنشاء رمز إعادة تعيين كلمة المرور
      user.generatePasswordReset();
      await user.save();

      // إرسال بريد إلكتروني لإعادة تعيين كلمة المرور
      await NotificationService.sendPasswordResetEmail(user);

      return { message: 'تم إرسال تعليمات إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' };
    } catch (error) {
      logger.error('Password reset request failed:', {
        email,
        error: error.message
      });
      throw error;
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error('رمز إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية');
      }

      // تحديث كلمة المرور
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      // إرسال إشعار بتغيير كلمة المرور
      await NotificationService.sendPasswordChangeNotification(user);

      return { message: 'تم تغيير كلمة المرور بنجاح' };
    } catch (error) {
      logger.error('Password reset failed:', {
        error: error.message
      });
      throw error;
    }
  }

  async registerFCMToken(userId, fcmToken) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('المستخدم غير موجود');
      }

      await user.addFCMToken(fcmToken);
      return { message: 'تم تسجيل رمز FCM بنجاح' };
    } catch (error) {
      logger.error('FCM token registration failed:', {
        userId,
        error: error.message
      });
      throw error;
    }
  }

  async removeFCMToken(userId, fcmToken) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('المستخدم غير موجود');
      }

      await user.removeFCMToken(fcmToken);
      return { message: 'تم إزالة رمز FCM بنجاح' };
    } catch (error) {
      logger.error('FCM token removal failed:', {
        userId,
        error: error.message
      });
      throw error;
    }
  }
}

module.exports = new AuthService();