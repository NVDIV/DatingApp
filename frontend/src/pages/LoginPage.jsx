import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import api from '../api/axiosConfig';
import { Input, Button } from '../components/UIComponents';
import { toast } from 'react-hot-toast'; // Импортируем для успеха
import '../styles/auth.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await api.post('/auth/login', {
                email: email,
                password: password
            });

            await login(response.data); 
            
            // Приятное уведомление при входе
            toast.success("З поверненням у Destiny!"); 
            
            navigate('/feed');
        } catch (error) {
            // Ошибка (401 или 404) автоматически обработается в axiosConfig
            // и покажет тост с текстом "Невірні дані для входу" или подобным.
            console.error("Login error", error);
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