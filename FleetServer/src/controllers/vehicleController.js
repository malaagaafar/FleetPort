const Vehicle = require('../models/Vehicle');

// دالة لإنشاء مركبة جديدة
exports.createVehicle = async (req, res) => {
  try {
    const vehicleData = req.body; // استلام البيانات من الطلب
    const newVehicle = await Vehicle.create(vehicleData); // إنشاء مركبة جديدة
    res.status(201).json(newVehicle); // إرجاع المركبة الجديدة مع حالة 201
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'حدث خطأ أثناء إنشاء المركبة' }); // إرجاع رسالة خطأ
  }
};
// ... existing code ...
exports.getAllVehicles = async (req, res) => {
  const userId = req.query.userId; // الحصول على userId من استعلام الطلب

  try {
    const vehicles = await Vehicle.findAll({
      where: {
        userId: userId // تصفية المركبات بناءً على userId
      }
    });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ... existing code ...