const WebSocket = require('ws');
const deviceService = require('./deviceService');
const positionService = require('./positionService');
const traccarService = require('./traccarService');

class WebSocketService {
    constructor() {
        this.ws = null;
        this.isConnected = false;
        this.reconnectTimeout = 5000;
        if (!process.env.TRACCAR_WS_URL) {
            throw new Error('TRACCAR_WS_URL is not defined');
        }
        this.url = `${process.env.TRACCAR_WS_URL}/api/socket`;
        console.log('WebSocket URL:', this.url);
    }

    async connect() {
        try {
            console.log('Creating Traccar session...');
            const cookies = await traccarService.createSession();
            
            console.log('Attempting to connect to Traccar WebSocket...');
            this.ws = new WebSocket(this.url, {
                headers: {
                    'Cookie': cookies.join('; ')
                }
            });

            this.ws.on('open', () => {
                console.log('Connected to Traccar WebSocket');
                this.isConnected = true;
                this.requestInitialData();
            });

            this.ws.on('message', async (data) => {
                try {
                    console.log('Received WebSocket message:', data.toString());
                    const message = JSON.parse(data);
                    await this.handleMessage(message);
                } catch (error) {
                    console.error('Error handling WebSocket message:', error);
                }
            });

            this.ws.on('close', (code, reason) => {
                console.log('Disconnected from Traccar WebSocket', { code, reason });
                this.isConnected = false;
                this.scheduleReconnect();
            });

            this.ws.on('error', (error) => {
                console.error('WebSocket error:', error.message);
                this.scheduleReconnect();
            });
        } catch (error) {
            console.error('Error connecting to WebSocket:', error);
            this.scheduleReconnect();
        }
    }

    async handleMessage(message) {
        console.log('Received message:', JSON.stringify(message, null, 2));
        
        // التحقق من وجود المواقع
        if (message.positions) {
            console.log(`Processing ${message.positions.length} positions`);
            await positionService.savePositions(message.positions);
        }
        
        // التحقق من وجود الأجهزة
        if (message.devices) {
            console.log(`Processing ${message.devices.length} devices`);
            for (const device of message.devices) {
                await deviceService.upsertDevice(device);
            }
        }
        
        // التحقق من وجود الأحداث
        if (message.events) {
            console.log(`Received ${message.events.length} events`);
            // يمكن إضافة معالجة الأحداث لاحقاً
        }
    }

    scheduleReconnect() {
        if (!this.isConnected) {
            console.log(`Scheduling reconnect in ${this.reconnectTimeout}ms`);
            setTimeout(() => this.connect(), this.reconnectTimeout);
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }

    async requestInitialData() {
        try {
            console.log('Requesting initial data...');
            
            // طلب الأجهزة
            const devices = await traccarService.getDevices();
            console.log(`Fetched ${devices.length} devices`);
            for (const device of devices) {
                await deviceService.upsertDevice(device);
            }

            // طلب المواقع
            const positions = await traccarService.getPositions();
            console.log(`Fetched ${positions.length} positions`);
            await positionService.savePositions(positions);

            console.log('Initial data loaded successfully');
        } catch (error) {
            console.error('Error requesting initial data:', error);
        }
    }
}

module.exports = new WebSocketService(); 