const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');

class SocketHandler {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // تخزين اتصالات العملاء
    this.setupWebSocket();
  }

  setupWebSocket() {
    this.wss.on('connection', async (ws, req) => {
      try {
        // التحقق من صحة التوكن
        const token = req.url.split('=')[1];
        const decoded = jwt.verify(token, config.jwtSecret);
        
        // تخزين معلومات العميل
        this.clients.set(ws, {
          userId: decoded.userId,
          company: decoded.company
        });

        // إعداد معالجات الأحداث
        this.setupMessageHandler(ws);
        this.setupCloseHandler(ws);

        // إرسال البيانات الأولية
        await this.sendInitialData(ws, decoded.company);
      } catch (error) {
        console.error('WebSocket connection error:', error);
        ws.close();
      }
    });
  }

  setupMessageHandler(ws) {
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        switch (data.type) {
          case 'subscribe_vehicle':
            await this.handleVehicleSubscription(ws, data.vehicleId);
            break;
          case 'subscribe_trip':
            await this.handleTripSubscription(ws, data.tripId);
            break;
          // يمكن إضافة المزيد من أنواع الرسائل هنا
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
  }

  setupCloseHandler(ws) {
    ws.on('close', () => {
      this.clients.delete(ws);
    });
  }

  async sendInitialData(ws, companyId) {
    try {
      // إرسال بيانات المركبات النشطة
      const activeVehicles = await Vehicle.find({
        company: companyId,
        status: 'active'
      });

      // إرسال الرحلات الجارية
      const activeTrips = await Trip.find({
        company: companyId,
        status: 'inProgress'
      });

      ws.send(JSON.stringify({
        type: 'initial_data',
        vehicles: activeVehicles,
        trips: activeTrips
      }));
    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  }

  async handleVehicleSubscription(ws, vehicleId) {
    // تنفيذ منطق الاشتراك في تحديثات المركبة
  }

  async handleTripSubscription(ws, tripId) {
    // تنفيذ منطق الاشتراك في تحديثات الرحلة
  }

  // إرسال تحديث إلى جميع العملاء المتصلين لشركة معينة
  broadcastToCompany(companyId, data) {
    this.clients.forEach((client, ws) => {
      if (client.company === companyId && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    });
  }

  // إرسال تحديث إلى عميل محدد
  sendToClient(ws, data) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }
}

module.exports = SocketHandler;