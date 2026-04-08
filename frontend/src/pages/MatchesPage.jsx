import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import '../styles/matches.css';

export default function MatchesPage() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                // Припускаємо, що ендпоінт повертає список користувачів-метчів
                const res = await api.get('/matches'); 
                setMatches(res.data);
            } catch (err) {
                console.error("Не вдалося завантажити метчі", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    if (loading) return <div className="loading-screen">Шукаємо ваші зв'язки...</div>;

    return (
        <div className="matches-container">
            <h2 className="matches-title">Ваші магічні метчі</h2>
            {matches.length === 0 ? (
                <div className="no-matches">
                    <p>Поки що зірки не зійшлися. Продовжуйте шукати в ленті!</p>
                </div>
            ) : (
                <div className="matches-grid">
                    {matches.map(match => (
                        <div key={match.id} className="match-card">
                            <div className="match-img-wrapper">
                                <img 
                                    src={match.photos?.[0]?.url || '/assets/arcana/default.png'} 
                                    alt={match.name} 
                                />
                            </div>
                            <div className="match-info">
                                <h3>{match.name}, {match.age}</h3>
                                <p className="match-arcana">Аркан: {match.arcanaName || match.mainArcana}</p>
                                <button className="chat-btn">Написати</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}