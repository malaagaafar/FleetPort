const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const twilio = require('twilio');
const User = require('../models/User');
const Company = require('../models/Company');
const logger = require('../utils/logger');

class AdvancedNotificationService {
  constructor() {
    // إعداد خدمة البريد الإلكتروني
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // إعداد خدمة الرسائل النصية
    this.smsClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // إعداد إشعارات Firebase
    this.initializeFirebase();
  }

  initializeFirebase() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
      });
    }
  }

  async sendNotification(notification) {
    try {
      const { type, recipients, data } = notification;
      const company = await Company.findById(data.companyId);
      const notificationPreferences = company.settings.notificationPreferences;

      const promises = [];

      // إرسال الإشعارات حسب تفضيلات الشركة
      if (notificationPreferences.email) {
        promises.push(this.sendEmailNotification(recipients, data));
      }

      if (notificationPreferences.sms) {
        promises.push(this.sendSMSNotification(recipients, data));
      }

      if (notificationPreferences.push) {
        promises.push(this.sendPushNotification(recipients, data));
      }

      await Promise.all(promises);

      // تسجيل الإشعار
      await this.logNotification({
        type,
        recipients,
        data,
        status: 'sent',
        timestamp: new Date()
      });

    } catch (error) {
      logger.error('Failed to send notification', {
        error: error.message,
        notification
      });
      throw error;
    }
  }

  async sendEmailNotification(recipients, data) {
    const { subject, message, template } = this.formatEmailContent(data);

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: recipients.map(r => r.email).join(','),
      subject: subject,
      html: template || message
    };

    try {
      await this.emailTransporter.sendMail(mailOptions);
    } catch (error) {
      logger.error('Email notification failed', {
        error: error.message,
        recipients,
        data
      });
      throw error;
    }
  }

  async sendSMSNotification(recipients, data) {
    const message = this.formatSMSContent(data);

    try {
      const promises = recipients
        .filter(r => r.phoneNumber)
        .map(recipient => 
          this.smsClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: recipient.phoneNumber
          })
        );

      await Promise.all(promises);
    } catch (error) {
      logger.error('SMS notification failed', {
        error: error.message,
        recipients,
        data
      });
      throw error;
    }
  }

  async sendPushNotification(recipients, data) {
    try {
      const tokens = await this.getRecipientTokens(recipients);
      
      if (tokens.length === 0) return;

      const message = {
        notification: {
          title: data.title,
          body: data.message
        },
        data: {
          ...data,
          clickAction: data.action || 'OPEN_APP'
        },
        tokens: tokens
      };

      const response = await admin.messaging().sendMulticast(message);
      
      // التعامل مع التوكنات غير الصالحة
      if (response.failureCount > 0) {
        await this.handleFailedTokens(response.responses, tokens, recipients);
      }
    } catch (error) {
      logger.error('Push notification failed', {
        error: error.message,
        recipients,
        data
      });
      throw error;
    }
  }

  async getRecipientTokens(recipients) {
    const tokens = [];
    for (const recipient of recipients) {
      const user = await User.findById(recipient.userId);
      if (user && user.fcmTokens && user.fcmTokens.length > 0) {
        tokens.push(...user.fcmTokens);
      }
    }
    return tokens;
  }

  async handleFailedTokens(responses, tokens, recipients) {
    const invalidTokens = responses.map((resp, idx) => {
      if (!resp.success) return tokens[idx];
      return null;
    }).filter(token => token !== null);

    // حذف التوكنات غير الصالحة من قاعدة البيانات
    if (invalidTokens.length > 0) {
      await User.updateMany(
        { fcmTokens: { $in: invalidTokens } },
        { $pull: { fcmTokens: { $in: invalidTokens } } }
      );
    }
  }

  formatEmailContent(data) {
    // تنسيق محتوى البريد الإلكتروني حسب نوع الإشعار
    switch (data.type) {
      case 'alert':
        return this.formatAlertEmail(data);
      case 'report':
        return this.formatReportEmail(data);
      case 'maintenance':
        return this.formatMaintenanceEmail(data);
      default:
        return this.formatDefaultEmail(data);
    }
  }

  formatSMSContent(data) {
    // تنسيق محتوى الرسالة النصية
    return `${data.title}: ${data.message}`;
  }

  async logNotification(notificationData) {
    // تسجيل الإشعار في قاعدة البيانات
    try {
      await NotificationLog.create(notificationData);
    } catch (error) {
      logger.error('Failed to log notification', {
        error: error.message,
        notificationData
      });
    }
  }
}

module.exports = new AdvancedNotificationService();