require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');
const User = require('./models/User'); // تأكد من استيراد النموذج
const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const webhookRoutes = require('./routes/webhook.routes');
const purchaseRoutes = require('./routes/purchaseRoutes');




const app = express();

app.use(cors());
app.use(express.json());

// المسارات
app.use('/api/auth', authRoutes);
//app.use('/api/catalog', deviceCatalogRoutes);
//app.use('/webhook', webhookRoutes);
app.use('/api/devices', require('./routes/deviceRoutes'));
app.use('/api/purchase', require('./routes/purchaseRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));
// ... existing code ...
app.use('/api/purchase', purchaseRoutes);
// ... existing code ...


// Error handling middleware
app.use((err, req, res, next) => {
    console.error('خطأ عام:', err);
    res.status(500).json({
        success: false,
        message: 'حدث خطأ في السيرفر',
        error: err.message
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'الصفحة غير موجودة'
    });
});

// اختبار الاتصال بقاعدة البيانات وتشغيل الخادم
sequelize.authenticate()
    .then(() => {
        console.log('تم الاتصال بقاعدة البيانات بنجاح');
        
        // مزامنة النماذج مع قاعدة البيانات
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`الخادم يعمل على المنفذ ${PORT}`);
        });
    })
    .catch(err => {
        console.error('خطأ في الاتصال بقاعدة البيانات:', err);
    });

module.exports = { app, sequelize };