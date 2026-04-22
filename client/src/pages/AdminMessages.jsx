import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { FaEnvelope, FaReply, FaTrash, FaEdit, FaArrowLeft } from 'react-icons/fa';
import ComposeMessage from '../components/ComposeMessage';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI State for Chat
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null); // id of partner

    // Compose / Reply State
    const [replyRecipient, setReplyRecipient] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sendLoading, setSendLoading] = useState(false);

    // Edit State
    const [editingMsg, setEditingMsg] = useState(null);
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const [inboxRes, sentRes] = await Promise.all([
                api.get('/messages'),
                api.get('/messages/sent')
            ]);

            const inboxMsgs = (inboxRes.data.messages || []).map(m => ({ ...m, type: 'inbox' }));
            const sentMsgs = (sentRes.data.messages || []).map(m => ({ ...m, type: 'sent' }));
            const allMessages = [...inboxMsgs, ...sentMsgs].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            setMessages(allMessages);
            groupConversations(allMessages);
        } catch (error) {
            console.error('Error fetching messages', error);
        } finally {
            setLoading(false);
        }
    };

    const groupConversations = (allMessages) => {
        const convos = {};
        allMessages.forEach(msg => {
            const partner = msg.type === 'inbox' ? msg.sender : msg.recipient;
            if (!partner) return;
            const partnerId = partner._id;

            if (!convos[partnerId]) {
                convos[partnerId] = {
                    partner,
                    messages: [],
                    lastMessageAt: new Date(msg.createdAt),
                    unreadCount: 0
                };
            }
            convos[partnerId].messages.push(msg);

            const msgDate = new Date(msg.createdAt);
            if (msgDate > convos[partnerId].lastMessageAt) {
                convos[partnerId].lastMessageAt = msgDate;
            }
            if (msg.type === 'inbox' && !msg.isRead) {
                convos[partnerId].unreadCount++;
            }
        });

        // Sort by most recent
        const conversationList = Object.values(convos).sort((a, b) => b.lastMessageAt - a.lastMessageAt);
        setConversations(conversationList);

        // If an active conversation is selected that no longer exists, clear it
        if (activeConversation && !convos[activeConversation]) {
            setActiveConversation(null);
        }
    };

    // When clicking a conversation, mark all its unread messages as read
    const selectConversation = async (partnerId) => {
        setActiveConversation(partnerId);

        const conv = conversations.find(c => c.partner._id === partnerId);
        if (conv && conv.unreadCount > 0) {
            // Mark all unread inbox messages from this partner as read
            const unreadMsgs = conv.messages.filter(m => m.type === 'inbox' && !m.isRead);
            try {
                await Promise.all(unreadMsgs.map(m => api.put(`/messages/${m._id}/read`)));
                // Update state locally to be snappy
                setConversations(prev => prev.map(c =>
                    c.partner._id === partnerId
                        ? { ...c, unreadCount: 0, messages: c.messages.map(m => m.type === 'inbox' ? { ...m, isRead: true } : m) }
                        : c
                ));
            } catch (err) {
                console.error("Failed to mark as read", err);
            }
        }
    };

    // Quick Reply to an active conversation
    const handleQuickReply = async (partnerId) => {
        if (!replyText.trim()) return;
        setSendLoading(true);
        try {
            await api.post('/messages', {
                recipientId: partnerId,
                subject: 'Re: Message', // generic subject since it's a chat
                content: replyText.trim()
            });
            setReplyText('');
            await fetchMessages(); // Refetch to get the new message immediately
        } catch (error) {
            alert('Failed to send reply');
        } finally {
            setSendLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm('Delete this message?')) return;
        try {
            await api.delete(`/messages/${id}`);
            fetchMessages();
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    // Handle initial Compose (which creates a new thread)
    const handleCompose = async () => {
        const name = prompt('Enter the user name to message:');
        if (!name) return;

        try {
            const response = await api.post('/users/find', { name });
            if (response.data.success) {
                setReplyRecipient(response.data.user);
            }
        } catch (error) {
            alert('User not found or error occurred.');
        }
    };

    // Inline Edits
    const startEdit = (msg, e) => {
        if (e) e.stopPropagation();
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

    const activeConvData = conversations.find(c => c.partner._id === activeConversation);

    return (
        <DashboardLayout role="admin">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Messages Workspace</h1>
                <button
                    onClick={handleCompose}
                    className="bg-zegen-blue text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <FaEnvelope /> New Message
                </button>
            </div>

            <div className="flex h-[calc(100vh-160px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">

                {/* 1. Left Sidebar: Conversations List */}
                <div className={`${activeConversation ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 flex-col bg-gray-50 flex-shrink-0 z-10`}>
                    <div className="p-4 border-b border-gray-200 bg-white font-bold text-gray-700 uppercase text-xs tracking-wider flex justify-between items-center">
                        <span>Active Chats</span>
                        <span className="bg-zegen-blue text-white rounded-full px-2 py-0.5 text-[10px]">{conversations.length}</span>
                    </div>

                    <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-200">
                        {loading && conversations.length === 0 ? (
                            <div className="p-6 text-center text-gray-400 text-sm">Loading chats...</div>
                        ) : conversations.length === 0 ? (
                            <div className="p-6 text-center text-gray-400 text-sm">No messages yet.</div>
                        ) : conversations.map(conv => (
                            <div
                                key={conv.partner._id}
                                onClick={() => selectConversation(conv.partner._id)}
                                className={`p-4 border-b border-gray-100 cursor-pointer flex items-center gap-3 transition-colors ${activeConversation === conv.partner._id ? 'bg-blue-50/70 border-l-4 border-zegen-blue' : 'hover:bg-gray-100 border-l-4 border-transparent'}`}
                            >
                                {conv.partner.profileImage || conv.partner.avatar ? (
                                    <img
                                        src={(conv.partner.profileImage && conv.partner.profileImage.startsWith('http')) ? conv.partner.profileImage : `${api.defaults.baseURL.replace('/api/v1', '')}${conv.partner.profileImage || conv.partner.avatar}`}
                                        alt={conv.partner.name}
                                        className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-200 flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-zegen-blue text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm text-lg">
                                        {conv.partner.name?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                )}
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                                            {conv.partner.name || 'Unknown'}
                                        </h4>
                                        <span className="text-[10px] text-gray-400 font-medium">
                                            {new Date(conv.lastMessageAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-bold text-zegen-blue' : 'text-gray-500'}`}>
                                        {conv.messages[conv.messages.length - 1]?.content}
                                    </p>
                                </div>
                                {conv.unreadCount > 0 && (
                                    <div className="w-5 h-5 rounded-full bg-zegen-red text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 shadow-sm">
                                        {conv.unreadCount}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Right Panel: Chat Area */}
                <div className={`${!activeConversation ? 'hidden md:flex' : 'flex'} w-full md:w-2/3 lg:w-3/4 flex-col bg-[#f8fbff] relative`}>
                    {activeConvData ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-3 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm z-10">
                                <div className="flex items-center gap-3">
                                    <button
                                        className="md:hidden mr-1 text-gray-500 hover:text-zegen-blue p-2 rounded-full hover:bg-gray-100 transition-colors"
                                        onClick={() => setActiveConversation(null)}
                                    >
                                        <FaArrowLeft />
                                    </button>

                                    {activeConvData.partner.profileImage || activeConvData.partner.avatar ? (
                                        <img
                                            src={(activeConvData.partner.profileImage && activeConvData.partner.profileImage.startsWith('http')) ? activeConvData.partner.profileImage : `${api.defaults.baseURL.replace('/api/v1', '')}${activeConvData.partner.profileImage || activeConvData.partner.avatar}`}
                                            alt={activeConvData.partner.name}
                                            className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold shadow-sm">
                                            {activeConvData.partner.name?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-sm leading-tight">{activeConvData.partner.name || 'Unknown'}</h3>
                                        <p className="text-xs text-gray-500">{activeConvData.partner.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-grow p-4 md:p-6 overflow-y-auto flex flex-col gap-3 scrollbar-thin scrollbar-thumb-gray-300">
                                {activeConvData.messages.map(msg => (
                                    <div
                                        key={msg._id}
                                        className={`group max-w-[85%] md:max-w-[70%] flex flex-col relative ${msg.type === 'sent' ? 'self-end' : 'self-start'}`}
                                    >

                                        {/* Action buttons (hidden on default, reveal on hover) */}
                                        <div className={`absolute top-0 -mt-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 ${msg.type === 'sent' ? '-left-16' : '-right-10'}`}>
                                            {msg.type === 'sent' && editingMsg?._id !== msg._id && (
                                                <button
                                                    onClick={(e) => startEdit(msg, e)}
                                                    className="p-1.5 text-gray-500 hover:text-zegen-blue bg-white rounded-full shadow-md border border-gray-100"
                                                    title="Edit Message"
                                                >
                                                    <FaEdit className="w-3 h-3" />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => handleDelete(msg._id, e)}
                                                className="p-1.5 text-gray-500 hover:text-red-500 bg-white rounded-full shadow-md border border-gray-100"
                                                title="Delete Message"
                                            >
                                                <FaTrash className="w-3 h-3" />
                                            </button>
                                        </div>

                                        <div className={`px-5 py-3.5 rounded-2xl shadow-sm border ${msg.type === 'sent'
                                            ? 'bg-zegen-blue text-white rounded-tr-sm border-zegen-blue'
                                            : 'bg-white text-gray-800 rounded-tl-sm border-gray-100'
                                            }`} style={{ minWidth: '150px' }}>

                                            {/* Subj line only if it's not a generic quick reply */}
                                            {msg.subject && !msg.subject.startsWith('Re: Message') && (
                                                <div className={`text-[10px] font-bold mb-1 opacity-70 tracking-wide uppercase ${msg.type === 'sent' ? 'text-blue-200' : 'text-gray-500'}`}>
                                                    Subject: {msg.subject}
                                                </div>
                                            )}

                                            {/* Body */}
                                            {editingMsg && editingMsg._id === msg._id ? (
                                                <div className="flex flex-col gap-2 min-w-[200px] mt-1">
                                                    <textarea
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        className="w-full text-sm text-gray-800 bg-white border border-gray-200 rounded p-2 focus:ring-1 focus:ring-zegen-blue outline-none resize-none"
                                                        rows="3"
                                                        autoFocus
                                                    />
                                                    <div className="flex gap-2 self-end">
                                                        <button onClick={submitEdit} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded">Save</button>
                                                        <button onClick={() => setEditingMsg(null)} className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs font-bold rounded">Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-[14px] leading-relaxed whitespace-pre-wrap break-words">
                                                    {msg.content}
                                                </div>
                                            )}

                                            <div className={`text-[10px] text-right mt-1 opacity-60 flex justify-end items-center gap-1`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Sticky Input Bar */}
                            <div className="p-3 bg-[#f0f0f0] flex items-end gap-2 z-10">
                                <div className="flex-grow bg-white rounded-full shadow-sm flex items-center pr-2 py-1">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-grow bg-transparent border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-0 resize-none"
                                        rows="1"
                                        style={{ minHeight: '40px', maxHeight: '120px' }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleQuickReply(activeConvData.partner._id);
                                            }
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={() => handleQuickReply(activeConvData.partner._id)}
                                    disabled={!replyText.trim() || sendLoading}
                                    className="w-10 h-10 rounded-full bg-zegen-blue text-white flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50 flex-shrink-0 shadow-md"
                                >
                                    <FaReply className="transform -scale-x-100 w-4 h-4 ml-[-2px]" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-gray-400 bg-[#f8fbff]">
                            <div className="w-24 h-24 rounded-full bg-blue-50/50 shadow-inner flex items-center justify-center mb-6 border border-blue-100 transition-transform hover:scale-105">
                                <svg className="w-10 h-10 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                            </div>
                            <p className="text-xl font-bold text-gray-700 tracking-tight font-serif">Joel 2:28 Connection</p>
                            <p className="text-sm text-gray-500 mt-2 font-medium">Select a conversation to start messaging</p>
                        </div>
                    )}
                </div>
            </div>

            {/* The ComposeMessage Modal triggered by "New Message" */}
            {replyRecipient && (
                <ComposeMessage
                    isOpen={!!replyRecipient}
                    onClose={() => setReplyRecipient(null)}
                    recipient={replyRecipient}
                    onSendSuccess={() => {
                        alert(`Message sent to ${replyRecipient.name}`);
                        setReplyRecipient(null);
                        fetchMessages(); // Refresh conversation list
                    }}
                />
            )}

        </DashboardLayout>
    );
};

export default AdminMessages;
