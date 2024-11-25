import axios from 'axios';

// تأكد من تغيير هذا الرابط إلى الرابط الصحيح لل API الخاص بك
export const API_BASE_URL = 'https://hookworm-primary-nicely.ngrok-free.app/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;