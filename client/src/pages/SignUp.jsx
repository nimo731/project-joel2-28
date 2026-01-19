import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { FaUserPlus, FaArrowRight, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaEye, FaEyeSlash } from 'react-icons/fa';

const SignUp = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/register', formData);
            if (response.data.success) {
                // Auto login or redirect to login
                alert('Registration successful! Please login.');
                navigate('/login');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col pt-16">

            {/* Header / Hero Section */}
            <div className="bg-[#1a2b4b] text-white py-12 px-6 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-zegen-red opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 relative z-10 text-center">
                    Join Our <span className="text-zegen-red">Family</span>
                </h1>
                <p className="text-gray-300 max-w-lg text-center relative z-10">
                    Create an account to manage your prayer requests, receive message updates, and stay connected with the Joel 2:28 Generation.
                </p>
            </div>

            {/* Form Section */}
            <div className="flex-1 bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-8 transform -translate-y-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <FaUserPlus className="text-zegen-red mr-3" /> Create Account
                    </h2>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-zegen-red text-red-700 p-4 mb-6 rounded shadow-sm">
                            <p className="text-sm font-bold">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-zegen-blue focus:ring-1 focus:ring-zegen-blue transition-colors"
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-zegen-blue focus:ring-1 focus:ring-zegen-blue transition-colors"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-zegen-blue focus:ring-1 focus:ring-zegen-blue transition-colors"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength="6"
                                    className="w-full border border-gray-300 rounded-lg p-3 pr-12 focus:outline-none focus:border-zegen-blue focus:ring-1 focus:ring-zegen-blue transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-zegen-red text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Creating Account...' : (
                                <>
                                    Sign Up <FaArrowRight className="ml-2" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?
                        <Link to="/login" className="text-zegen-blue font-bold ml-1 hover:underline">
                            Login here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
