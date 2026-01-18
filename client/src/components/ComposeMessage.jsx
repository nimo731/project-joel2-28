import React, { useState } from 'react';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import api from '../services/api';

const ComposeMessage = ({ isOpen, onClose, recipient, onSendSuccess }) => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        setError('');

        try {
            await api.post('/messages', {
                recipientId: recipient._id || recipient.id,
                subject,
                content
            });
            setSubject('');
            setContent('');
            onSendSuccess();
            onClose();
        } catch (err) {
            console.error('Send message error:', err);
            setError('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
                <div className="bg-zegen-blue text-white p-4 flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2">
                        <FaPaperPlane /> Send Message
                    </h3>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <FaTimes />
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                            <input
                                type="text"
                                value={recipient.name || recipient.email}
                                disabled
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                                placeholder="Prayer Request Update..."
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-zegen-blue outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                rows="5"
                                placeholder="Write your message here..."
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-zegen-blue outline-none resize-none"
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={sending}
                                className={`px-6 py-2 bg-zegen-red text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 ${sending ? 'opacity-70 cursor-wait' : 'hover:-translate-y-0.5'}`}
                            >
                                {sending ? 'Sending...' : <>Send <FaPaperPlane className="text-sm" /></>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ComposeMessage;
