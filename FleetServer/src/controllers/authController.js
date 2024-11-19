const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  try {
      console.log('بيانات التسجيل المستلمة:', req.body);

      const {
          first_name,
          last_name,
          email,
          password,
          phone_number,
          company_name
      } = req.body;

      // التحقق من وجود المستخدم
      const existingUser = await User.findOne({
          where: { email }
      });

      if (existingUser) {
          return res.status(400).json({ message: 'البريد الإلكتروني مسجل بالفعل' });
      }

      // إنشاء مستخدم جديد
      const userData = {
          firstName: first_name ? first_name.trim() : '',
          lastName: last_name ? last_name.trim() : '',
          email: email ? email.trim().toLowerCase() : '',
          password,
          phoneNumber: phone_number ? phone_number.trim() : '',
          companyName: company_name ? company_name.trim() : null
      };

      console.log('بيانات المستخدم قبل الإنشاء:', userData);

      const user = await User.create(userData);

      const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
      );

      res.status(201).json({
          message: 'تم إنشاء الحساب بنجاح',
          token,
          user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              companyName: user.companyName
          }
      });
  } catch (error) {
      console.error('خطأ في التسجيل:', error);
      if (error.name === 'SequelizeValidationError') {
          return res.status(400).json({
              message: 'خطأ في البيانات المدخلة',
              errors: error.errors.map(e => e.message)
          });
      }
      res.status(500).json({ 
          message: 'حدث خطأ في السيرفر',
          error: error.message 
      });
  }
};

const login = async (req, res) => {
  try {
      console.log('بيانات تسجيل الدخول المستلمة:', req.body);

      const { email, password } = req.body;

      const user = await User.findOne({ 
          where: { 
              email: email.toLowerCase().trim() 
          } 
      });

      if (!user) {
          return res.status(401).json({ 
              success: false,
              message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
          });
      }

      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
          return res.status(401).json({ 
              success: false,
              message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
          });
      }

      // تحديث آخر تسجيل دخول
      await user.update({ 
          last_login: new Date() 
      });

      const token = jwt.sign(
          { 
              userId: user.id, 
              email: user.email 
          },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
      );

      return res.status(200).json({
          success: true,
          message: 'تم تسجيل الدخول بنجاح',
          token,
          user: {
              id: user.id,
              firstName: user.first_name,
              lastName: user.last_name,
              email: user.email,
              phone: user.phone,
              businessName: user.business_name,
              lastLogin: user.last_login
          }
      });
  } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      return res.status(500).json({ 
          success: false,
          message: 'حدث خطأ في السيرفر',
          error: error.message 
      });
  }
};

// تصدير الدوال
module.exports = {
    register,
    login
};