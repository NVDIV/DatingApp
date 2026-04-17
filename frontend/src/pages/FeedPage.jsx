import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import Navbar from '../components/Navbar';
import { toast } from 'react-hot-toast';
import '../styles/feed.css';

export default function FeedPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSwiping, setIsSwiping] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeed();
    }, []);

    const fetchFeed = async (isAppend = false) => {
        try {
            // Если мы просто догружаем, не показываем глобальный лоадер
            if (!isAppend) setLoading(true);
            
            const response = await api.get('/feed');
            const newUsers = response.data;

            if (isAppend) {
                // Добавляем только тех, кого еще нет в списке
                setUsers(prev => {
                    const existingIds = new Set(prev.map(u => u.id));
                    const uniqueNew = newUsers.filter(u => !existingIds.has(u.id));
                    return [...prev, ...uniqueNew];
                });
            } else {
                setUsers(newUsers);
            }
        } catch (err) {
            console.error("Помилка завантаження стрічки", err);
            toast.error("Не вдалося оновити зірки");
        } finally {
            setLoading(false);
        }
    };

    const handleSwipe = async (targetUserId, type) => {
        if (isSwiping) return;
        
        setIsSwiping(true);
        try {
            const response = await api.post('/swipes', {
                targetUserId: targetUserId,
                swipeType: type
            });

            if (type === 'LIKE' && response.data.isMatch) {
                toast('Це доля! У вас новий мэтч!', {
                    icon: '💖',
                    duration: 4000,
                    style: { borderRadius: '10px', background: '#333', color: '#fff' },
                });
            }

            // Удаляем текущего юзера
            const updatedUsers = users.filter(u => u.id !== targetUserId);
            setUsers(updatedUsers);

            // АВТО-ПОДГРУЗКА: если осталось мало людей (например, 2), грузим еще
            if (updatedUsers.length <= 2) {
                fetchFeed(true);
            }
            
        } catch (err) {
            console.error(`Не вдалося виконати ${type}:`, err);
        } finally {
            setIsSwiping(false);
        }
    };

    if (loading) return (
        <div className="loading-screen">
            <div className="loader"></div>
            <p>Зірки готують анкети...</p>
        </div>
    );

    return (
        <div className="page-with-nav">
            <div className="feed-container">
                <div className="card-stack">
                    {users.length > 0 ? (
                        // Рендерим только ПЕРВУЮ карточку из массива
                        users.slice(0, 1).map(u => (
                            <div key={u.id} className="tinder-card active">
                                <div className="card-image-wrapper">
                                    <img 
                                        src={u.mainPhotoUrl && u.mainPhotoUrl !== 'default-avatar.png' ? u.mainPhotoUrl : '/default_pfp.png'} 
                                        className="card-main-photo" 
                                        alt={u.name} 
                                        onError={(e) => { e.target.src = '/default_pfp.png'; }}
                                    />
                                    <div className="compatibility-badge">
                                        <span className="percent">{u.compatibilityPercent}%</span>
                                        <span className="label">доля</span>
                                    </div>
                                </div>

                                <div className="card-info">
                                    <div className="info-header">
                                        <h2>{u.name}, {u.age}</h2>
                                        <div className="arcana-tag">Аркан {u.mainArcana}</div>
                                    </div>
                                    
                                    <div className="compatibility-info">
                                        <h4>Спільний Аркан: <span>{u.pairArcanaName}</span></h4>
                                        <p>{u.pairDescription}</p>
                                    </div>

                                    <div className="card-actions">
                                        <button 
                                            disabled={isSwiping}
                                            className="action-btn skip" 
                                            onClick={() => handleSwipe(u.id, 'DISLIKE')}
                                        >✕</button>
                                        
                                        <button 
                                            disabled={isSwiping}
                                            className="action-btn like" 
                                            onClick={() => handleSwipe(u.id, 'LIKE')}
                                        >✨</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-feed">
                            <div className="empty-icon">🌟</div>
                            <h3>Це все на сьогодні!</h3>
                            <p>Аркани кажуть, що нові люди з'являться згодом.</p>
                            <button 
                                className="refresh-btn" 
                                onClick={() => fetchFeed()}
                                style={{
                                    marginTop: '20px',
                                    padding: '10px 20px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: 'var(--primary-color, #ff4b2b)',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Оновити зірки
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Navbar />
        </div>
    );
}