import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api' // Твій URL бекенду
});

// Додаємо інтерцептор для токена
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Додаємо інтерцептор для обробки 401 (якщо токен "протух")
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;