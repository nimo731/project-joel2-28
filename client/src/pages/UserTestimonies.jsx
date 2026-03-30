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
            <div className="max-w-3xl mx-auto pb-12">
                <div className="mb-8 text-center bg-gradient-to-br from-zegen-blue to-blue-900 text-white rounded-[2rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-zegen-red opacity-10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>

                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-inner">
                            <FaQuoteLeft size={32} className="text-white drop-shadow-md" />
                        </div>
                        <h1 className="text-4xl font-extrabold mb-4 drop-shadow-sm font-serif tracking-tight">Share Your Testimony</h1>
                        <p className="text-blue-100 text-lg max-w-lg mx-auto font-medium leading-relaxed">
                            Your story carries the power to inspire thousands. Share what God has done in your life.
                        </p>
                    </div>
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
                    <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative z-10 -mt-6 mx-2 sm:mx-8">
                        <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-7">
                            <div>
                                <label className="block text-xs font-bold text-zegen-blue uppercase tracking-widest mb-3">Title of your story</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Healed from Chronic Pain"
                                    className="w-full px-5 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-zegen-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all text-gray-800 font-medium placeholder-gray-400"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-xs font-bold text-zegen-blue uppercase tracking-widest mb-3">Category</label>
                                    <select
                                        className="w-full px-5 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-zegen-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all appearance-none font-medium text-gray-800"
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
                                    <label className="relative inline-flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={isAnonymous}
                                            onChange={() => setIsAnonymous(!isAnonymous)}
                                        />
                                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-zegen-blue shadow-inner"></div>
                                        <span className="ml-4 text-sm font-bold text-gray-600 group-hover:text-zegen-blue transition-colors">Share Anonymously</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zegen-blue uppercase tracking-widest mb-3">Your Journey</label>
                                <textarea
                                    required
                                    rows="8"
                                    placeholder="Pour your heart out here..."
                                    className="w-full px-5 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-zegen-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all resize-none text-gray-800 font-medium placeholder-gray-400 leading-relaxed"
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
