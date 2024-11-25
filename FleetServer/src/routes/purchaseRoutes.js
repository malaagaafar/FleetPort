const express = require('express');
const router = express.Router();
const { handlePurchase } = require('../controllers/purchaseController'); // تأكد من استيراد الدالة بشكل صحيح

// مسار لتسجيل عملية شراء
router.post('/', handlePurchase); // استخدم الدالة المستوردة

module.exports = router; // تأكد من تصدير router