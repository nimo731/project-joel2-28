import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { FaCheck, FaTrash, FaEye } from 'react-icons/fa';

const AdminPrayers = () => {
    const [prayers, setPrayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPrayers();
    }, []);

    const fetchPrayers = async () => {
        try {
            const response = await api.get('/admin/prayers');
            setPrayers(response.data.prayers || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching prayers', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this prayer request?')) return;
        try {
            await api.delete(`/admin/prayers/${id}`);
            setPrayers(prayers.filter(p => p._id !== id));
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.patch(`/admin/prayers/${id}/approve`);
            // Refresh list or update local state
            setPrayers(prayers.map(p =>
                p._id === id ? { ...p, status: 'active' } : p
            ));
            fetchPrayers(); // Refresh to ensure sync
        } catch (error) {
            console.error('Approval failed', error);
        }
    };

    return (
        <DashboardLayout role="admin">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Prayer Requests</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? <p>Loading...</p> : prayers.length === 0 ? (
                    <div className="col-span-2 bg-white p-12 rounded-xl text-center text-gray-400 italic shadow-sm border border-gray-100">
                        "Prayer requests will appear here once submitted"
                    </div>
                ) : prayers.map(prayer => (
                    <div key={prayer._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-gray-800">{prayer.title}</h3>
                                <p className="text-sm text-gray-500">{new Date(prayer.createdAt).toLocaleDateString()} by {prayer.isAnonymous ? 'Anonymous' : prayer.authorName}</p>
                            </div>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded uppercase">Pending</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-6 flex-grow">{prayer.content}</p>
                        <div className="flex gap-2 mt-auto border-t border-gray-100 pt-4">
                            <button onClick={() => handleApprove(prayer._id)} className="flex-1 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded font-semibold text-sm flex items-center justify-center">
                                <FaCheck className="mr-2" /> Approve
                            </button>
                            <button onClick={() => handleDelete(prayer._id)} className="flex-1 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded font-semibold text-sm flex items-center justify-center">
                                <FaTrash className="mr-2" /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
};

export default AdminPrayers;
