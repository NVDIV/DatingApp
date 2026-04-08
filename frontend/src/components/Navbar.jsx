import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="main-navbar">
            <div className="nav-logo">Destiny</div>
            <div className="nav-links">
                <Link to="/feed" className="nav-item">Лента</Link>
                <Link to="/matches" className="nav-item">Метчі</Link>
                <Link to="/profile" className="nav-item">Профіль</Link>
            </div>
            <button onClick={handleLogout} className="logout-btn-nav">Вихід</button>
        </nav>
    )
}