const moment = require('moment');

class Helpers {
  static calculateDistance(coord1, coord2) {
    const R = 6371; // نصف قطر الأرض بالكيلومترات
    const lat1 = this.toRad(coord1[1]);
    const lat2 = this.toRad(coord2[1]);
    const dLat = this.toRad(coord2[1] - coord1[1]);
    const dLon = this.toRad(coord2[0] - coord1[0]);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
             Math.cos(lat1) * Math.cos(lat2) *
             Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  static toRad(value) {
    return value * Math.PI / 180;
  }

  static formatDuration(minutes) {
    return moment.duration(minutes, 'minutes').humanize();
  }

  static formatCurrency(amount, currency = 'SAR') {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  static generateTrackingNumber() {
    return `TR${moment().format('YYYYMMDD')}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  static isWithinGeofence(point, polygon) {
    // تنفيذ خوارزمية ray-casting للتحقق مما إذا كانت النقطة داخل المضلع
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];
      
      const intersect = ((yi > point[1]) !== (yj > point[1])) &&
        (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  static calculateFuelEfficiency(distance, fuelConsumed) {
    return fuelConsumed > 0 ? distance / fuelConsumed : 0;
  }

  static sanitizePhoneNumber(phone) {
    return phone.replace(/[^\d+]/g, '');
  }

  static validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}

module.exports = Helpers;