const User = require('./models/User');
const NotificationService = require('../services/notificationService');
const logger = require('../utils/logger');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await User.find({ company: req.user.company })
        .select('-password -fcmTokens')
        .sort('firstName');
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUser(req, res, next) {
    try {
      const user = await User.findById(req.params.id)
        .select('-password -fcmTokens');
      
      if (!user) {
        return res.status(404).json({ message: 'المستخدم غير موجود' });
      }

      if (user.company.toString() !== req.user.company.toString()) {
        return res.status(403).json({ message: 'غير مصرح بالوصول' });
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const { email } = req.body;
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        return res.status(400).json({ message: 'البريد الإلكتروني مستخدم مسبقاً' });
      }

      const user = new User({
        ...req.body,
        company: req.user.company
      });

      await user.save();

      // إرسال بريد إلكتروني ترحيبي
      await NotificationService.sendWelcomeEmail(user);

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const updates = { ...req.body };
      delete updates.password; // منع تحديث كلمة المرور عبر هذا المسار

      const user = await User.findOneAndUpdate(
        { 
          _id: req.params.id,
          company: req.user.company 
        },
        updates,
        { new: true }
      ).select('-password -fcmTokens');

      if (!user) {
        return res.status(404).json({ message: 'المستخدم غير موجود' });
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: 'المستخدم غير موجود' });
      }

      if (user.company.toString() !== req.user.company.toString()) {
        return res.status(403).json({ message: 'غير مصرح بالوصول' });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'كلمة المرور الحالية غير صحيحة' });
      }

      user.password = newPassword;
      await user.save();

      // إرسال إشعار بتغيير كلمة المرور
      await NotificationService.sendPasswordChangeNotification(user);

      res.json({ message: 'تم تحديث كلمة المرور بنجاح' });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const user = await User.findOneAndDelete({
        _id: req.params.id,
        company: req.user.company
      });

      if (!user) {
        return res.status(404).json({ message: 'المستخدم غير موجود' });
      }

      res.json({ message: 'تم حذف المستخدم بنجاح' });
    } catch (error) {
      next(error);
    }
  }

  // المزيد من الوظائف في الملف الكامل...
}

module.exports = new UserController();