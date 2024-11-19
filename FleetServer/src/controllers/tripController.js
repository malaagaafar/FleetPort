const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const NotificationService = require('../services/notificationService');

exports.getAllTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ company: req.user.company })
      .populate('vehicle')
      .populate('driver')
      .sort('-startTime');
    res.json(trips);
  } catch (error) {
    next(error);
  }
};

exports.getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('vehicle')
      .populate('driver');
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(trip);
  } catch (error) {
    next(error);
  }
};

exports.createTrip = async (req, res, next) => {
  try {
    // التحقق من توفر السائق والمركبة
    const [vehicle, driver] = await Promise.all([
      Vehicle.findById(req.body.vehicle),
      Driver.findById(req.body.driver)
    ]);

    if (!vehicle || !driver) {
      return res.status(400).json({ 
        message: 'Vehicle or driver not found' 
      });
    }

    const trip = new Trip({
      ...req.body,
      company: req.user.company
    });

    await trip.save();

    // تحديث حالة المركبة والسائق
    vehicle.currentDriver = driver._id;
    driver.currentVehicle = vehicle._id;
    await Promise.all([vehicle.save(), driver.save()]);

    // إرسال إشعار
    await NotificationService.sendTripNotification(trip, 'created');

    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
};

exports.updateTripStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    trip.status = status;
    if (status === 'completed') {
      trip.endTime = new Date();
      // تحرير المركبة والسائق
      await Promise.all([
        Vehicle.findByIdAndUpdate(trip.vehicle, { currentDriver: null }),
        Driver.findByIdAndUpdate(trip.driver, { currentVehicle: null })
      ]);
    }

    await trip.save();
    await NotificationService.sendTripNotification(trip, status);

    res.json(trip);
  } catch (error) {
    next(error);
  }
};

exports.getTripAnalytics = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // حساب الإحصائيات
    const analytics = {
      totalDistance: trip.distance,
      duration: trip.duration,
      fuelConsumption: trip.fuelConsumption,
      averageSpeed: trip.distance / (trip.duration / 3600), // km/h
      efficiency: trip.distance / trip.fuelConsumption // km/l
    };

    res.json(analytics);
  } catch (error) {
    next(error);
  }
};