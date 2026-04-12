import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("Ви впевнені, що хочете покинути свою долю?")) {
            logout();
            navigate('/login');
        }
    };

    return (
        <nav className="bottom-nav">
            <NavLink to="/feed" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <span className="nav-icon">🎴</span>
                <span>Стрічка</span>
            </NavLink>
            
            <NavLink to="/matches" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <span className="nav-icon">💖</span>
                <span>Метчі</span>
            </NavLink>
            
            <NavLink to="/onboarding" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <span className="nav-icon">👤</span>
                <span>Профіль</span>
            </NavLink>

            <button onClick={handleLogout} className="logout-btn">Вихід</button>
        </nav>
    );
}