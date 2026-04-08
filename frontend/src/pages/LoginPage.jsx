import { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button } from '../components/UIComponents';
import '../styles/auth.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', {
                email: email,
                password: password
            });

            localStorage.setItem('token', response.data.token);
            // alert замінимо на логіку переходу для кращого UX
            navigate('/feed');
        } catch (error) {
            alert("Помилка входу: " + (error.response?.data || "Невірні дані"));
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Вхід у Destiny</h2>
                <p className="auth-subtitle">Твої аркани чекають на тебе</p>
                
                <form onSubmit={handleLogin} className="auth-form">
                    <Input
                        type="email"
                        placeholder="Електронна пошта"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit">Увійти</Button>
                </form>

                <div className="auth-footer">
                    <span>Ще не маєте акаунту? </span>
                    <Link to="/register" className="auth-link">Зареєструватися</Link>
                </div>
            </div>
        </div>
    );
}