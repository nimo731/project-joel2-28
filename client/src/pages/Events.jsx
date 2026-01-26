import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaCalendar, FaMapMarkerAlt, FaClock, FaSearch, FaTicketAlt } from 'react-icons/fa';
import EmptyState from '../components/EmptyState';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [pagination, setPagination] = useState({ page: 1, pages: 1 });

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        if (filter === 'all') {
            setFilteredEvents(events);
        } else {
            setFilteredEvents(events.filter(e => e.category === filter));
        }
    }, [events, filter]);

    const fetchEvents = async (page = 1) => {
        try {
            setLoading(page === 1); // Only show full loader for first page
            const response = await api.get(`/events?page=${page}&limit=10`);
            const newEvents = response.data.events || [];

            if (page === 1) {
                setEvents(newEvents);
            } else {
                setEvents(prev => [...prev, ...newEvents]);
            }

            if (response.data.pagination) {
                setPagination(response.data.pagination);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching events:', err);
            if (page === 1) setEvents([]);
            setLoading(false);
        }
    };

    const formatDate = (dateString, type) => {
        const date = new Date(dateString);
        if (type === 'day') return date.getDate();
        if (type === 'month') return date.toLocaleString('default', { month: 'short' }).toUpperCase();
        if (type === 'full') return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        if (type === 'time') return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const categories = ['all', 'service', 'tongues fest', 'outreach', 'prayer', 'worship'];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Header */}
            <div className="bg-zegen-blue text-white pt-24 pb-12 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-zegen-red opacity-10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Upcoming Events</h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                        Gather with us. Connect, serve, and grow together in fellowship.
                    </p>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="max-w-7xl mx-auto px-4 mt-8 overflow-x-auto">
                <div className="flex justify-center flex-wrap gap-3 pb-4">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 capitalize
                                ${filter === cat
                                    ? 'bg-zegen-red text-white shadow-md transform scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-5xl mx-auto px-4 mt-8">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zegen-red"></div>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <EmptyState
                        message="No events available yet"
                        icon={FaCalendar}
                    />
                ) : (
                    <div className="space-y-6">
                        {filteredEvents.map(event => (
                            <div key={event._id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col md:flex-row group">
                                {/* Date Badge (Left Side - Desktop) */}
                                <div className="hidden md:flex flex-col items-center justify-center bg-zegen-blue text-white w-32 p-4 shrink-0">
                                    <span className="text-3xl font-bold">{formatDate(event.date, 'day')}</span>
                                    <span className="text-sm font-bold tracking-wider">{formatDate(event.date, 'month')}</span>
                                </div>

                                {/* Image (Mobile Top / Desktop Left) */}
                                <div className="h-48 md:h-auto md:w-64 shrink-0 relative overflow-hidden">
                                    {event.imageUrl && !event.imageUrl.includes('undefined') ? (
                                        <img
                                            src={event.imageUrl.startsWith('http') ? event.imageUrl : `${api.defaults.baseURL.replace('/api/v1', '')}${event.imageUrl}`}
                                            alt={event.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <FaCalendar className="text-gray-400 text-4xl" />
                                        </div>
                                    )}
                                    {/* Mobile Date Badge */}
                                    <div className="absolute top-4 left-4 md:hidden bg-white/95 text-zegen-blue p-2 rounded shadow-lg text-center min-w-[60px]">
                                        <div className="text-xl font-bold leading-none">{formatDate(event.date, 'day')}</div>
                                        <div className="text-xs font-bold uppercase">{formatDate(event.date, 'month')}</div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-grow flex flex-col justify-center">
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
                                        <span className="flex items-center text-zegen-red font-medium">
                                            <FaClock className="mr-2" />
                                            {formatDate(event.date, 'time')}
                                        </span>
                                        <span className="flex items-center">
                                            <FaMapMarkerAlt className="mr-2 text-gray-400" />
                                            {event.location}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3 group-hover:text-zegen-blue transition-colors">
                                        {event.title}
                                    </h3>

                                    <p className="text-gray-600 mb-6 line-clamp-2">
                                        {event.description}
                                    </p>

                                    <div className="mt-auto">
                                        <button
                                            onClick={() => alert(`RSVP functionality for "${event.title}" will be available soon!`)}
                                            className="inline-flex items-center px-6 py-2 bg-gray-100 hover:bg-zegen-red hover:text-white text-gray-700 font-semibold rounded-lg transition-colors duration-300"
                                        >
                                            <FaTicketAlt className="mr-2" />
                                            RSVP / Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Load More Button */}
            {!loading && pagination.page < pagination.pages && (
                <div className="flex justify-center mt-12 px-4 shadow-sm">
                    <button
                        onClick={() => fetchEvents(pagination.page + 1)}
                        className="px-10 py-3 bg-zegen-blue text-white font-bold rounded-lg hover:bg-blue-900 transition-all transform hover:-translate-y-1"
                    >
                        Load More Events
                    </button>
                </div>
            )}
        </div>
    );
};

export default Events;
