import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

export default function FeedPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };



    useEffect(() => {
        api.get('/feed')
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Ошибка загрузки ленты", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Загрузка анкет...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Твои Арканы дня</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                {users.map(user => (
                    <div key={user.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '10px' }}>
                        <h3>{user.name}, {user.age}</h3>
                        <p>Город: {user.city}</p>
                        <p><b>Аркан: {user.mainArcana}</b></p>
                        <button>Лайк</button>
                    </div>
                ))}
            </div>
            <button onClick={handleLogout} style={{float: 'right', backgroundColor: '#f44336', color: 'white'}}>Выйти</button>
        </div>
    );
}