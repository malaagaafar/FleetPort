const purchaseService = require('../services/purchaseService');
// دالة لمعالجة عملية الشراء
const handlePurchase = async (req, res) => {
    const { id, items, total, date, userId } = req.body; // استلام البيانات الجديدة

    try {
        await purchaseService.recordPurchase({ id, items, total, date, userId }); // تمرير البيانات إلى الخدمة
        await purchaseService.processPurchasesByUser(userId); // استدعاء الدالة لمعالجة العمليات

        res.status(201).json({ message: 'تم تسجيل عملية الشراء بنجاح.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { handlePurchase }; // تأكد من تصدير كائن يحتوي على الدالة