import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FaSave, FaUserCircle } from 'react-icons/fa';

const UserProfile = () => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : {
            name: 'Sister Grace',
            email: 'grace@example.com',
            phone: '+1 234 567 8900',
            bio: 'member of the choir.'
        };
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Profile updated! (Mock)');
    };

    return (
        <DashboardLayout role="user" user={user}>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center justify-center mb-8">
                        <div className="relative">
                            <FaUserCircle className="text-gray-300 text-6xl" />
                            <button className="absolute bottom-0 right-0 bg-zegen-blue text-white p-1 rounded-full text-xs shadow-md">
                                Edit
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={user.name}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-zegen-blue outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    disabled
                                    className="w-full border rounded-lg p-3 text-gray-500 bg-gray-50 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={user.phone}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-zegen-blue outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Ministry Note</label>
                            <textarea
                                name="bio"
                                value={user.bio}
                                onChange={handleChange}
                                rows="3"
                                className="w-full border rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-zegen-blue outline-none"
                            ></textarea>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button type="submit" className="bg-zegen-red hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold shadow-md transition-all flex items-center">
                                <FaSave className="mr-2" /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserProfile;
