import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const Testimonials = () => {
    // Ideally fetch from API, for now placeholders match the prompt's simplicity
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        // Mock fetch or real API call
        setTestimonials([
            {
                id: 1,
                name: "Maria Garcia",
                role: "Member since 2018",
                content: "This church has been a home for my family. The community is so welcoming and the teachings have truly helped us grow in our faith.",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
            },
            {
                id: 2,
                name: "James Wilson",
                role: "Youth Leader",
                content: "I've seen so many lives changed here. It's a place where you can come as you are and leave transformed by God's love.",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
            },
            {
                id: 3,
                name: "Sarah Jenkins",
                role: "Visitor",
                content: "The worship atmosphere is incredible. I felt the presence of God from the moment I walked through the doors.",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg"
            }
        ]);
    }, []);

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
            <div className="max-w-7xl mx-auto px-4 -mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map(t => (
                    <div key={t.id} className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 relative group border border-gray-100">
                        <FaQuoteLeft className="text-4xl text-zegen-red/10 absolute top-6 left-6" />

                        <div className="flex items-center mb-6 relative z-10">
                            <img
                                src={t.avatar}
                                alt={t.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm mr-4"
                            />
                            <div>
                                <h4 className="font-bold text-gray-900">{t.name}</h4>
                                <p className="text-xs text-zegen-red font-semibold uppercase tracking-wide">{t.role}</p>
                            </div>
                        </div>

                        <div className="flex text-yellow-400 text-sm mb-4">
                            {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                        </div>

                        <p className="text-gray-600 italic leading-relaxed relative z-10">
                            "{t.content}"
                        </p>
                    </div>
                ))}
            </div>

            {/* CTA / Submission Section */}
            <div className="max-w-4xl mx-auto px-4 mt-20 text-center">
                <h3 className="text-2xl font-serif font-bold text-gray-800 mb-4">Have a story to share?</h3>
                <p className="text-gray-600 mb-8">
                    Your testimony can encourage someone else. We'd love to hear how God is working in your life.
                </p>
                <button className="px-8 py-3 bg-zegen-red text-white font-bold rounded-full shadow-lg hover:bg-red-700 hover:shadow-xl transition-all transform hover:-translate-y-1">
                    Submit Your Testimony
                </button>
            </div>
        </div>
    );
};

export default Testimonials;
