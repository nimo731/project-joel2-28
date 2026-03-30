import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { FaEnvelope, FaReply, FaTrash } from 'react-icons/fa';

import ComposeMessage from '../components/ComposeMessage';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyRecipient, setReplyRecipient] = useState(null);
    const [view, setView] = useState('inbox');
    const [editingMsg, setEditingMsg] = useState(null);
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        fetchMessages();
    }, [view]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const endpoint = view === 'inbox' ? '/messages' : '/messages/sent';
            const response = await api.get(endpoint);
            setMessages(response.data.messages || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching messages', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            await api.delete(`/messages/${id}`); // Correct route is /messages/:id, admin can delete
            fetchMessages();
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    const handleCompose = async () => {
        const email = prompt('Enter the user email to message:');
        if (!email) return;

        try {
            const response = await api.post('/users/find', { email });
            if (response.data.success) {
                setReplyRecipient(response.data.user);
            }
        } catch (error) {
            alert('User not found or error occurred.');
        }
    };

    const handleReply = (msg) => {
        setReplyRecipient(msg.sender);
    };

    const handleEdit = (msg) => {
        setEditingMsg(msg);
        setEditContent(msg.content);
    };

    const submitEdit = async () => {
        try {
            await api.patch(`/messages/${editingMsg._id}`, { content: editContent });
            setEditingMsg(null);
            fetchMessages();
        } catch (error) {
            alert('Failed to update message');
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setView('inbox')}
                            className={`px-4 py-1 text-sm font-semibold rounded-md transition-all ${view === 'inbox' ? 'bg-white text-zegen-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Inbox
                        </button>
                        <button
                            onClick={() => setView('sent')}
                            className={`px-4 py-1 text-sm font-semibold rounded-md transition-all ${view === 'sent' ? 'bg-white text-zegen-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Sent
                        </button>
                    </div>
                </div>
                <button
                    onClick={handleCompose}
                    className="bg-zegen-blue text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <FaEnvelope /> New Message
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className="p-10 text-center text-gray-400 italic">No messages in your inbox.</div>
                ) : (
                    messages.map(msg => (
                        <div key={msg._id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center gap-4 ${!msg.isRead ? 'bg-blue-50/50' : ''}`}>
                            <div className={`w-3 h-3 rounded-full shrink-0 ${!msg.isRead ? 'bg-zegen-red' : 'bg-transparent'}`}></div>
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                                <FaEnvelope />
                            </div>
                            <div className="flex-grow min-w-0">
                                <div className="flex justify-between mb-1">
                                    <h4 className={`text-sm truncate ${!msg.isRead && view === 'inbox' ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                                        {view === 'inbox' ? (msg.sender?.name || 'Unknown') : `To: ${msg.recipient?.name || 'Unknown'}`}
                                    </h4>
                                    <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="text-sm font-medium text-gray-800 truncate">{msg.subject}</div>

                                {editingMsg && editingMsg._id === msg._id ? (
                                    <div className="mt-2 flex gap-2">
                                        <input
                                            type="text"
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="border rounded px-2 py-1 flex-grow text-sm"
                                        />
                                        <button onClick={submitEdit} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Save</button>
                                        <button onClick={() => setEditingMsg(null)} className="bg-gray-300 px-3 py-1 rounded text-sm">Cancel</button>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500 truncate">{msg.content}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(msg)} className="p-2 text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50 rounded transition-colors" title="Edit">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                </button>
                                <button onClick={() => handleReply(msg)} className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors" title="Reply">
                                    <FaReply />
                                </button>
                                <button onClick={() => handleDelete(msg._id)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors" title="Delete">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {replyRecipient && (
                <ComposeMessage
                    isOpen={!!replyRecipient}
                    onClose={() => setReplyRecipient(null)}
                    recipient={replyRecipient}
                    onSendSuccess={() => {
                        alert(`Reply sent to ${replyRecipient.name}`);
                    }}
                />
            )}
        </DashboardLayout>
    );
};

export default AdminMessages;
