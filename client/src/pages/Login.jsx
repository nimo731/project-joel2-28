import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { FaLock, FaUser, FaShieldAlt, FaSignInAlt, FaMagic } from 'react-icons/fa';

const Login = () => {
    const [role, setRole] = useState('user'); // 'user' or 'admin'
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Clear tokens on mount
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAutoFill = (type) => {
        if (type === 'admin') {
            setRole('admin');
            setFormData({ email: 'admin@joel228.com', password: 'Joel228@Admin2025' });
        } else {
            setRole('user');
            setFormData({ email: 'patiencekaranjah@gmail.com', password: 'makeit&shineo6' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = role === 'admin' ? '/auth/admin/login' : '/auth/login';

        try {
            const response = await api.post(endpoint, formData);

            if (response.data.success || response.data.status === 'success') {
                const token = response.data.token || response.data.data?.token;
                // Admin login returns user in data.data.user, regular login in data.user
                const user = response.data.data?.user || response.data.user;

                if (!token || !user) {
                    setError('Login response missing required data');
                    return;
                }

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                // Redirect based on role
                if (user.role === 'admin' || role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/userdashboard');
                }
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden">

                {/* Left Side - Visual */}
                <div className="hidden md:flex w-1/2 bg-[#1a2b4b] text-white flex-col justify-center p-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover opacity-10"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-serif font-bold mb-4">Welcome Back</h2>
                        <p className="text-gray-300 mb-8 leading-relaxed">
                            Sign in to access your dashboard, manage prayers, and stay connected with the community.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center text-sm text-gray-300">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3">
                                    <FaShieldAlt />
                                </div>
                                Secure Access
                            </div>
                            <div className="flex items-center text-sm text-gray-300">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3">
                                    <FaLock />
                                </div>
                                Privacy Protected
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Login</h1>
                    </div>

                    {/* Role Toggle */}
                    <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
                        <button
                            onClick={() => setRole('user')}
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${role === 'user' ? 'bg-white text-zegen-blue shadow' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Member
                        </button>
                        <button
                            onClick={() => setRole('admin')}
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${role === 'admin' ? 'bg-white text-zegen-red shadow' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Admin
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 text-center">
                            {error}
                        </div>
                    )}

                    {/* Auto-fill Buttons (For Demo) */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            type="button"
                            onClick={() => handleAutoFill('user')}
                            className="flex items-center justify-center py-2 px-4 bg-blue-50 text-blue-600 text-xs font-bold rounded hover:bg-blue-100 transition"
                        >
                            <FaMagic className="mr-2" /> Fill User
                        </button>
                        <button
                            type="button"
                            onClick={() => handleAutoFill('admin')}
                            className="flex items-center justify-center py-2 px-4 bg-red-50 text-red-600 text-xs font-bold rounded hover:bg-red-100 transition"
                        >
                            <FaMagic className="mr-2" /> Fill Admin
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-zegen-blue focus:ring-1 focus:ring-zegen-blue transition-colors"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-zegen-blue focus:ring-1 focus:ring-zegen-blue transition-colors"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-lg font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 ${role === 'admin' ? 'bg-zegen-red hover:bg-red-700' : 'bg-zegen-blue hover:bg-[#233555]'}`}
                        >
                            {loading ? 'Authenticating...' : (
                                <span className="flex items-center justify-center">
                                    Login <FaSignInAlt className="ml-2" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-bold text-zegen-blue hover:underline">
                                Sign up now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
