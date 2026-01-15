import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '11:00',
        venue: '',
        category: 'fellowship',
        imageUrl: '',
        videoUrl: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events');
            setEvents(response.data.events || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching events', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        try {
            await api.delete(`/admin/events/${id}`);
            fetchEvents();
        } catch (error) {
            console.error('Delete failed', error);
            alert('Failed to delete event.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        // Backwards compatibility/Model sync
        data.append('location', formData.venue);

        if (imageFile) data.append('image', imageFile);
        if (videoFile) data.append('video', videoFile);

        try {
            if (currentEvent) {
                // Using PUT as updated in admin.js
                await api.put(`/admin/events/${currentEvent._id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/admin/events', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setIsModalOpen(false);
            fetchEvents();
            setImageFile(null);
            setVideoFile(null);
        } catch (error) {
            console.error('Operation failed', error);
            alert('Failed to save event. ' + (error.response?.data?.message || ''));
        }
    };

    const openModal = (event = null) => {
        setCurrentEvent(event);
        setImageFile(null);
        setVideoFile(null);
        if (event) {
            setFormData({
                title: event.title,
                description: event.description,
                date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
                startTime: event.startTime || '09:00',
                endTime: event.endTime || '11:00',
                venue: event.venue || '',
                category: event.category || 'fellowship',
                imageUrl: event.imageUrl || '',
                videoUrl: event.videoUrl || ''
            });
        } else {
            setFormData({
                title: '', description: '', date: '', startTime: '09:00', endTime: '11:00', venue: '', category: 'fellowship', imageUrl: '', videoUrl: ''
            });
        }
        setIsModalOpen(true);
    };

    return (
        <DashboardLayout role="admin">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Events</h1>
                <button onClick={() => openModal()} className="bg-zegen-blue hover:bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm">
                    <FaPlus className="mr-2" /> Add Event
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">Event Name</th>
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4">Venue</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="5" className="p-6 text-center text-gray-500">Loading...</td></tr>
                        ) : events.length === 0 ? (
                            <tr><td colSpan="5" className="p-12 text-center text-gray-400 italic">"No events available yet"</td></tr>
                        ) : events.map(event => (
                            <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-800">{event.title}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    <div className="text-sm font-semibold">{new Date(event.date).toLocaleDateString()}</div>
                                    <div className="text-xs">{event.startTime} - {event.endTime}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-sm">{event.venue}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-bold uppercase">{event.category}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => openModal(event)} className="text-blue-500 hover:text-blue-700 mx-2"><FaEdit /></button>
                                    <button onClick={() => handleDelete(event._id)} className="text-red-500 hover:text-red-700 mx-2"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto pt-10 pb-10">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl relative my-auto">
                        <h2 className="text-xl font-bold mb-4">{currentEvent ? 'Edit Event' : 'New Event'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Event Title</label>
                                <input type="text" required className="w-full border rounded p-2" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <input type="date" required className="w-full border rounded p-2" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Start</label>
                                        <input type="time" required className="w-full border rounded p-2" value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">End</label>
                                        <input type="time" required className="w-full border rounded p-2" value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Venue</label>
                                    <input type="text" required className="w-full border rounded p-2" value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select className="w-full border rounded p-2" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                        <option value="fellowship">Fellowship</option>
                                        <option value="outreach">Outreach</option>
                                        <option value="worship">Worship</option>
                                        <option value="prayer">Prayer</option>
                                        <option value="seminar">Seminar</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 p-3 bg-gray-50 rounded-lg text-sm">
                                <p className="text-xs font-bold text-gray-500 uppercase">Event Media</p>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Event Image</label>
                                    <input type="file" accept="image/*" className="w-full text-sm" onChange={e => setImageFile(e.target.files[0])} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Event Video (Optional)</label>
                                    <input type="file" accept="video/*" className="w-full text-sm" onChange={e => setVideoFile(e.target.files[0])} />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-gray-200"></div>
                                    <span className="relative bg-gray-50 px-2 text-xs text-gray-400 font-medium whitespace-nowrap">OR External URL</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <label className="block font-medium text-gray-700">Image URL</label>
                                        <input type="text" className="w-full border rounded p-1" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block font-medium text-gray-700">Video URL</label>
                                        <input type="text" className="w-full border rounded p-1" value={formData.videoUrl} onChange={e => setFormData({ ...formData, videoUrl: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea required rows="3" className="w-full border rounded p-2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-zegen-red text-white rounded hover:bg-red-700">Save Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminEvents;
