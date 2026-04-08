import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import FeedPage from './pages/FeedPage';
import MatchesPage from './pages/MatchesPage'; // Імпортуємо нову сторінку
import './styles/global.css';

function App() {
  const isAuthenticated = () => !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Чистий онбординг БЕЗ меню */}
        <Route 
          path="/onboarding" 
          element={isAuthenticated() ? <OnboardingPage showMenu={false} /> : <Navigate to="/login" />} 
        />

        {/* Сторінки З меню */}
        <Route 
          path="/feed" 
          element={isAuthenticated() ? <><Navbar /><FeedPage /></> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/matches" 
          element={isAuthenticated() ? <><Navbar /><MatchesPage /></> : <Navigate to="/login" />} 
        />

        <Route 
          path="/profile" 
          element={isAuthenticated() ? <><Navbar /><OnboardingPage showMenu={true} /></> : <Navigate to="/login" />} 
        />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;