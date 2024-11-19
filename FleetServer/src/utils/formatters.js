const moment = require('moment');

class Formatters {
  static formatVehicleData(vehicle) {
    return {
      id: vehicle._id,
      plateNumber: vehicle.plateNumber,
      info: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
      status: this.formatStatus(vehicle.status),
      lastLocation: this.formatLocation(vehicle.lastLocation),
      driver: vehicle.currentDriver ? this.formatDriverInfo(vehicle.currentDriver) : null,
      lastUpdated: this.formatDateTime(vehicle.updatedAt)
    };
  }

  static formatTripData(trip) {
    return {
      id: trip._id,
      trackingNumber: trip.trackingNumber,
      vehicle: this.formatVehicleInfo(trip.vehicle),
      driver: this.formatDriverInfo(trip.driver),
      status: this.formatStatus(trip.status),
      progress: this.calculateTripProgress(trip),
      startTime: this.formatDateTime(trip.startTime),
      endTime: trip.endTime ? this.formatDateTime(trip.endTime) : null,
      duration: this.formatDuration(trip.duration),
      distance: this.formatDistance(trip.distance)
    };
  }

  static formatStatus(status) {
    const statusMap = {
      active: 'نشط',
      inactive: 'غير نشط',
      maintenance: 'في الصيانة',
      inProgress: 'قيد التنفيذ',
      completed: 'مكتمل',
      cancelled: 'ملغي'
    };
    return statusMap[status] || status;
  }

  static formatLocation(location) {
    if (!location || !location.coordinates) return 'غير متوفر';
    return {
      latitude: location.coordinates[1],
      longitude: location.coordinates[0],
      formatted: `${location.coordinates[1].toFixed(6)}, ${location.coordinates[0].toFixed(6)}`
    };
  }

  static formatDateTime(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  }

  static formatDate(date) {
    return moment(date).format('YYYY-MM-DD');
  }

  static formatTime(date) {
    return moment(date).format('HH:mm:ss');
  }

  static formatDuration(minutes) {
    if (!minutes) return '0 دقيقة';
    const duration = moment.duration(minutes, 'minutes');
    const hours = Math.floor(duration.asHours());
    const mins = duration.minutes();
    
    let result = '';
    if (hours > 0) result += `${hours} ساعة `;
    if (mins > 0) result += `${mins} دقيقة`;
    return result.trim();
  }

  static formatDistance(kilometers) {
    if (!kilometers) return '0 كم';
    return `${kilometers.toFixed(1)} كم`;
  }

  static formatDriverInfo(driver) {
    if (!driver) return null;
    return {
      id: driver._id,
      name: `${driver.firstName} ${driver.lastName}`,
      phone: driver.phoneNumber,
      status: this.formatStatus(driver.status)
    };
  }

  static formatVehicleInfo(vehicle) {
    if (!vehicle) return null;
    return {
      id: vehicle._id,
      plateNumber: vehicle.plateNumber,
      type: `${vehicle.make} ${vehicle.model}`
    };
  }

  static formatCurrency(amount, currency = 'SAR') {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  }

  static calculateTripProgress(trip) {
    if (trip.status === 'completed') return 100;
    if (trip.status === 'cancelled') return 0;
    if (!trip.startTime) return 0;
    
    const totalDistance = trip.distance || 0;
    const coveredDistance = trip.currentDistance || 0;
    
    return Math.min(Math.round((coveredDistance / totalDistance) * 100), 100);
  }
}

module.exports = Formatters;