const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const logger = require('../utils/logger');
const redis = require('../config/redis');

class SecurityService {
  constructor() {
    this.blacklistedTokens = new Set();
  }

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(config.bcryptSaltRounds);
    return bcrypt.hash(password, salt);
  }

  async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  generateToken(payload, expiresIn = '1h') {
    return jwt.sign(payload, config.jwtSecret, { expiresIn });
  }

  verifyToken(token) {
    try {
      if (this.isTokenBlacklisted(token)) {
        throw new Error('التوكن غير صالح');
      }
      return jwt.verify(token, config.jwtSecret);
    } catch (error) {
      logger.error('Token verification failed:', error);
      throw new Error('فشل التحقق من التوكن');
    }
  }

  async blacklistToken(token) {
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
      const timeToExpiry = decoded.exp * 1000 - Date.now();
      if (timeToExpiry > 0) {
        await redis.setex(`blacklist:${token}`, Math.ceil(timeToExpiry / 1000), '1');
      }
    }
  }

  async isTokenBlacklisted(token) {
    return !!(await redis.get(`blacklist:${token}`));
  }

  generateSecureRandomString(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  async validatePasswordStrength(password) {
    const requirements = {
      minLength: 8,
      hasUpperCase: /[A-Z]/,
      hasLowerCase: /[a-z]/,
      hasNumbers: /\d/,
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
    };

    const errors = [];

    if (password.length < requirements.minLength) {
      errors.push('يجب أن تكون كلمة المرور 8 أحرف على الأقل');
    }
    if (!requirements.hasUpperCase.test(password)) {
      errors.push('يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل');
    }
    if (!requirements.hasLowerCase.test(password)) {
      errors.push('يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل');
    }
    if (!requirements.hasNumbers.test(password)) {
      errors.push('يجب أن تحتوي كلمة المرور على رقم واحد على الأقل');
    }
    if (!requirements.hasSpecialChar.test(password)) {
      errors.push('يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async validateLoginAttempts(userId) {
    const key = `login:attempts:${userId}`;
    const attempts = await redis.incr(key);
    
    if (attempts === 1) {
      await redis.expire(key, 3600); // تنتهي صلاحية العداد بعد ساعة
    }

    if (attempts > config.maxLoginAttempts) {
      await this.lockAccount(userId);
      throw new Error('تم قفل الحساب بسبب محاولات تسجيل دخول متكررة');
    }

    return attempts;
  }

  async resetLoginAttempts(userId) {
    await redis.del(`login:attempts:${userId}`);
  }

  async lockAccount(userId) {
    await redis.setex(`account:locked:${userId}`, 3600, '1'); // قفل لمدة ساعة
  }

  async isAccountLocked(userId) {
    return !!(await redis.get(`account:locked:${userId}`));
  }

  async validateIPAddress(ip) {
    const key = `ip:requests:${ip}`;
    const requests = await redis.incr(key);
    
    if (requests === 1) {
      await redis.expire(key, 60); // إعادة تعيين العداد كل دقيقة
    }

    return requests <= config.maxRequestsPerMinute;
  }

  sanitizeInput(input) {
    // تنظيف المدخلات من الرموز الخاصة والأكواد الضارة
    return input.replace(/[<>]/g, '');
  }

  encryptSensitiveData(data) {
    const cipher = crypto.createCipher('aes-256-cbc', config.encryptionKey);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decryptSensitiveData(encrypted) {
    const decipher = crypto.createDecipher('aes-256-cbc', config.encryptionKey);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  }
}

module.exports = new SecurityService();