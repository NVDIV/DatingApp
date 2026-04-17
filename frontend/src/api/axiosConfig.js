import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 401) {
            toast.error("Сесія завершена. Будь ласка, увійдіть знову.");
            localStorage.removeItem('token');
            window.location.href = '/login';
        } else if (status === 400) {
            toast.error(message || "Некоректні дані");
        } else if (status === 404) {
            toast.error("Ресурс не знайдено");
        } else if (status === 409) {
            toast.error("Користувач вже існує");
        } else {
            toast.error("Щось пішло не так. Спробуйте пізніше.");
        }

        return Promise.reject(error);
    }
);

export default api;