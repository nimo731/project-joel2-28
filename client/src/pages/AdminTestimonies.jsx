import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FaCheck, FaTrash, FaQuoteLeft } from 'react-icons/fa';

const AdminTestimonies = () => {
    const [testimonies, setTestimonies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestimonies();
    }, []);

    const fetchTestimonies = async () => {
        try {
            const response = await api.get('/testimonies/admin');
            setTestimonies(response.data.testimonies || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching admin testimonies', error);
            setLoading(false);
        }
    };

    const toggleApproval = async (id) => {
        try {
            await api.patch(`/testimonies/${id}/approve`);
            fetchTestimonies();
        } catch (error) {
            console.error('Toggle approval failed', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this testimony?")) {
            try {
                await api.delete(`/testimonies/${id}`);
                fetchTestimonies();
            } catch (error) {
                console.error('Delete failed', error);
            }
        }
    };

    return (
        <DashboardLayout role="admin">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Testimonies</h1>

            <div className="space-y-4">
                {loading ? (
                    <p className="text-center py-10 text-gray-400">Loading...</p>
                ) : testimonies.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl text-center text-gray-400 italic shadow-sm border border-gray-100">
                        "Testimonials not yet shared"
                    </div>
                ) : testimonies.map(testimony => (
                    <div key={testimony._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-zegen-blue flex items-center justify-center shrink-0">
                            <FaQuoteLeft />
                        </div>
                        <div className="flex-grow">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-gray-800">{testimony.isAnonymous ? 'Anonymous' : (testimony.userId?.name || testimony.name)}</h3>
                                <div className="text-sm text-gray-500">{new Date(testimony.createdAt).toLocaleDateString()}</div>
                            </div>
                            <p className="text-gray-600 mb-4">{testimony.testimony}</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => toggleApproval(testimony._id)}
                                    className={`px-4 py-1 rounded text-sm font-semibold border ${testimony.isApproved ? 'border-green-500 text-green-500' : 'bg-zegen-blue text-white hover:bg-blue-800'}`}
                                >
                                    {testimony.isApproved ? 'Approved' : 'Approve'}
                                </button>
                                <button onClick={() => handleDelete(testimony._id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
};

export default AdminTestimonies;
