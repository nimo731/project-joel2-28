import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa';
import io from 'socket.io-client';

const UserMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : { name: 'User', role: 'user', id: '' };
    });

    useEffect(() => {
        fetchMessages();
        fetchUserProfile();

        // Socket connection
        const socket = io('http://localhost:5001'); // Backend URL
        socket.emit('join_user', user.id || user._id); // Assuming user object has id

        socket.on('new_message', (data) => {
            // Add new message to top of list
            setMessages(prev => [data.message, ...prev]);
            alert(`New message from ${data.senderName || 'Admin'}`);
        });

        return () => socket.disconnect();
    }, [user.id, user._id]);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/auth/me');
            if (response.data && response.data.user) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Error fetching user profile', error);
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await api.get('/messages'); // Assuming GET /messages returns received messages
            setMessages(response.data.messages || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching messages', error);
            // Fallback
            setMessages([
                { _id: 1, subject: 'Welcome to Joel 2:28', content: 'We are so glad to have you join our community.', sender: { name: 'Admin Team' }, createdAt: new Date().toISOString(), isRead: false }
            ]);
            setLoading(false);
        }
    };

    const handleRead = async (msg) => {
        setSelectedMessage(msg);
        if (!msg.isRead) {
            try {
                await api.put(`/messages/${msg._id}/read`);
                setMessages(messages.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
            } catch (error) {
                console.error('Failed to mark read', error);
            }
        }
    };

    return (
        <DashboardLayout role="user" user={user}>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Messages</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                {/* Message List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-y-auto">
                    {messages.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No messages yet.</div>
                    ) : messages.map(msg => (
                        <div
                            key={msg._id}
                            onClick={() => handleRead(msg)}
                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedMessage?._id === msg._id ? 'bg-blue-50 border-l-4 border-zegen-blue' : ''} ${!msg.isRead ? 'bg-white font-semibold' : 'bg-gray-50/50 text-gray-600'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-sm">{msg.sender?.name || 'Admin'}</span>
                                <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="text-sm truncate mb-1">{msg.subject}</div>
                            <div className="text-xs text-gray-400 truncate">{msg.content}</div>
                        </div>
                    ))}
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col">
                    {selectedMessage ? (
                        <>
                            <div className="border-b border-gray-100 pb-4 mb-4">
                                <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedMessage.subject}</h2>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>From: <span className="font-semibold text-gray-700">{selectedMessage.sender?.name}</span></span>
                                    <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="prose max-w-none text-gray-600 leading-relaxed overflow-y-auto flex-grow">
                                {selectedMessage.content}
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors">
                                    Reply
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <FaEnvelopeOpen className="text-6xl mb-4 text-gray-200" />
                            <p>Select a message to read</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserMessages;
