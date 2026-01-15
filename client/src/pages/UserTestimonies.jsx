import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { FaPaperPlane, FaQuoteLeft } from 'react-icons/fa';

const UserTestimonies = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('other');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'User' };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/testimonies', {
                title,
                testimony: content,
                category: category.toLowerCase(), // Ensure lowercase
                isAnonymous,
                name: user.name || 'Anonymous Member' // Fallback if name is missing
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/userdashboard');
            }, 3000);
        } catch (err) {
            console.error('Error submitting testimony', err);
            setError(err.response?.data?.message || 'Failed to submit testimony. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="user" user={user}>
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 text-zegen-blue rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaQuoteLeft size={24} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Share Your Testimony</h1>
                    <p className="text-gray-500 mt-2">Your story can inspire thousands. Share what God has done in your life.</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs">!</div>
                        <p>{error}</p>
                    </div>
                )}

                {success ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-8 rounded-xl text-center animate-pulse">
                        <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                        <p>Your testimony has been submitted successfully and is currently under review by our team.</p>
                        <p className="mt-4 text-sm font-medium">Redirecting to dashboard...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Healed from Chronic Pain"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-zegen-blue focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Category</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-zegen-blue focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none bg-white"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="healing">Healing</option>
                                        <option value="provision">Provision</option>
                                        <option value="breakthrough">Breakthrough</option>
                                        <option value="salvation">Salvation</option>
                                        <option value="deliverance">Deliverance</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="flex items-center pt-8">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={isAnonymous}
                                            onChange={() => setIsAnonymous(!isAnonymous)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zegen-blue"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-700">Share Anonymously</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Your Story</label>
                                <textarea
                                    required
                                    rows="8"
                                    placeholder="Tell us what happened..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-zegen-blue focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 bg-zegen-red text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Submitting...' : (
                                    <>
                                        <FaPaperPlane /> Submit for Review
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default UserTestimonies;
