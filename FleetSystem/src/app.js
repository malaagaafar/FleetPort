require('dotenv').config();
const express = require('express');
const testRoutes = require('./routes/testRoutes');
const positionRoutes = require('./routes/positionRoutes');
const websocketService = require('./services/websocketService');
const simulatorService = require('./services/simulatorService');
const deviceStatusSimulator = require('./services/deviceStatusSimulator');

const app = express();

// Middleware
app.use(express.json());

// التأكد من أن المسارات تم استيرادها بشكل صحيح
console.log('Routes loaded:', {
    testRoutes: typeof testRoutes,
    positionRoutes: typeof positionRoutes
});

// Routes
app.use('/api/test', testRoutes);
app.use('/api/positions', positionRoutes);

// بدء اتصال WebSocket
websocketService.connect();

// بدء المحاكاة في بيئة التطوير
if (process.env.NODE_ENV === 'development') {
    // بدء محاكي حالة الأجهزة أولاً
    deviceStatusSimulator.start().then(() => {
        // ثم بدء محاكي المواقع
        simulatorService.start();
        console.log('All simulators started successfully');
    }).catch(error => {
        console.error('Error starting simulators:', error);
    });
}

// إيقاف المحاكاة والخدمات عند إيقاف التطبيق
const gracefulShutdown = async () => {
    console.log('Closing application gracefully...');
    try {
        // إيقاف محاكي المواقع أولاً
        simulatorService.stop();
        // ثم إيقاف محاكي حالة الأجهزة
        deviceStatusSimulator.stop();
        // وأخيراً قطع اتصال WebSocket
        websocketService.disconnect();
        
        console.log('All services stopped successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 