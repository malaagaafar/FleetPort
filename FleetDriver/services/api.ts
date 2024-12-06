// services/api.ts
import axios from 'axios';

export const API_URL = 'https://hookworm-primary-nicely.ngrok-free.app/api';

// إنشاء نسخة axios مع الإعدادات الافتراضية
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 3000000
});

// تصدير كائن API مع الدوال المطلوبة
export const api = {
  driver: {
    login: async (username: string, password: string) => {
      try {
        const response = await axiosInstance.post('/drivers/login', {
          username,
          password
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    getVehicles: async (driverId: number) => {
      try {
        const response = await axiosInstance.get(`/drivers/home?driverId=${driverId}`);
        
        // تحويل الكائن الواحد إلى مصفوفة إذا لزم الأمر
        const vehicles = response.data.assignedVehicles
          ? (Array.isArray(response.data.assignedVehicles)
              ? response.data.assignedVehicles
              : [response.data.assignedVehicles])
          : [];

        return vehicles.map((vehicle: any) => ({
          id: vehicle.id,
          image: vehicle.vehicle_image,
          plateNumber: vehicle.plate_number,
          make: vehicle.make,
          model: vehicle.model,
          order: vehicle.is_primary 
            ? "Primary Driver"
            : vehicle.assignment_order === 1
              ? "First Backup"
              : vehicle.assignment_order === 2
                ? "Second Backup"
                : "Third Backup",
          isActive: vehicle.assignment_status === 'active',
          canLogin: !response.data.driver.currentVehicleId && vehicle.assignment_status === 'active',
          canLogout: response.data.driver.currentVehicleId === vehicle.id
        }));
      } catch (error) {
        console.error('API Error:', error);
        throw error.response?.data || error.message;
      }
    },

    vehicleLogin: async (driverId: string, vehicleId: string, location?: { latitude: number; longitude: number }) => {
      try {
        const response = await axiosInstance.post('/drivers/vehicle/login', {
          driverId,
          vehicleId,
          location
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    vehicleLogout: async (driverId: string, vehicleId: string, location?: { latitude: number; longitude: number }) => {
      try {
        const response = await axiosInstance.post('/drivers/vehicle/logout', {
          driverId,
          vehicleId,
          location
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  }
};