import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FaEnvelope, FaReply, FaTrash } from 'react-icons/fa';

const AdminMessages = () => {
    // Mock admin inbox
    const [messages, setMessages] = useState([
        { id: 1, from: "Sister Grace", subject: "Questions about baptism", preview: "Hi Pastor, I was wondering...", date: "10:30 AM", read: false },
        { id: 2, from: "John Doe", subject: "Volunteering", preview: "I'd like to join the media team.", date: "Yesterday", read: true },
    ]);

    return (
        <DashboardLayout role="admin">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Inbox</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {messages.map(msg => (
                    <div key={msg.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center gap-4 ${!msg.read ? 'bg-blue-50/50' : ''}`}>
                        <div className={`w-3 h-3 rounded-full shrink-0 ${!msg.read ? 'bg-zegen-red' : 'bg-transparent'}`}></div>
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                            <FaEnvelope />
                        </div>
                        <div className="flex-grow min-w-0">
                            <div className="flex justify-between mb-1">
                                <h4 className={`text-sm truncate ${!msg.read ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{msg.from}</h4>
                                <span className="text-xs text-gray-500">{msg.date}</span>
                            </div>
                            <div className="text-sm font-medium text-gray-800 truncate">{msg.subject}</div>
                            <p className="text-xs text-gray-500 truncate">{msg.preview}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-gray-400 hover:text-blue-600"><FaReply /></button>
                            <button className="p-2 text-gray-400 hover:text-red-600"><FaTrash /></button>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
};

export default AdminMessages;
