const Alert = require('../models/Alert');
const User = require('../models/User');
const Company = require('../models/Company');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

class NotificationService {
  constructor() {
    this.emailTransporter = nodemailer.createTransport({
      // إعدادات SMTP
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendAlert(alertData) {
    try {
      // إنشاء تنبيه جديد
      const alert = new Alert({
        ...alertData,
        status: 'new'
      });
      await alert.save();

      // الحصول على مستخدمي الشركة
      const company = await Company.findById(alertData.company);
      const users = await User.find({
        company: alertData.company,
        role: { $in: ['admin', 'manager'] }
      });

      // إرسال الإشعارات حسب تفضيلات الشركة
      const notifications = [];
      
      if (company.settings.notificationPreferences.email) {
        notifications.push(this.sendEmailNotification(users, alert));
      }
      
      if (company.settings.notificationPreferences.push) {
        notifications.push(this.sendPushNotification(users, alert));
      }

      await Promise.all(notifications);
      return alert;
    } catch (error) {
      console.error('Error sending alert:', error);
      throw error;
    }
  }

  async sendEmailNotification(users, alert) {
    const emails = users.map(user => user.email);
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: emails.join(','),
      subject: `Alert: ${alert.type} - ${alert.severity}`,
      html: `
        <h2>New Alert</h2>
        <p><strong>Type:</strong> ${alert.type}</p>
        <p><strong>Severity:</strong> ${alert.severity}</p>
        <p><strong>Message:</strong> ${alert.message}</p>
        <p><strong>Time:</strong> ${alert.createdAt}</p>
      `
    };

    return this.emailTransporter.sendMail(mailOptions);
  }

  async sendPushNotification(users, alert) {
    const tokens = users
      .filter(user => user.fcmToken)
      .map(user => user.fcmToken);

    if (tokens.length === 0) return;

    const message = {
      notification: {
        title: `${alert.type} Alert - ${alert.severity}`,
        body: alert.message
      },
      data: {
        alertId: alert._id.toString(),
        type: alert.type,
        severity: alert.severity
      },
      tokens: tokens
    };

    return admin.messaging().sendMulticast(message);
  }

  async sendTripNotification(trip, status) {
    const message = this.getTripStatusMessage(status, trip);
    
    return this.sendAlert({
      type: 'trip',
      severity: 'low',
      vehicle: trip.vehicle,
      driver: trip.driver,
      company: trip.company,
      message: message
    });
  }

  getTripStatusMessage(status, trip) {
    switch (status) {
      case 'created':
        return `New trip created for vehicle ${trip.vehicle}`;
      case 'inProgress':
        return `Trip started for vehicle ${trip.vehicle}`;
      case 'completed':
        return `Trip completed for vehicle ${trip.vehicle}`;
      case 'cancelled':
        return `Trip cancelled for vehicle ${trip.vehicle}`;
      default:
        return `Trip status updated to ${status} for vehicle ${trip.vehicle}`;
    }
  }
}

module.exports = new NotificationService();