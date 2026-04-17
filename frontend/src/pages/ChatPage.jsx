import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../api/axiosConfig';
import '../styles/chat.css';

export default function ChatPage() {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const stompClient = useSocket();
    
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Автопрокрутка при новых сообщениях
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 1. Загрузка истории сообщений
    useEffect(() => {
        setLoading(true);
        api.get(`/messages/${matchId}`)
            .then(res => {
                const history = res.data.content ? res.data.content : res.data;
                // Разворачиваем историю, если бэкенд отдает от новых к старым
                setMessages(Array.isArray(history) ? [...history].reverse() : []);
            })
            .catch(err => console.error("Помилка истории", err))
            .finally(() => setLoading(false));
    }, [matchId]);

    // 2. Подписка на сокеты
    useEffect(() => {
        if (!stompClient || !stompClient.connected) return;

        console.log(`Subscribing to chat: ${matchId}`);
        
        const subscription = stompClient.subscribe(`/topic/messages/${matchId}`, (frame) => {
            const newMessage = JSON.parse(frame.body);
            // Добавляем сообщение, только если его еще нет в списке (защита от дублей)
            setMessages(prev => {
                if (prev.find(m => m.id === newMessage.id && m.id !== undefined)) return prev;
                return [...prev, newMessage];
            });
        });

        return () => {
            console.log(`Unsubscribing from chat: ${matchId}`);
            subscription.unsubscribe();
        };
    }, [stompClient, stompClient?.connected, matchId]);

    const sendMessage = (e) => {
        if (e) e.preventDefault();
        
        if (stompClient && stompClient.connected && inputValue.trim()) {
            const chatMessage = {
                matchId: parseInt(matchId),
                senderId: user.id,
                content: inputValue.trim(),
                timestamp: new Date().toISOString()
            };

            stompClient.publish({
                destination: `/app/chat.sendMessage/${matchId}`,
                body: JSON.stringify(chatMessage)
            });
            
            setInputValue(''); // Мгновенная очистка
        }
    };

    if (!user) return null;

    return (
        <div className="chat-page-container">
            <div className="chat-window">
                <div className="chat-header">
                    <button onClick={() => navigate('/matches')} className="back-btn">←</button>
                    <div className="chat-user-info">
                        <span className="chat-title">Магія Спілкування</span>
                        <span className="online-status">у мережі</span>
                    </div>
                </div>

                <div className="messages-display">
                    {loading ? (
                        <div className="chat-loading">Завантаження послань...</div>
                    ) : (
                        messages.map((msg, index) => (
                            <div 
                                key={msg.id || index} 
                                className={`message-row ${msg.senderId === user.id ? 'my-msg' : 'their-msg'}`}
                            >
                                <div className="bubble">
                                    <p>{msg.content}</p>
                                    <span className="message-time">
                                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-area" onSubmit={sendMessage}>
                    <input 
                        className="custom-input"
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Напишіть послання..."
                    />
                    <button 
                        type="submit"
                        className="send-btn" 
                        disabled={!inputValue.trim() || !stompClient?.connected}
                    >
                        🔮
                    </button>
                </form>
            </div>
        </div>
    );
}