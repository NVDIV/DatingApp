import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Импортируем наш хук
import api from '../api/axiosConfig';
import { Input, Button } from '../components/UIComponents';
import '../styles/auth.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth(); // Достаем функцию login из контекста

    const handleLogin = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await api.post('/auth/login', {
                email: email,
                password: password
            });

            // ВАЖНО: Вызываем login из контекста. 
            // Она сама сохранит токен и запустит fetchMe()
            await login(response.data); 

            // Переход на ленту теперь будет успешным, 
            // так как AuthContext уже будет знать пользователя
            navigate('/feed');
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Невірні дані для входу";
            alert("Помилка: " + errorMsg);
        } finally {
            setIsSubmitting(false);
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
                        disabled={isSubmitting}
                    />
                    <Input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Входимо..." : "Увійти"}
                    </Button>
                </form>

                <div className="auth-footer">
                    <span>Ще не маєте акаунту? </span>
                    <Link to="/register" className="auth-link">Зареєструватися</Link>
                </div>
            </div>
        </div>
    );
}