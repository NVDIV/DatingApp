import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Button } from '../components/UIComponents';
import '../styles/profile.css';
import { useNavigate } from 'react-router-dom';

export default function OnboardingPage({ showMenu }) {
    const [profile, setProfile] = useState(null);
    const [bio, setBio] = useState('');
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/me');
            setProfile(res.data);
            setBio(res.data.bio || '');
        } catch (err) {
            console.error("Помилка завантаження профілю:", err);
        }
    };

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
            fetchProfile(); 
        } catch (err) {
            alert("Помилка завантаження фото");
        } finally {
            setUploading(false);
        }
    };

    const saveBio = async () => {
        try {
            await api.patch('/users/me', { bio });
            alert("Профіль оновлено!");
        } catch (err) {
            alert("Не вдалося зберегти біо");
        }
    };

    const handleStartJourney = () => {
        navigate('/feed'); // Перехід на ленту після заповнення
    };

    if (!profile) return <div className="loading-screen">Завантаження вашої долі...</div>;

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="arcana-info">
                    <p className="arcana-header">Твій аркан:</p>
                    <div className="arcana-badge">№ {profile.mainArcana}</div>
                    
                    <div className="arcana-img-container">
                        <img 
                            // Якщо папка assets у public, шлях має бути таким:
                            src={`/assets/arcana/${profile.mainArcana}.png`} 
                            alt={profile.arcanaName} 
                            className="arcana-main-img"
                            onError={(e) => {
                                // Шлях до дефолтної картинки
                                e.target.onerror = null; 
                                e.target.src = '/assets/arcana/default.png';
                            }}
                        />
                    </div>
                    
                    <h2 className="arcana-name">{profile.arcanaName}</h2>
                    <p className="arcana-description">{profile.arcanaDescription}</p>
                </div>

                <div className="profile-divider"></div>

                <div className="photo-section">
                    <h4 className="section-subtitle">Твої фото</h4>
                    <div className="photo-grid">
                        {profile.photos?.map(photo => (
                            <div key={photo.id} className={`photo-item ${photo.isMain ? 'main' : ''}`}>
                                <img src={photo.url} alt="User" />
                            </div>
                        ))}
                        <label className="upload-btn">
                            {uploading ? "..." : "+"}
                            <input type="file" hidden onChange={handlePhotoUpload} accept="image/*" />
                        </label>
                    </div>
                </div>

                {/* ... (попередній код фотографій) ... */}

                <div className="bio-section">
                    <label className="field-label">Розкажи про себе</label>
                    <textarea 
                        className="profile-textarea"
                        value={bio} 
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Твій дух, твої прагнення..."
                    />
                    <Button onClick={saveBio} style={{ width: '100%' }}>Зберегти зміни</Button>
                    
                    {/* Кнопка переходу на ленту ТІЛЬКИ під час реєстрації (коли меню приховане) */}
                    {!showMenu && (
                        <Button 
                            onClick={handleStartJourney} 
                            style={{ 
                                width: '100%', 
                                marginTop: '15px', 
                                backgroundColor: '#4CAF50',
                                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)' 
                            }}
                        >
                            Відкрити свою долю (В ленту)
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}