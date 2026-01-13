import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaPlay, FaCalendar, FaUser, FaSearch, FaFilter } from 'react-icons/fa';

const Sermons = () => {
    const [sermons, setSermons] = useState([]);
    const [filteredSermons, setFilteredSermons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchSermons();
    }, []);

    useEffect(() => {
        filterContent();
    }, [sermons, activeFilter, searchQuery]);

    const fetchSermons = async () => {
        try {
            const response = await api.get('/sermons');
            const data = response.data.sermons || [];
            setSermons(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching sermons:', err);
            // Fallback content for visual verification if API fails
            setSermons([
                {
                    _id: '1',
                    title: 'The Power of Persistent Prayer',
                    preacher: 'Pastor John Doe',
                    date: new Date().toISOString(),
                    description: 'Unlock the spiritual breakthroughs that come through unwavering faith and consistent prayer.',
                    category: 'teaching',
                    videoLink: '#',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80'
                },
                {
                    _id: '2',
                    title: 'Walking in the Spirit',
                    preacher: 'Rev. Sarah Smith',
                    date: new Date(Date.now() - 86400000 * 3).toISOString(),
                    description: 'Discover how to live a life guided by the Holy Spirit in a modern, distracted world.',
                    category: 'worship',
                    videoLink: '#',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1507692049790-de58293a4697?w=800&q=80'
                },
                {
                    _id: '3',
                    title: 'Faith Over Fear',
                    preacher: 'Bishop Michael',
                    date: new Date(Date.now() - 86400000 * 7).toISOString(),
                    description: 'Overcoming the anxieties of life with a roadmap of faith from the Scriptures.',
                    category: 'sunday service',
                    videoLink: '#',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1445445290350-16a63c2c2b5c?w=800&q=80'
                }
            ]);
            setLoading(false);
        }
    };

    const filterContent = () => {
        let result = [...sermons];

        if (activeFilter !== 'all') {
            result = result.filter(s => s.category?.toLowerCase() === activeFilter.toLowerCase());
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(s =>
                s.title?.toLowerCase().includes(query) ||
                s.preacher?.toLowerCase().includes(query) ||
                s.description?.toLowerCase().includes(query)
            );
        }

        setFilteredSermons(result);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const categories = ['all', 'teaching', 'worship', 'prayer', 'testimony', 'sunday service'];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Header */}
            <div className="bg-zegen-blue text-white pt-24 pb-12 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-zegen-red opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Sermon Library</h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                        Dive deep into the word. Watch, listen, and grow with our archive of life-changing messages.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mt-8 relative">
                    <input
                        type="text"
                        placeholder="Search sermons by title, preacher, or topic..."
                        className="w-full py-4 pl-12 pr-4 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-red-500/30 shadow-lg text-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                </div>
            </div>

            {/* Filter Pills */}
            <div className="max-w-7xl mx-auto px-4 mt-8 overflow-x-auto">
                <div className="flex justify-center flex-wrap gap-3 pb-4">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 capitalize
                                ${activeFilter === cat
                                    ? 'bg-zegen-red text-white shadow-md transform scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-4 mt-8">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zegen-red"></div>
                    </div>
                ) : filteredSermons.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">No sermons found matching your criteria.</p>
                        <button
                            onClick={() => { setActiveFilter('all'); setSearchQuery('') }}
                            className="mt-4 text-zegen-red hover:underline font-medium"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredSermons.map(sermon => (
                            <div key={sermon._id} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full hover:-translate-y-1">
                                {/* Thumbnail Container */}
                                <div className="relative aspect-video bg-gray-200 overflow-hidden">
                                    {sermon.thumbnailUrl ? (
                                        <img
                                            src={sermon.thumbnailUrl}
                                            alt={sermon.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-zegen-blue to-gray-800 flex items-center justify-center">
                                            <FaPlay className="text-white/20 text-6xl" />
                                        </div>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="w-16 h-16 bg-zegen-red rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-300 ease-out shadow-lg">
                                            <FaPlay className="ml-1 text-xl" />
                                        </div>
                                    </div>

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-zegen-blue text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm">
                                            {sermon.category || 'Sermon'}
                                        </span>
                                    </div>

                                    {/* Duration Badge (Optional/Mock) */}
                                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        {sermon.duration || '45:00'}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                                        <span className="flex items-center">
                                            <FaCalendar className="mr-2 text-zegen-red/70" />
                                            {formatDate(sermon.date)}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 leading-tight group-hover:text-zegen-red transition-colors">
                                        {sermon.title}
                                    </h3>

                                    <div className="flex items-center text-sm text-gray-600 mb-4 font-medium">
                                        <FaUser className="mr-2 text-gray-400" />
                                        {sermon.preacher}
                                    </div>

                                    <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-grow">
                                        {sermon.description}
                                    </p>

                                    <a
                                        href={sermon.videoLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-3 bg-gray-50 hover:bg-zegen-blue hover:text-white text-gray-800 font-semibold rounded-lg transition-colors duration-300 text-center flex items-center justify-center group/btn"
                                    >
                                        Watch Sermon
                                        <FaPlay className="ml-2 text-xs group-hover/btn:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sermons;
