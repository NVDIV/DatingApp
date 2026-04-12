import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Импорт контекста
import api from '../api/axiosConfig';
import { Input, Button } from '../components/UIComponents';
import '../styles/auth.css';

export default function RegisterPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '',
        birthday: '', city: '',
        gender: 'MALE', targetGender: 'ANY'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await api.post('/auth/register', formData);
            
            // Вызываем login из контекста, чтобы приложение "увидело" юзера
            await login(response.data); 
            
            // После регистрации сразу на онбординг
            navigate('/onboarding');
        } catch (error) {
            alert("Помилка реєстрації: " + (error.response?.data?.message || "Перевірте дані"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ width: '400px' }}>
                <h2>Реєстрація</h2>
                <form onSubmit={handleRegister} className="auth-form">
                    <Input name="name" placeholder="Ім'я" onChange={handleChange} required />
                    <Input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                    <Input name="password" type="password" placeholder="Пароль" onChange={handleChange} required />
                    <Input name="city" placeholder="Місто" onChange={handleChange} required />
                    
                    <label className="field-label">Дата народження</label>
                    <Input name="birthday" type="date" onChange={handleChange} required />

                    <div className="select-group">
                        <div>
                            <label className="field-label">Ваша стать</label>
                            <select name="gender" onChange={handleChange} className="custom-select">
                                <option value="MALE">Чоловік</option>
                                <option value="FEMALE">Жінка</option>
                            </select>
                        </div>
                        <div>
                            <label className="field-label">Кого шукаєте</label>
                            <select name="targetGender" onChange={handleChange} className="custom-select">
                                <option value="ANY">Усіх</option>
                                <option value="MALE">Чоловіків</option>
                                <option value="FEMALE">Жінок</option>
                            </select>
                        </div>
                    </div>

                    <Button type="submit" disabled={isSubmitting} style={{ marginTop: '20px' }}>
                        {isSubmitting ? "Створення..." : "Створити долю"}
                    </Button>
                </form>
                <div className="auth-footer">
                    Вже зареєстровані? <Link to="/login" className="auth-link">Увійти</Link>
                </div>
            </div>
        </div>
    );
}