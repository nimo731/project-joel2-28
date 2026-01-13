import React from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/hero-community.png';
import { FaDove, FaClock, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';

const Home = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative h-[85vh] flex items-center justify-center text-center text-white overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img src={heroBg} alt="Worship" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#1a2b4b] opacity-80 mix-blend-multiply"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 px-4 max-w-4xl mx-auto flex flex-col items-center">
                    <FaDove className="text-4xl mb-4 text-white opacity-80" />
                    <p className="text-zegen-red text-sm font-bold tracking-[0.2em] uppercase mb-4">
                        THE JOEL 2:28 GENERATION
                    </p>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        "And it shall come to pass afterward, that I will pour out my spirit upon all flesh"
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
                        Joel 2:28 - A Prayer Group Ministry Dedicated to Intercession and Spiritual Growth
                    </p>
                    <Link to="/contact" className="bg-zegen-red text-white px-8 py-4 rounded font-bold uppercase tracking-wider hover:bg-red-700 transition transform hover:-translate-y-1 shadow-lg">
                        Contact Us
                    </Link>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-zegen-red text-sm font-bold tracking-[0.2em] uppercase mb-2">About Us</p>
                        <h2 className="text-4xl font-bold text-[#1a2b4b] mb-4 font-serif">THE JOEL 2:28 GENERATION</h2>
                        <div className="w-16 h-1 bg-zegen-red mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Mission */}
                        <div className="bg-white p-8 rounded-xl shadow-md border-b-4 border-zegen-red hover:shadow-xl transition">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Our Mission</h3>
                            <p className="text-gray-600 leading-relaxed">
                                A well where we gather to contend for our generation as we experience Christ through prayers. For men always ought to pray. We are THE JOEL 2:28 GENERATION, experiencing the outpouring of God's Spirit.
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="bg-white p-8 rounded-xl shadow-md border-b-4 border-zegen-blue hover:shadow-xl transition">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Our Vision</h3>
                            <p className="text-gray-600 leading-relaxed">
                                To see lives transformed through the power of prayer and to witness God's Spirit moving in our generation, fulfilling His promise to pour out His Spirit upon all flesh.
                            </p>
                        </div>
                    </div>

                    <div className="text-center mt-10">
                        <Link to="/about" className="bg-[#1a2b4b] text-white px-8 py-3 rounded font-bold uppercase tracking-wider hover:bg-blue-900 transition">
                            Learn More About Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
