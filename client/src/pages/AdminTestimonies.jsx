import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FaCheck, FaTrash, FaQuoteLeft } from 'react-icons/fa';

const AdminTestimonies = () => {
    // Mock data for demo
    const [testimonies, setTestimonies] = useState([
        { id: 1, name: "Alice Johnson", content: "God healed my marriage!", date: "2023-10-22", approved: false },
        { id: 2, name: "Bob Smith", content: "I found peace in the creative ministry.", date: "2023-11-05", approved: true },
    ]);

    const toggleApproval = (id) => {
        setTestimonies(testimonies.map(t =>
            t.id === id ? { ...t, approved: !t.approved } : t
        ));
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this testimony?")) {
            setTestimonies(testimonies.filter(t => t.id !== id));
        }
    };

    return (
        <DashboardLayout role="admin">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Testimonies</h1>

            <div className="space-y-4">
                {testimonies.map(testimony => (
                    <div key={testimony.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-zegen-blue flex items-center justify-center shrink-0">
                            <FaQuoteLeft />
                        </div>
                        <div className="flex-grow">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-gray-800">{testimony.name}</h3>
                                <div className="text-sm text-gray-500">{testimony.date}</div>
                            </div>
                            <p className="text-gray-600 mb-4">{testimony.content}</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => toggleApproval(testimony.id)}
                                    className={`px-4 py-1 rounded text-sm font-semibold border ${testimony.approved ? 'border-green-500 text-green-500' : 'bg-zegen-blue text-white hover:bg-blue-800'}`}
                                >
                                    {testimony.approved ? 'Approved' : 'Approve'}
                                </button>
                                <button onClick={() => handleDelete(testimony.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">
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
