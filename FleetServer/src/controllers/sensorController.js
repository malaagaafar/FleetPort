const Sensor = require('../models/Sensor');
const Vehicle = require('../models/Vehicle');
const NotificationService = require('../services/notificationService');

exports.getAllSensors = async (req, res, next) => {
  try {
    const sensors = await Sensor.find({ company: req.user.company })
      .populate('vehicle');
    res.json(sensors);
  } catch (error) {
    next(error);
  }
};

exports.getSensor = async (req, res, next) => {
  try {
    const sensor = await Sensor.findById(req.params.id)
      .populate('vehicle');
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }
    res.json(sensor);
  } catch (error) {
    next(error);
  }
};

exports.createSensor = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.body.vehicle);
    if (!vehicle) {
      return res.status(400).json({ message: 'Vehicle not found' });
    }

    const sensor = new Sensor({
      ...req.body,
      company: req.user.company
    });

    await sensor.save();

    // إضافة المستشعر إلى المركبة
    vehicle.sensors.push(sensor._id);
    await vehicle.save();

    res.status(201).json(sensor);
  } catch (error) {
    next(error);
  }
};

exports.updateSensorReading = async (req, res, next) => {
  try {
    const { value, unit } = req.body;
    const sensor = await Sensor.findById(req.params.id);

    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }

    sensor.lastReading = {
      value,
      unit,
      timestamp: new Date()
    };

    // التحقق من تجاوز الحدود
    if (value < sensor.thresholds.criticalMin || value > sensor.thresholds.criticalMax) {
      await NotificationService.sendAlert({
        type: 'sensor',
        severity: 'critical',
        vehicle: sensor.vehicle,
        message: `Critical sensor reading: ${value} ${unit}`,
        sensorId: sensor._id
      });
    } else if (value < sensor.thresholds.min || value > sensor.thresholds.max) {
      await NotificationService.sendAlert({
        type: 'sensor',
        severity: 'warning',
        vehicle: sensor.vehicle,
        message: `Warning: Sensor reading out of range: ${value} ${unit}`,
        sensorId: sensor._id
      });
    }

    await sensor.save();
    res.json(sensor);
  } catch (error) {
    next(error);
  }
};

exports.getSensorHistory = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const readings = await SensorReading.find({
      sensor: req.params.id,
      timestamp: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort('timestamp');

    res.json(readings);
  } catch (error) {
    next(error);
  }
};