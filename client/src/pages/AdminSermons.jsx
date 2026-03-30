import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { FaPlus, FaEdit, FaTrash, FaVideo, FaSearch } from 'react-icons/fa';

const AdminSermons = () => {
    const [sermons, setSermons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSermon, setCurrentSermon] = useState(null);
    const [formData, setFormData] = useState({
        title: '', preacher: '', description: '', videoLink: '', category: 'teaching', date: new Date().toISOString().split('T')[0]
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);

    useEffect(() => {
        fetchSermons();
    }, []);

    const fetchSermons = async () => {
        try {
            const response = await api.get('/admin/sermons');
            setSermons(response.data.sermons || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sermons', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/admin/sermons/${id}`);
            fetchSermons();
        } catch (error) {
            console.error('Delete failed', error);
            alert('Failed to delete sermon.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('speaker', formData.preacher); // Backend expects 'speaker'
        data.append('description', formData.description);
        data.append('videoUrl', formData.videoLink); // Backend maps videoUrl to videoLink
        data.append('category', formData.category);
        data.append('date', formData.date);

        if (thumbnailFile) {
            data.append('thumbnail', thumbnailFile);
        }
        if (videoFile) {
            data.append('video', videoFile);
        }

        try {
            if (currentSermon) {
                // Edit mode - using PUT as defined in admin.js
                await api.put(`/admin/sermons/${currentSermon._id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // Create mode
                await api.post('/admin/sermons', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setIsModalOpen(false);
            fetchSermons();
            setThumbnailFile(null);
            setVideoFile(null);
        } catch (error) {
            console.error('Operation failed', error);
            alert('Failed to save sermon. ' + (error.response?.data?.message || ''));
        }
    };

    const openModal = (sermon = null) => {
        setCurrentSermon(sermon);
        setThumbnailFile(null);
        setVideoFile(null);
        if (sermon) {
            setFormData({
                title: sermon.title,
                preacher: sermon.preacher,
                description: sermon.description,
                videoLink: sermon.videoLink,
                category: sermon.category || 'teaching',
                date: sermon.date ? new Date(sermon.date).toISOString().split('T')[0] : ''
            });
        } else {
            setFormData({
                title: '', preacher: '', description: '', videoLink: '', category: 'teaching', date: new Date().toISOString().split('T')[0]
            });
        }
        setIsModalOpen(true);
    };

    return (
        <DashboardLayout role="admin">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Sermons</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-zegen-blue hover:bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm"
                >
                    <FaPlus className="mr-2" /> Add Sermon
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full p-12 text-center text-gray-500 font-medium animate-pulse">Loading sermons...</div>
                ) : sermons.length === 0 ? (
                    <div className="col-span-full p-16 text-center text-gray-400 italic bg-white rounded-2xl shadow-sm border border-gray-100">"No sermons have been uploaded yet"</div>
                ) : sermons.map(sermon => (
                    <div key={sermon._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col relative">
                        {/* Decorative top accent */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-zegen-blue to-blue-900 absolute top-0 left-0"></div>

                        <div className="p-6 flex-grow flex flex-col mt-2">
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-3 py-1 rounded-full bg-blue-50 text-zegen-blue text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-sm">
                                    {sermon.category}
                                </span>
                                <span className="text-xs text-gray-400 font-medium">
                                    {new Date(sermon.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight group-hover:text-zegen-blue transition-colors">
                                {sermon.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4 font-medium flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                                    <FaVideo className="w-3 h-3" />
                                </span>
                                {sermon.preacher}
                            </p>

                            <p className="text-sm text-gray-600 line-clamp-3 mb-6 relative z-10">
                                {sermon.description || 'No description provided.'}
                            </p>
                        </div>

                        <div className="p-4 border-t border-gray-50 bg-gray-50/50 flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => openModal(sermon)}
                                className="px-3 py-1.5 bg-white text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors shadow-sm border border-gray-200"
                            >
                                <FaEdit className="inline mr-1" /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(sermon._id)}
                                className="px-3 py-1.5 bg-white text-red-500 hover:text-white hover:bg-red-500 rounded-lg text-sm font-medium transition-colors shadow-sm border border-gray-200"
                            >
                                <FaTrash className="inline mr-1" /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto pt-10 pb-10">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl relative my-auto">
                        <h2 className="text-xl font-bold mb-4">{currentSermon ? 'Edit Sermon' : 'Add New Sermon'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input type="text" required className="w-full border rounded p-2" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Preacher</label>
                                    <input type="text" required className="w-full border rounded p-2" value={formData.preacher} onChange={e => setFormData({ ...formData, preacher: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <input type="date" required className="w-full border rounded p-2" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select className="w-full border rounded p-2" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    <option value="teaching">Teaching</option>
                                    <option value="worship">Worship</option>
                                    <option value="prayer">Prayer</option>
                                    <option value="special">Special</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 gap-4 p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs font-bold text-gray-500 uppercase">Media Content</p>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Thumbnail (Image)</label>
                                    <input type="file" accept="image/*" className="w-full text-sm" onChange={e => setThumbnailFile(e.target.files[0])} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Video File (Optional)</label>
                                    <input type="file" accept="video/*" className="w-full text-sm" onChange={e => setVideoFile(e.target.files[0])} />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-gray-200"></div>
                                    <span className="relative bg-gray-50 px-2 text-xs text-gray-400 font-medium">OR External Link</span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">External Video Link</label>
                                    <input type="text" placeholder="https://youtube.com/..." className="w-full border rounded p-2" value={formData.videoLink} onChange={e => setFormData({ ...formData, videoLink: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea required rows="3" className="w-full border rounded p-2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-zegen-red text-white rounded hover:bg-red-700">Save Sermon</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminSermons;
