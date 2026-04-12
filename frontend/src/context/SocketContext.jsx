import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        // Підключаємось тільки якщо є авторизований юзер
        if (user && !stompClient) {
            const token = localStorage.getItem('token');
            const client = new Client({
                webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
                connectHeaders: {
                    Authorization: `Bearer ${token}`
                },
                onConnect: () => {
                    console.log('Connected to WebSocket');
                },
                onStompError: (frame) => {
                    console.error('STOMP error', frame);
                }
            });

            client.activate();
            setStompClient(client);
        }

        // Відключаємось при логауті
        if (!user && stompClient) {
            stompClient.deactivate();
            setStompClient(null);
        }

        return () => stompClient?.deactivate();
    }, [user]);

    return (
        <SocketContext.Provider value={stompClient}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);