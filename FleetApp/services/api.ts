import axios from 'axios';

// إنشاء instance من axios مع الإعدادات الأساسية
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// إضافة interceptor للتعامل مع الأخطاء
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // يمكن إضافة معالجة الأخطاء العامة هنا
    return Promise.reject(error);
  }
);

export const devicesApi = {
  // الحصول على قائمة الأجهزة
  getDevices: async () => {
    const response = await api.get('/devices');
    return response.data;
  },

  // الحصول على جهاز محدد
  getDeviceById: async (id: string) => {
    const response = await api.get(`/devices/${id}`);
    return response.data;
  },
};

export const ordersApi = {
  // إنشاء طلب جديد
  createOrder: async (orderData: {
    items: Array<{
      id: string;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
    paymentIntentId: string;
  }) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // الحصول على طلب محدد
  getOrderById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // الحصول على قائمة طلبات المستخدم
  getUserOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
};

export const paymentApi = {
  // إنشاء payment intent
  createPaymentIntent: async (amount: number) => {
    const response = await api.post('/payments/create-intent', { amount });
    return response.data;
  },
};