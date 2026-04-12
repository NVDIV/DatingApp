import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Тут буде наш UserProfileDTO з UUID!
    const [loading, setLoading] = useState(true);

    const fetchMe = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await api.get('/users/me');
            setUser(response.data); // Зберігаємо весь об'єкт, включаючи ID
        } catch (err) {
            console.error("Не вдалося завантажити профіль", err);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMe();
    }, []);

    const login = async (authData) => {
        // authData приходить з AuthService.java (token, userId, name...)
        localStorage.setItem('token', authData.token);
        // Ми могли б одразу setUser(authData), але краще зробити fetchMe, 
        // щоб отримати повний профіль з арканами та фото
        await fetchMe();
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
            {!loading && children} 
            {/* Важливо: не рендеримо додаток, поки не дізнаємось, хто користувач */}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);