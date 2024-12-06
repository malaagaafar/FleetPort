const pool = require('../config/database');
const positionService = require('./positionService');

class SimulatorService {
    constructor() {
        this.devices = [
            { id: 9780, name: '7', uniqueId: '123213' },
            { id: 10143, name: '6', uniqueId: '123498' }
        ];
        this.positionIdCounter = null;
        this.centerLat = 43.7;
        this.centerLng = -79.42;
        this.simulationInterval = 60000;
        this.timer = null;
    }

    async initialize() {
        try {
            const result = await pool.query('SELECT COALESCE(MAX(id), 0) as max_id FROM positions');
            this.positionIdCounter = parseInt(result.rows[0].max_id) + 1;
            console.log(`Initialized position counter from database: ${this.positionIdCounter}`);
        } catch (error) {
            console.error('Error initializing position counter:', error);
            throw error;
        }
    }

    generateRandomPosition(deviceId) {
        const latOffset = (Math.random() - 0.5) * 0.02;
        const lngOffset = (Math.random() - 0.5) * 0.02;
        const now = new Date();
        
        const positionId = this.positionIdCounter++;
        
        return {
            id: positionId,
            deviceId: deviceId,
            protocol: 'simulator',
            deviceTime: now,
            fixTime: now,
            serverTime: now,
            outdated: false,
            valid: true,
            latitude: this.centerLat + latOffset,
            longitude: this.centerLng + lngOffset,
            altitude: 0,
            speed: Math.random() * 60,
            course: Math.random() * 360,
            address: null,
            accuracy: 10,
            network: {},
            attributes: {
                batteryLevel: Math.random() * 100,
                fuel: Math.random() * 100
            }
        };
    }

    async start() {
        if (this.positionIdCounter === null) {
            await this.initialize();
        }

        console.log('Starting position simulation...');
        
        this.timer = setInterval(async () => {
            try {
                const positions = [];
                
                for (const device of this.devices) {
                    const position = this.generateRandomPosition(device.id);
                    positions.push(position);
                }

                await positionService.savePositions(positions);
                console.log(`Generated and saved ${positions.length} simulated positions`);
                
            } catch (error) {
                console.error('Error in simulation:', error);
            }
        }, this.simulationInterval);
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            console.log('Simulation stopped');
        }
    }
}

module.exports = new SimulatorService(); 