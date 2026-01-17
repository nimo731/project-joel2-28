import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaBible, FaCalendarAlt, FaPray, FaComments, FaSignOutAlt, FaUserCog, FaTachometerAlt, FaStar, FaUserCircle } from 'react-icons/fa';
import logo from '../assets/logo.png';

import api from '../services/api';

const DashboardLayout = ({ children, role = 'user', user: propUser = null }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [fetchedUser, setFetchedUser] = useState({});
    const navigate = useNavigate();

    // specific user data to use (prop > fetched)
    const user = propUser || fetchedUser;

    React.useEffect(() => {
        if (!propUser) {
            const fetchUserProfile = async () => {
                try {
                    const response = await api.get('/users/profile');
                    if (response.data && response.data.user) {
                        setFetchedUser(response.data.user);
                    }
                } catch (error) {
                    console.error('Failed to fetch user profile for layout', error);
                }
            };
            fetchUserProfile();
        }
    }, [propUser]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        navigate(role === 'admin' ? '/admin/login' : '/login');
    };

    const links = role === 'admin' ? [
        { name: 'Overview', to: '/admin', icon: <FaTachometerAlt /> },
        { name: 'Sermons', to: '/admin/sermons', icon: <FaBible /> },
        { name: 'Events', to: '/admin/events', icon: <FaCalendarAlt /> },
        { name: 'Prayers', to: '/admin/prayers', icon: <FaPray /> },
        { name: 'Testimonies', to: '/admin/testimonies', icon: <FaStar /> },
        { name: 'Messages', to: '/admin/messages', icon: <FaComments /> },
        { name: 'Profile', to: '/admin/profile', icon: <FaUserCog /> },
    ] : [
        { name: 'My Dashboard', to: '/userdashboard', icon: <FaTachometerAlt /> },
        { name: 'My Prayers', to: '/userdashboard/prayers', icon: <FaPray /> },
        { name: 'Messages', to: '/userdashboard/messages', icon: <FaComments /> },
        { name: 'Profile', to: '/userdashboard/profile', icon: <FaUserCog /> },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar - Desktop */}
            <aside className={`fixed inset-y-0 left-0 bg-zegen-blue text-white w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-30 shadow-xl`}>
                <div className="p-6 flex items-center justify-between border-b border-gray-700">
                    <div className="text-xl font-bold font-serif tracking-wide flex items-center gap-2">
                        <img src={logo} alt="Logo" className="h-8 w-8 rounded-full" />
                        <span><span className="text-zegen-red">ZEGEN</span> {role === 'admin' ? 'ADMIN' : 'USER'}</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-300">
                        <FaTimes />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-center mb-8">
                        {/* Show logo for admin ONLY if no profile image is set, otherwise show profile image */}
                        {role === 'admin' && !user.profileImage ? (
                            <div className="w-12 h-12 rounded-full border-2 border-white/20 p-1 mr-3 bg-white/10 overflow-hidden">
                                <img src={logo} alt="Admin Profile" className="w-full h-full object-contain" />
                            </div>
                        ) : user.profileImage ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 shadow-md border-2 border-white/20">
                                <img
                                    src={`${import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5001'}${user.profileImage}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-zegen-red flex items-center justify-center text-lg font-bold mr-3 shadow-md">
                                {user.name ? user.name.charAt(0).toUpperCase() : (role === 'admin' ? 'A' : 'U')}
                            </div>
                        )}
                        <div className="overflow-hidden">
                            <div className="font-semibold text-sm truncate">{user.name || (role === 'admin' ? 'Admin' : 'User')}</div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-tighter">{role} Account</div>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {links.map(link => (
                            <NavLink
                                key={link.name}
                                to={link.to}
                                end={link.to === '/admin' || link.to === '/userdashboard'}
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-zegen-red text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
                                }
                            >
                                <span className="mr-3 text-lg">{link.icon}</span>
                                <span className="font-medium">{link.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
                    <button onClick={handleLogout} className="flex items-center text-gray-400 hover:text-white w-full transition-colors">
                        <FaSignOutAlt className="mr-3" /> Logout
                    </button>
                </div>
            </aside>

            {/* Overaly for mobile sidebar */}
            {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-20 md:hidden"></div>}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10">
                    <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-600 focus:outline-none">
                        <FaBars className="text-xl" />
                    </button>

                    <div className="flex items-center ml-auto space-x-4">
                        <button className="relative p-2 text-gray-500 hover:text-zegen-blue transition-colors">
                            <FaComments className="text-lg" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        </button>
                        <div className="h-8 w-px bg-gray-200 mx-2"></div>
                        <NavLink to="/" className="text-sm font-semibold text-gray-600 hover:text-zegen-blue">
                            View Site <FaHome className="inline ml-1 mb-1" />
                        </NavLink>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
