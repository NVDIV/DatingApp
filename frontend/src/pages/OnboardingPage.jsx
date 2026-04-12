import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import api from '../api/axiosConfig';
import { Button } from '../components/UIComponents';
import '../styles/profile.css';

export default function OnboardingPage({ showMenu }) {
    const { user, setUser } = useAuth(); 
    const [bio, setBio] = useState(user?.bio || '');
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.bio) setBio(user.bio);
    }, [user]);

    // --- Логіка роботи з фото ---
    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        setUploading(true);
        try {
            await api.post('/photos/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            refreshUserData();
        } catch (err) {
            alert("Помилка завантаження");
        } finally {
            setUploading(false);
        }
    };

    const deletePhoto = async (photoId) => {
        if (!window.confirm("Видалити це фото?")) return;
        try {
            await api.delete(`/photos/${photoId}`);
            refreshUserData();
        } catch (err) {
            alert("Не вдалося видалити фото");
        }
    };

    const setMainPhoto = async (photoId) => {
        try {
            await api.post(`/photos/${photoId}/set-main`);
            refreshUserData();
        } catch (err) {
            alert("Не вдалося змінити головне фото");
        }
    };

    const refreshUserData = async () => {
        const res = await api.get('/users/me');
        setUser(res.data);
    };

    const saveBio = async () => {
        try {
            const response = await api.patch('/users/me', { bio });
            setUser(response.data); 
            alert("Біо збережено!");
        } catch (err) {
            alert("Помилка при збереженні");
        }
    };

    if (!user) return <div className="loading-screen">Завантаження вашої долі...</div>;

    return (
            <div className="profile-container">
                <h1 className="page-title">Ваш Профіль</h1>
                <div className="profile-card">
                    
                    {/* Блок Immutable даних */}
                    <div className="personal-info-block">
                        <h3 className="section-subtitle">Особисті дані</h3>
                        <div className="info-grid">
                            <div className="info-item"><span>Ім'я:</span> <strong>{user.name}</strong></div>
                            <div className="info-item"><span>Дата народження:</span> <strong>{user.birthday}</strong></div>
                            <div className="info-item"><span>Місто:</span> <strong>{user.city}</strong></div>
                            <div className="info-item"><span>Email:</span> <strong>{user.email}</strong></div>
                        </div>
                    </div>

                    <div className="profile-divider"></div>

                    {/* Аркан блок */}
                    <div className="arcana-info">
                        <div className="arcana-badge">№ {user.mainArcana}</div>
                        <div className="arcana-img-container">
                            <img 
                                src={`/arcana/${user.mainArcana}.png`} 
                                alt={user.arcanaName} 
                                className="arcana-main-img"
                                onError={(e) => { e.target.src = '/arcana/default.png'; }}
                            />
                        </div>
                        <h2 className="arcana-name">{user.arcanaName}</h2>
                        <p className="arcana-description">{user.arcanaDescription}</p>
                    </div>

                    <div className="profile-divider"></div>

                    {/* Галерея з керуванням */}
                    <div className="photo-section">
                        <h4 className="section-subtitle">Галерея</h4>
                        <div className="photo-grid">
                            {user.photos?.map(photo => (
                                <div key={photo.id} className={`photo-item ${photo.isMain ? 'main' : ''}`}>
                                    <img src={photo.url} alt="User" />
                                    <div className="photo-controls">
                                        {!photo.isMain && (
                                            <>
                                                <button className="photo-btn set-main" onClick={() => setMainPhoto(photo.id)} title="Зробити головним">⭐</button>
                                                <button className="photo-btn delete" onClick={() => deletePhoto(photo.id)} title="Видалити">🗑️</button>
                                            </>
                                        )}
                                        {photo.isMain && <span className="main-label">Головне</span>}
                                    </div>
                                </div>
                            ))}
                            <label className="upload-btn">
                                {uploading ? "..." : "+"}
                                <input type="file" hidden onChange={handlePhotoUpload} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <div className="bio-section">
                        <label className="field-label">Твій шлях (Біо)</label>
                        <textarea 
                            className="profile-textarea"
                            value={bio} 
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Розкажи світу про себе..."
                        />
                        <Button onClick={saveBio} style={{ width: '100%' }}>Зберегти зміни</Button>
                        
                        {!showMenu && (
                            <Button 
                                onClick={() => navigate('/feed')} 
                                style={{ width: '100%', marginTop: '15px', backgroundColor: '#4CAF50' }}
                            >
                                Увійти в стрічку
                            </Button>
                        )}
                    </div>
                </div>
        </div>
    );
}