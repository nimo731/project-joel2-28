import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { FaPlus, FaPray, FaLock, FaGlobe } from 'react-icons/fa';

const UserPrayers = () => {
    const [prayers, setPrayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '', request: '', category: 'personal', isAnonymous: false, isUrgent: false
    });

    const [user] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : { name: 'User', role: 'user' };
    });

    useEffect(() => {
        fetchMyPrayers();
    }, []);

    const fetchMyPrayers = async () => {
        try {
            const response = await api.get('/prayers/my');
            setPrayers(response.data.prayers || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching my prayers', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/prayers', { ...formData, name: user.name }); // Use actual user name/context
            setIsModalOpen(false);
            fetchMyPrayers();
            setFormData({ title: '', request: '', category: 'personal', isAnonymous: false, isUrgent: false });
        } catch (error) {
            console.error('Submit failed', error);
            alert('Failed to submit prayer request.');
        }
    };

    return (
        <DashboardLayout role="user" user={user}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">My Prayer Requests</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-zegen-red hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors"
                >
                    <FaPlus className="mr-2" /> New Request
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <p>Loading...</p> : prayers.length === 0 ? (
                    <div className="col-span-3 text-center py-10 text-gray-500">
                        You haven't shared any prayer requests yet.
                    </div>
                ) : prayers.map(prayer => (
                    <div key={prayer._id || prayer.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col relative group hover:shadow-md transition-shadow">
                        <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${prayer.status === 'answered' ? 'bg-green-500' : 'bg-zegen-blue'}`}></div>

                        <div className="flex justify-between items-start mb-3 pl-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                {new Date(prayer.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex gap-2">
                                {prayer.isAnonymous ? <FaLock className="text-gray-400" title="Anonymous" /> : <FaGlobe className="text-blue-400" title="Public" />}
                            </div>
                        </div>

                        <h3 className="font-bold text-gray-800 mb-2 pl-3">{prayer.title || 'Prayer Request'}</h3>
                        <p className="text-gray-600 text-sm mb-4 flex-grow pl-3 line-clamp-3">{prayer.request}</p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 pl-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${prayer.status === 'answered' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'}`}>
                                {prayer.status || 'Active'}
                            </span>
                            <div className="flex items-center text-gray-400 text-sm">
                                <FaPray className="mr-1" /> {prayer.prayerCount || 0}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">New Prayer Request</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Topic</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border rounded p-2"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Healing, Guidance..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Prayer Need</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full border rounded p-2"
                                    value={formData.request}
                                    onChange={e => setFormData({ ...formData, request: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isAnonymous}
                                        onChange={e => setFormData({ ...formData, isAnonymous: e.target.checked })}
                                        className="rounded text-zegen-blue"
                                    />
                                    <span>Post Anonymously</span>
                                </label>
                                <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isUrgent}
                                        onChange={e => setFormData({ ...formData, isUrgent: e.target.checked })}
                                        className="rounded text-red-500"
                                    />
                                    <span className="text-red-500 font-medium">Urgent</span>
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-zegen-red text-white rounded hover:bg-red-700">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default UserPrayers;
