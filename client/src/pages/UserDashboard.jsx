import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { FaPlus, FaPray, FaComments } from 'react-icons/fa';

const UserDashboard = () => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : { name: 'User', role: 'user', email: '' };
    });
    const [myPrayers, setMyPrayers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch user data if needed or rely on stored User
                // const userRes = await api.get('/auth/me'); 
                // setUser(userRes.data);

                // Fetch Prayers (limit 3 for preview)
                const prayersRes = await api.get('/prayers/my');
                setMyPrayers(prayersRes.data.prayers ? prayersRes.data.prayers.slice(0, 3) : []);

                // Fetch Messages (limit 3)
                const messagesRes = await api.get('/messages');
                setMessages(messagesRes.data.messages ? messagesRes.data.messages.slice(0, 3) : []);

                setLoading(false);
            } catch (error) {
                console.error('Error loading dashboard data', error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <DashboardLayout role="user" user={user}><div className="p-10">Loading dashboard...</div></DashboardLayout>;

    return (
        <DashboardLayout role="user" user={user}>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="text-gray-500">Manage your prayers and stay connected.</p>
                </div>
                <button
                    onClick={() => navigate('/userdashboard/prayers')}
                    className="bg-zegen-red text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center"
                >
                    <FaPlus className="mr-2" /> New Prayer Request
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">

                    {/* My Prayers Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 flex items-center">
                                <FaPray className="text-zegen-blue mr-2" /> My Recent Requests
                            </h3>
                            <button onClick={() => navigate('/userdashboard/prayers')} className="text-sm text-zegen-blue hover:underline">View All</button>
                        </div>
                        <div>
                            {myPrayers.length === 0 ? (
                                <div className="p-6 text-gray-500 text-center">No prayer requests yet.</div>
                            ) : myPrayers.map((prayer) => (
                                <div key={prayer._id} className="p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-800">{prayer.title}</h4>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${prayer.status === 'answered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {prayer.status || 'Active'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{prayer.request}</p>
                                    <div className="text-xs text-gray-400">{new Date(prayer.createdAt).toLocaleDateString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Sidebar Area */}
                <div className="space-y-8">
                    {/* Messages Widget */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800 flex items-center">
                                <FaComments className="text-zegen-blue mr-2" /> Messages
                            </h3>
                        </div>
                        <div>
                            {messages.length === 0 ? (
                                <div className="p-6 text-gray-500 text-center">No messages.</div>
                            ) : messages.map(msg => (
                                <div key={msg._id} className="p-5 border-b border-gray-100 last:border-0 bg-blue-50/50">
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span className="font-bold text-zegen-blue">{msg.sender?.name || 'Admin'}</span>
                                        <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="font-medium text-gray-800 text-sm mb-1">{msg.subject}</div>
                                    <p className="text-gray-600 text-xs line-clamp-2">{msg.content}</p>
                                </div>
                            ))}
                            <button
                                onClick={() => navigate('/userdashboard/messages')}
                                className="w-full py-3 text-center text-sm font-bold text-zegen-red hover:bg-gray-50 transition-colors"
                            >
                                View All Messages
                            </button>
                        </div>
                    </div>

                    {/* Profile Summary */}
                    <div className="bg-zegen-blue text-white rounded-xl shadow-lg p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                        <h3 className="font-bold text-lg mb-1">{user.name}</h3>
                        <p className="text-blue-200 text-sm mb-4">{user.email}</p>
                        <div className="flex space-x-2">
                            <button onClick={() => navigate('/userdashboard/profile')} className="text-xs bg-white/20 hover:bg-white/30 transition px-3 py-1 rounded">Edit Profile</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserDashboard;
