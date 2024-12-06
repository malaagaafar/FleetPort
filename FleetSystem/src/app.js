require('dotenv').config();
const express = require('express');
const testRoutes = require('./routes/testRoutes');
const websocketService = require('./services/websocketService');
const simulatorService = require('./services/simulatorService');
const locationRoutes = require('./routes/locationRoutes');

const app = express();

app.use(express.json());
app.use('/api/test', testRoutes);
app.use('/api/locations', locationRoutes);

// بدء اتصال WebSocket
websocketService.connect();

// بدء المحاكاة
simulatorService.start();

// إيقاف المحاكاة عند إيقاف التطبيق
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing application');
    websocketService.disconnect();
    simulatorService.stop();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing application');
    websocketService.disconnect();
    simulatorService.stop();
    process.exit(0);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 