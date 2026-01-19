import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FaSave, FaUserCircle, FaCamera, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../services/api';
import logo from '../assets/logo.png';

const UserProfile = () => {
    // Try to get initial role from localStorage for immediate UI consistency
    const getInitialRole = () => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const isAdminRoute = window.location.pathname.startsWith('/admin');
        return storedUser.role || (isAdminRoute ? 'admin' : 'member');
    };

    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        bio: '',
        role: getInitialRole(),
        profileImage: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false
    });
    const [changingPassword, setChangingPassword] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/profile');
            const userData = response.data.user;
            if (userData) {
                setUser({
                    name: userData.name || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    bio: userData.bio || '',
                    role: userData.role || getInitialRole(),
                    profileImage: userData.profileImage || ''
                });
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage({ type: 'error', text: 'Failed to load profile details. Please try logging in again.' });
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Please select an image file.' });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Image must be less than 5MB.' });
            return;
        }

        // Create preview URL immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            setPreviewUrl(result);
            // Also update the user state so the sidebar shows the preview
            setUser(prev => ({ ...prev, profileImage: result }));
        };
        reader.readAsDataURL(file);

        setUploadingPhoto(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const response = await api.post('/users/profile/photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Check if we got a valid URL back
            const newImageUrl = response.data.profileImage;
            if (newImageUrl && (newImageUrl.startsWith('http') || newImageUrl.startsWith('/'))) {
                setUser(prev => ({ ...prev, profileImage: newImageUrl }));
                setPreviewUrl(null); // Clear preview, use real URL
                setMessage({ type: 'success', text: 'Profile photo updated!' });
            } else {
                // Invalid URL returned, keep preview
                setMessage({ type: 'warning', text: 'Photo uploaded but may not persist. Please configure Cloudinary.' });
            }
        } catch (error) {
            console.error('Photo upload failed:', error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to upload photo.' });
            // Keep the preview even if upload failed
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await api.patch('/users/profile', {
                name: user.name,
                phone: user.phone,
                bio: user.bio
            });
            setUser(prev => ({ ...prev, ...response.data.user }));
            // Update localStorage
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...storedUser, name: user.name }));

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error('Profile update failed:', error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setMessage({ type: 'error', text: 'New passwords do not match.' });
        }
        setChangingPassword(true);
        setMessage({ type: '', text: '' });
        try {
            await api.patch('/users/profile/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error('Password update failed:', error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password.' });
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="user">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zegen-red"></div>
                </div>
            </DashboardLayout>
        );
    }

    const isAdmin = user.role === 'admin';
    // Get base URL from API_URL (remove /api/v1) or fallback to localhost
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
    const backendUrl = apiUrl.replace('/api/v1', '');

    return (
        <DashboardLayout role={isAdmin ? "admin" : "user"} user={user}>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h1>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {message.text}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="relative mb-2">
                            {isAdmin ? (
                                <div className="h-24 w-24 rounded-full border-4 border-zegen-red/20 overflow-hidden bg-black p-3">
                                    <img src="/joel228-logo.png" alt="Admin" className="h-full w-full object-contain" />
                                </div>
                            ) : previewUrl ? (
                                <div className="h-24 w-24 rounded-full border-4 border-zegen-blue/20 overflow-hidden bg-gray-50">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ) : user.profileImage ? (
                                <div className="h-24 w-24 rounded-full border-4 border-zegen-blue/20 overflow-hidden bg-gray-50">
                                    <img
                                        src={user.profileImage.startsWith('http') || user.profileImage.startsWith('data:') ? user.profileImage : `${backendUrl}${user.profileImage}`}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.parentElement.innerHTML = `<div class="h-full w-full bg-zegen-red flex items-center justify-center text-4xl font-bold text-white">${user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>`;
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="h-24 w-24 rounded-full border-4 border-zegen-blue/20 bg-zegen-red flex items-center justify-center text-4xl font-bold text-white">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}
                            {!isAdmin && (
                                <>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handlePhotoUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingPhoto}
                                        className={`absolute bottom-0 right-0 bg-zegen-blue text-white p-2 rounded-full text-xs shadow-md border-2 border-white hover:bg-700 transition-colors ${uploadingPhoto ? 'opacity-50 cursor-wait' : ''}`}
                                    >
                                        {uploadingPhoto ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <FaCamera className="text-sm" />
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                        {isAdmin && (
                            <span className="text-xs font-bold text-zegen-red uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full">
                                Official Admin Profile
                            </span>
                        )}
                        {!isAdmin && (
                            <p className="text-xs text-gray-400 mt-2">Click the camera icon to upload a photo</p>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* ... existing fields ... */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={user.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-zegen-blue outline-none border-gray-200"
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
                                    className="w-full border rounded-lg p-3 text-gray-500 bg-gray-50 cursor-not-allowed border-gray-200"
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
                                placeholder="+254..."
                                className="w-full border rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-zegen-blue outline-none border-gray-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Ministry Note</label>
                            <textarea
                                name="bio"
                                value={user.bio}
                                onChange={handleChange}
                                rows="3"
                                placeholder="A brief note about your walk with Christ..."
                                className="w-full border rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-zegen-blue outline-none border-gray-200"
                            ></textarea>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className={`bg-zegen-red hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2 ${saving ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>

                    {/* Change Password Section */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FaLock className="text-zegen-red" /> Change Password
                        </h2>
                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.current ? "text" : "password"}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        required
                                        className="w-full border rounded-lg p-3 pr-12 text-gray-700 focus:ring-2 focus:ring-zegen-blue outline-none border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                        className="absolute right-3 top-3 text-gray-400"
                                    >
                                        {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? "text" : "password"}
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            required
                                            minLength="6"
                                            className="w-full border rounded-lg p-3 pr-12 text-gray-700 focus:ring-2 focus:ring-zegen-blue outline-none border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                            className="absolute right-3 top-3 text-gray-400"
                                        >
                                            {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        required
                                        className="w-full border rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-zegen-blue outline-none border-gray-200"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={changingPassword}
                                    className={`bg-zegen-blue hover:bg-[#233555] text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-all ${changingPassword ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {changingPassword ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout >
    );
};

export default UserProfile;
