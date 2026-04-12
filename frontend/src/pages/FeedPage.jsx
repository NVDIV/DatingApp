import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import Navbar from '../components/Navbar';
import '../styles/feed.css';

export default function FeedPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/feed')
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Помилка завантаження стрічки", err);
                setLoading(false);
            });
    }, []);

    // Універсальна функція для свайпів
    const handleSwipe = async (targetUserId, type) => {
        try {
            // Відправляємо запит на бекенд (тепер і для LIKE, і для DISLIKE)
            await api.post('/swipes', {
                targetUserId: targetUserId,
                swipeType: type // 'LIKE' або 'DISLIKE'
            });

            // Після успішної відповіді видаляємо верхню картку
            setUsers(prev => prev.filter(u => u.id !== targetUserId));
            
        } catch (err) {
            console.error(`Не вдалося виконати ${type}:`, err);
            // Можна додати сповіщення користувачу, якщо запит не пройшов
        }
    };

    if (loading) return <div className="loading">Завантаження анкет...</div>;

    return (
        <div className="page-with-nav">
            <div className="feed-container">
                <div className="card-stack">
                    {users.length > 0 ? (
                        // Беремо тільки першого юзера з масиву
                        users.slice(0, 1).map(u => (
                            <div key={u.id} className="tinder-card">
                                <div className="card-image-wrapper">
                                    <img 
                                        src={u.mainPhotoUrl || 'default_pfp.png'} 
                                        className="card-main-photo" 
                                        alt={u.name} 
                                    />
                                    <div className="compatibility-badge">
                                        <span className="percent">{u.compatibilityPercent}%</span>
                                        <span className="label">сумісність</span>
                                    </div>
                                </div>

                                <div className="card-info">
                                    <div className="info-header">
                                        <h2>{u.name}, {u.age}</h2>
                                        <div className="arcana-tag">Аркан {u.mainArcana}</div>
                                    </div>
                                    
                                    <div className="compatibility-info">
                                        <h4>Ваш спільний Аркан: <span>{u.pairArcanaName}</span></h4>
                                        <p>{u.pairDescription}</p>
                                    </div>

                                    <div className="card-actions">
                                        {/* Викликаємо handleSwipe з типом DISLIKE */}
                                        <button 
                                            className="action-btn skip" 
                                            onClick={() => handleSwipe(u.id, 'DISLIKE')}
                                        >
                                            ✕
                                        </button>
                                        
                                        {/* Викликаємо handleSwipe з типом LIKE */}
                                        <button 
                                            className="action-btn like" 
                                            onClick={() => handleSwipe(u.id, 'LIKE')}
                                        >
                                            ✨
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-feed">
                            <h3>Аркани кажуть, що поки нікого немає...</h3>
                            <p>Спробуйте зайти пізніше або змінити налаштування пошуку</p>
                        </div>
                    )}
                </div>
            </div>
            <Navbar />
        </div>
    );
}