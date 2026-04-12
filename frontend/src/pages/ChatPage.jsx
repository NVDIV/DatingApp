import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../api/axiosConfig';
import '../styles/chat.css'; // Не забудь створити цей файл

export default function ChatPage() {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const stompClient = useSocket();
    
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        api.get(`/messages/${matchId}`).then(res => {
            const history = res.data.content ? res.data.content : res.data;
            setMessages(history.slice().reverse());
        });
    }, [matchId]);

    useEffect(() => {
        if (!stompClient) return;

        const onMessageReceived = (frame) => {
            const newMessage = JSON.parse(frame.body);
            setMessages(prev => [...prev, newMessage]);
        };

        let subscription;
        if (stompClient.connected) {
            subscription = stompClient.subscribe(`/topic/messages/${matchId}`, onMessageReceived);
        } else {
            const originalOnConnect = stompClient.onConnect;
            stompClient.onConnect = (frame) => {
                if (originalOnConnect) originalOnConnect(frame);
                subscription = stompClient.subscribe(`/topic/messages/${matchId}`, onMessageReceived);
            };
        }

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, [stompClient, matchId]);

    const sendMessage = () => {
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
            setInputValue('');
        }
    };

    return (
        <div className="chat-page-container">
            <div className="chat-window">
                <div className="chat-header">
                    <button onClick={() => navigate('/matches')} className="back-btn">←</button>
                    <span className="chat-title">Магія Спілкування</span>
                </div>

                <div className="messages-display">
                    {messages.map((msg, index) => (
                        <div 
                            key={index} 
                            className={`message-row ${msg.senderId === user.id ? 'my-msg' : 'their-msg'}`}
                        >
                            <div className="bubble">
                                <p>{msg.content}</p>
                                <span className="message-time">
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-area">
                    <input 
                        className="custom-input"
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Напишіть послання..."
                    />
                    <button className="send-btn" onClick={sendMessage} disabled={!inputValue.trim()}>
                        🔮
                    </button>
                </div>
            </div>
        </div>
    );
}