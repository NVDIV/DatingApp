import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext'; // Не забудь про сокеты здесь или в main.jsx
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Добавили
import FeedPage from './pages/FeedPage';
import ChatPage from './pages/ChatPage';
import MatchesPage from './pages/MatchesPage'; // Добавили (список метчей)
import OnboardingPage from './pages/OnboardingPage';

function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <Toaster position="top-right" reverseOrder={false} />
                <BrowserRouter>
                    <Routes>
                        {/* Публічні маршрути */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        
                        {/* Захищені маршрути */}
                        <Route path="/feed" element={
                            <ProtectedRoute><FeedPage /></ProtectedRoute>
                        } />
                        
                        {/* Список взаємних симпатій */}
                        <Route path="/matches" element={
                            <ProtectedRoute><MatchesPage /></ProtectedRoute>
                        } />

                        {/* Конкретний чат */}
                        <Route path="/chat/:matchId" element={
                            <ProtectedRoute><ChatPage /></ProtectedRoute>
                        } />

                        {/* Редагування профілю / Онбординг */}
                        <Route path="/onboarding" element={
                            <ProtectedRoute><OnboardingPage /></ProtectedRoute>
                        } />

                        {/* Автоматичний редирект: якщо залогінений — у стрічку, якщо ні — ProtectedRoute відправить на login */}
                        <Route path="/" element={<Navigate to="/feed" />} />
                        
                        {/* Обробка неіснуючих сторінок */}
                        <Route path="*" element={<Navigate to="/feed" />} />
                    </Routes>
                </BrowserRouter>
            </SocketProvider>
        </AuthProvider>
    );
}

export default App;