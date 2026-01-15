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
        users: 0,
        pendingTestimonies: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = JSON.parse(localStorage.getItem('user')) || { name: 'Admin', role: 'admin' };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/admin/dashboard');
            const { stats: backendStats } = response.data;

            setStats({
                sermons: backendStats.totalSermons || 0,
                events: backendStats.totalEvents || 0,
                prayers: backendStats.totalPrayers || 0,
                testimonials: backendStats.totalTestimonies || 0,
                users: backendStats.totalUsers || 0,
                pendingTestimonies: backendStats.pendingTestimonies || 0
            });

            // Activity is empty for now as requested for a fresh start
            setRecentActivity([]);

            setLoading(false);
        } catch (error) {
            console.error('Error loading dashboard:', error);
            setLoading(false);
        }
    };

    const sermonsByCatData = {
        labels: ['Teaching', 'Worship', 'Prayer', 'Special'],
        datasets: [{
            data: [stats.sermons, 0, 0, 0],
            backgroundColor: ['#1a2b4b', '#d93a3a', '#e2e8f0', '#94a3b8'],
            borderWidth: 0
        }]
    };

    const monthlyGrowthData = {
        labels: ['Current'],
        datasets: [
            {
                label: 'Users',
                data: [stats.users],
                backgroundColor: '#1a2b4b',
            },
            {
                label: 'Prayers',
                data: [stats.prayers],
                backgroundColor: '#d93a3a',
            },
        ],
    };

    if (loading) return <DashboardLayout role="admin" user={currentUser}><div className="p-10 text-center">Loading dashboard data...</div></DashboardLayout>;

    return (
        <DashboardLayout role="admin" user={currentUser}>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back, {currentUser.name}. Here's what's happening today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Sermons</div>
                    <div className="text-3xl font-bold text-zegen-blue">{stats.sermons}</div>
                    <div className="text-gray-400 text-xs mt-2 font-bold uppercase tracking-widest">Live Archive</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Events</div>
                    <div className="text-3xl font-bold text-zegen-blue">{stats.events}</div>
                    <div className="text-gray-400 text-xs mt-2 font-bold uppercase tracking-widest">Scheduled</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Prayer Requests</div>
                    <div className="text-3xl font-bold text-zegen-blue">{stats.prayers}</div>
                    <div className="text-gray-400 text-xs mt-2 font-bold uppercase tracking-widest">Private Wall</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Testimonials</div>
                    <div className="text-3xl font-bold text-zegen-blue">{stats.testimonials}</div>
                    <div className={`text-xs mt-2 font-bold uppercase tracking-widest ${stats.pendingTestimonies > 0 ? 'text-zegen-red' : 'text-gray-400'}`}>
                        {stats.pendingTestimonies} PENDING APPROVAL
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="font-bold text-gray-800 mb-4">Engagement Overview</h3>
                    <div className="h-64">
                        {stats.users === 0 && stats.prayers === 0 ? (
                            <div className="h-full flex items-center justify-center text-gray-400 italic">No engagement data yet</div>
                        ) : (
                            <Bar data={monthlyGrowthData} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
                        )}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">Sermon Spread</h3>
                    <div className="h-64 flex flex-col justify-center items-center">
                        {stats.sermons === 0 ? (
                            <div className="text-gray-400 italic font-medium">No sermons uploaded</div>
                        ) : (
                            <Doughnut data={sermonsByCatData} options={{ maintainAspectRatio: false }} />
                        )}
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
                    {recentActivity.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 italic">No recent activity to show.</div>
                    ) : (
                        recentActivity.map((item, index) => (
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
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Admin;
