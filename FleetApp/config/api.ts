import axios from 'axios';

// تأكد من تغيير هذا الرابط إلى الرابط الصحيح لل API الخاص بك
export const API_BASE_URL = 'https://hookworm-primary-nicely.ngrok-free.app/api';


const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 3000000
});

// اعتراض الطلبات للتعامل مع الأخطاء
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        
        // إعادة تنسيق رسالة الخطأ
        const errorMessage = error.response?.data?.message 
            || error.message 
            || 'حدث خطأ في الاتصال بالخادم';
            
        return Promise.reject({
            message: errorMessage
        });
    }
);

export default api;