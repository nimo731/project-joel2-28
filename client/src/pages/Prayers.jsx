import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaPray, FaUserSecret, FaCheckCircle, FaPaperPlane } from 'react-icons/fa';

const Prayers = () => {
    const [prayers, setPrayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        isAnonymous: false,
        authorName: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchPrayers();
    }, []);

    const fetchPrayers = async () => {
        try {
            const response = await api.get('/prayers');
            setPrayers(response.data.prayers || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching prayers:', err);
            // Demo data
            setPrayers([
                { _id: '1', title: 'Healing for my mother', content: 'Please pray for my mom recovering from surgery.', authorName: 'Sarah', isAnonymous: false, createdAt: new Date().toISOString() },
                { _id: '2', title: 'Job opportunity', content: 'Praying for favor in an upcoming interview.', authorName: '', isAnonymous: true, createdAt: new Date().toISOString() }
            ]);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/prayers', formData);
            setSuccessMsg('Your prayer request has been shared.');
            setFormData({ title: '', content: '', isAnonymous: false, authorName: '' });
            fetchPrayers(); // Refresh list
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (err) {
            console.error('Error submitting prayer:', err);
            setSuccessMsg('Failed to submit. Please try again.'); // Or err msg
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Header */}
            <div className="bg-zegen-blue text-white pt-24 pb-16 px-4 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-zegen-red opacity-5 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Prayer Wall</h1>
                    <p className="text-gray-300 text-lg">
                        "Bearing one another's burdens." Share your requests and pray for others.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section (Left/Top) */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 sticky top-24 border border-gray-100">
                        <h3 className="text-2xl font-serif font-bold text-gray-800 mb-6 flex items-center">
                            <FaPaperPlane className="text-zegen-red mr-3" />
                            Submit Request
                        </h3>

                        {successMsg && (
                            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
                                <FaCheckCircle className="mr-2" /> {successMsg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-zegen-blue focus:border-transparent outline-none transition-all"
                                    placeholder="Brief topic..."
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Prayer Need</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-zegen-blue focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="Share what's on your heart..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Name <span className="text-gray-400 font-normal">(Optional if anonymous)</span>
                                </label>
                                <input
                                    type="text"
                                    disabled={formData.isAnonymous}
                                    className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-zegen-blue focus:border-transparent outline-none transition-all ${formData.isAnonymous ? 'bg-gray-100 cursor-not-allowed text-gray-400' : ''}`}
                                    placeholder="John Doe"
                                    value={formData.authorName}
                                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="anonymous"
                                    className="w-4 h-4 text-zegen-red border-gray-300 rounded focus:ring-zegen-red"
                                    checked={formData.isAnonymous}
                                    onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                                />
                                <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">Post Anonymously</label>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 bg-zegen-blue hover:bg-gray-800 text-white font-bold rounded-lg shadow-md transition-all hover:shadow-lg disabled:opacity-70 flex justify-center items-center"
                            >
                                {submitting ? 'Submitting...' : 'Share Request'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section (Right/Bottom) */}
                <div className="lg:col-span-2">
                    <div className="mb-6 flex justify-between items-end">
                        <h2 className="text-2xl font-serif font-bold text-gray-800">Recent Requests</h2>
                        <span className="text-sm text-gray-500">{prayers.length} active requests</span>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-zegen-red"></div>
                        </div>
                    ) : prayers.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm border border-gray-100">
                            No prayer requests visible yet. Be the first to share!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {prayers.map(prayer => (
                                <div key={prayer._id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border-l-4 border-zegen-red/70 flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="text-sm text-gray-400 font-medium">
                                            {formatDate(prayer.createdAt)}
                                        </div>
                                        <div className="text-zegen-blue/80 bg-blue-50 p-2 rounded-full">
                                            <FaPray />
                                        </div>
                                    </div>

                                    <h4 className="text-lg font-bold text-gray-800 mb-2">{prayer.title}</h4>

                                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                                        {prayer.content}
                                    </p>

                                    <div className="pt-4 mt-auto border-t border-gray-100 flex items-center text-sm font-medium text-gray-500">
                                        {prayer.isAnonymous ? (
                                            <>
                                                <FaUserSecret className="mr-2" /> Anonymous
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center mr-2 text-xs font-bold">
                                                    {prayer.authorName?.charAt(0) || 'U'}
                                                </div>
                                                {prayer.authorName}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Prayers;
