import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import Navbar from '../components/Navbar';
import { toast } from 'react-hot-toast';
import '../styles/matches.css';

export default function MatchesPage() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

useEffect(() => {
        const fetchMatches = async () => {
            try {
                const res = await api.get('/matches');
                setMatches(res.data);
            } catch (err) {
                console.error("Помилка при завантаженні метчів", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    if (loading) return (
        <div className="loading-screen">
            <div className="loader"></div>
            <p>Зчитуємо вібрації зірок...</p>
        </div>
    );

    return (
        <div className="page-with-nav">
            <div className="matches-container">
                <h2 className="matches-title">Ваші магічні метчі</h2>
                {matches.length === 0 ? (
                    <p>Поки що зірки не зійшлися.</p>
                ) : (
                    <div className="matches-grid">
                        {matches.map(match => (
                            <div key={match.matchId} className="match-card"> 
                                <div className="match-info">
                                    <h3>{match.name}</h3>
                                    <button onClick={() => navigate(`/chat/${match.matchId}`)}>
                                        Написати
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Navbar />
        </div>
    );
}