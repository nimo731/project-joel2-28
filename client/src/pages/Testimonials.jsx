import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { FaQuoteLeft, FaStar, FaCommentDots, FaHeart, FaRegHeart } from 'react-icons/fa';
import EmptyState from '../components/EmptyState';

const Testimonials = () => {
    const navigate = useNavigate();
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const fetchTestimonials = async () => {
        try {
            const response = await api.get('/testimonies');
            setTestimonials(response.data.testimonies || []);
        } catch (err) {
            console.error('Error fetching testimonials:', err);
            setTestimonials([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleToggleLike = async (id) => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        try {
            const response = await api.post(`/testimonies/${id}/like`);
            if (response.data.success) {
                // Update local state to show updated likes immediately
                setTestimonials(prev => prev.map(t => {
                    if (t._id === id) {
                        const liked = response.data.liked;
                        const newLikedBy = liked
                            ? [...(t.likedBy || []), currentUser.id || currentUser._id]
                            : (t.likedBy || []).filter(uid => uid !== (currentUser.id || currentUser._id));

                        return {
                            ...t,
                            likes: response.data.likes,
                            likedBy: newLikedBy
                        };
                    }
                    return t;
                }));
            }
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };

    const handleSubmitTestimony = () => {
        alert('Testimony submission is handled in your member dashboard.');
        navigate('/userdashboard');
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Hero Header */}
            <div className="bg-zegen-blue text-white pt-24 pb-16 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Stories of Grace</h1>
                <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                    Real stories from real people about how God is moving in their lives.
                </p>
            </div>

            {/* Testimonials Grid */}
            <div className={`max-w-7xl mx-auto px-4 ${testimonials.length > 0 ? '-mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : ''}`}>
                {loading ? (
                    <div className="text-center py-20 text-gray-500 col-span-full">Loading testimonials...</div>
                ) : testimonials.length === 0 ? (
                    <EmptyState
                        message="Testimonials not yet shared"
                        icon={FaCommentDots}
                    />
                ) : testimonials.map(t => {
                    const isLiked = currentUser && t.likedBy?.includes(currentUser.id || currentUser._id);

                    return (
                        <div key={t._id} className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 relative group border border-gray-100 flex flex-col">
                            <FaQuoteLeft className="text-4xl text-zegen-red/10 absolute top-6 left-6" />

                            <div className="flex items-center mb-6 relative z-10">
                                <img
                                    src={t.userId?.profileImage || t.avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                                    alt={t.name || t.userId?.name}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm mr-4"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900">{t.name || t.userId?.name}</h4>
                                    <p className="text-xs text-zegen-red font-semibold uppercase tracking-wide">{t.category || 'Member'}</p>
                                </div>
                            </div>

                            <div className="flex text-yellow-400 text-sm mb-4">
                                {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                            </div>

                            <p className="text-gray-600 italic leading-relaxed relative z-10 flex-grow">
                                "{t.testimony}"
                            </p>

                            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                                <button
                                    onClick={() => handleToggleLike(t._id)}
                                    className={`flex items-center gap-2 text-sm font-semibold transition-colors ${isLiked ? 'text-zegen-red' : 'text-gray-400 hover:text-zegen-red'}`}
                                >
                                    {isLiked ? <FaHeart /> : <FaRegHeart />}
                                    <span>{t.likes || 0} Likes</span>
                                </button>
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                                    {new Date(t.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* CTA / Submission Section */}
            <div className="max-w-4xl mx-auto px-4 mt-20 text-center">
                <h3 className="text-2xl font-serif font-bold text-gray-800 mb-4">Have a story to share?</h3>
                <p className="text-gray-600 mb-8">
                    Your testimony can encourage someone else. We'd love to hear how God is working in your life.
                </p>

                {!localStorage.getItem('token') ? (
                    <Link
                        to="/login"
                        className="inline-block px-8 py-3 bg-zegen-red text-white font-bold rounded-full shadow-lg hover:bg-red-700 hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                        Add Your Testimony
                    </Link>
                ) : (
                    <button
                        onClick={handleSubmitTestimony}
                        className="px-8 py-3 bg-zegen-red text-white font-bold rounded-full shadow-lg hover:bg-red-700 hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                        Submit Your Testimony
                    </button>
                )}
            </div>
        </div>
    );
};

export default Testimonials;
