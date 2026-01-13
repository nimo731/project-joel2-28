import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Admin = () => {
    const [stats, setStats] = useState({
        sermons: 0,
        events: 0,
        prayers: 0,
        testimonials: 0,
        users: 124 // Mock user count as we might not have an endpoint yet
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = { name: 'Admin User', role: 'admin' }; // Context would provide this

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Parallel fetching for performance
            const [sermonsRes, eventsRes, prayersRes] = await Promise.all([
                api.get('/sermons'),
                api.get('/events'),
                api.get('/prayers')
            ]);

            const sermons = sermonsRes.data.sermons || [];
            const events = eventsRes.data.events || [];
            const prayers = prayersRes.data.prayers || [];

            setStats({
                sermons: sermons.length,
                events: events.length,
                prayers: prayers.length,
                testimonials: 24, // Mock
                users: 156
            });

            // Mock recent activity log
            setRecentActivity([
                { id: 1, action: 'New Prayer Request', user: 'Maria G.', time: '2 mins ago', type: 'prayer' },
                { id: 2, action: 'Sermon Published', user: 'Admin', time: '1 hour ago', type: 'content' },
                { id: 3, action: 'New User Registration', user: 'John D.', time: '3 hours ago', type: 'user' },
                { id: 4, action: 'Event Created', user: 'Admin', time: '5 hours ago', type: 'content' },
            ]);

            setLoading(false);
        } catch (error) {
            console.error('Error loading dashboard:', error);
            setLoading(false);
        }
    };

    const sermonsByCatData = {
        labels: ['Teaching', 'Worship', 'Prayer', 'Special'],
        datasets: [{
            data: [12, 5, 3, 2], // Mock data distribution or calculate from `sermons`
            backgroundColor: ['#1a2b4b', '#d93a3a', '#e2e8f0', '#94a3b8'],
            borderWidth: 0
        }]
    };

    const monthlyGrowthData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'New Users',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: '#1a2b4b',
            },
            {
                label: 'Prayer Requests',
                data: [2, 3, 20, 5, 1, 4],
                backgroundColor: '#d93a3a',
            },
        ],
    };

    if (loading) return <DashboardLayout role="admin" user={user}><div className="p-10">Loading...</div></DashboardLayout>;

    return (
        <DashboardLayout role="admin" user={user}>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Sermons</div>
                    <div className="text-3xl font-bold text-zegen-blue">{stats.sermons}</div>
                    <div className="text-green-500 text-sm mt-2 flex items-center">
                        <span>+12%</span> <span className="text-gray-400 ml-1">from last month</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Events</div>
                    <div className="text-3xl font-bold text-zegen-blue">{stats.events}</div>
                    <div className="text-zegen-red text-sm mt-2 flex items-center">
                        <span className="text-gray-400 ml-1">5 upcoming this week</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Prayer Requests</div>
                    <div className="text-3xl font-bold text-zegen-blue">{stats.prayers}</div>
                    <div className="text-green-500 text-sm mt-2 flex items-center">
                        <span>+24</span> <span className="text-gray-400 ml-1">new today</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Users</div>
                    <div className="text-3xl font-bold text-zegen-blue">{stats.users}</div>
                    <div className="text-green-500 text-sm mt-2 flex items-center">
                        <span>+5%</span> <span className="text-gray-400 ml-1">growth</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="font-bold text-gray-800 mb-4">Engagement Overview</h3>
                    <div className="h-64">
                        <Bar data={monthlyGrowthData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">Sermon Categories</h3>
                    <div className="h-64 flex justify-center">
                        <Doughnut data={sermonsByCatData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Recent Activity</h3>
                    <button className="text-sm text-zegen-blue font-medium hover:underline">View All</button>
                </div>
                <div>
                    {recentActivity.map((item, index) => (
                        <div key={item.id} className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${index !== recentActivity.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full mr-4 ${item.type === 'prayer' ? 'bg-zegen-red' : 'bg-zegen-blue'}`}></div>
                                <div>
                                    <div className="text-sm font-medium text-gray-800">{item.action}</div>
                                    <div className="text-xs text-gray-500">by {item.user}</div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400">{item.time}</div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Admin;
