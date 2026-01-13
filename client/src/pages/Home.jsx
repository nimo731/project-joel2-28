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
                        We help you get things done
                    </p>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        GOD GIVES US POWER
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt ut labore et dolore magna aliqua quis nostrud ullamco nisi.
                    </p>
                    <Link to="/prayers" className="bg-zegen-red text-white px-8 py-4 rounded font-bold uppercase tracking-wider hover:bg-red-700 transition transform hover:-translate-y-1 shadow-lg">
                        Contact Us
                    </Link>
                </div>
            </section>

            {/* Overlapping Cards Section */}
            <section className="relative z-20 -mt-24 pb-20 px-4">
                <div className="container mx-auto grid md:grid-cols-2 gap-8 max-w-5xl">

                    {/* Card 1 */}
                    <div className="bg-white rounded-lg shadow-xl p-8 flex items-start gap-6 transform transition hover:-translate-y-2">
                        <div className="flex-shrink-0 bg-red-100 text-zegen-red rounded-lg p-3 text-center min-w-[80px]">
                            <FaClock className="mx-auto text-xl mb-1" />
                            <span className="block text-xs font-bold uppercase">Mar 3</span>
                            <span className="block text-sm font-bold bg-zegen-red text-white rounded px-1 mt-1">7:00 am</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Event: Reflect The Community And Serving</h3>
                            <Link to="/events" className="text-zegen-red text-sm font-bold uppercase underline decoration-2 underline-offset-4 hover:text-red-800">
                                Event Details
                            </Link>
                        </div>
                        <FaChevronRight className="ml-auto text-gray-300 text-6xl opacity-20" />
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-lg shadow-xl p-8 flex items-start gap-6 transform transition hover:-translate-y-2">
                        <div className="flex-shrink-0 bg-red-100 text-zegen-red rounded-lg p-3 text-center min-w-[80px]">
                            <FaCalendarAlt className="mx-auto text-xl mb-1" />
                            <span className="block text-xs font-bold uppercase">Apr 15</span>
                            <span className="block text-sm font-bold bg-zegen-red text-white rounded px-1 mt-1">8:00 am</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Our Sponsorship Meetup Will Be Held Again</h3>
                            <Link to="/events" className="text-zegen-red text-sm font-bold uppercase underline decoration-2 underline-offset-4 hover:text-red-800">
                                Event Details
                            </Link>
                        </div>
                        <FaChevronRight className="ml-auto text-gray-300 text-6xl opacity-20" />
                    </div>

                </div>
            </section>

            {/* About Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <p className="text-zegen-red text-sm font-bold tracking-[0.2em] uppercase mb-2">About Us</p>
                        <h2 className="text-4xl font-bold text-[#1a2b4b] mb-6 leading-tight">
                            We are Taking Small Steps to Make Earth Better Planet
                        </h2>
                        <div className="w-16 h-1 bg-zegen-red mb-6"></div>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            We help you get things done. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {['Place of Heaven', 'Study Bible', 'Friendly Place', 'Music & Art'].map(item => (
                                <li key={item} className="flex items-center gap-3 text-gray-700 font-medium">
                                    <span className="w-2 h-2 rounded-full bg-zegen-red"></span> {item}
                                </li>
                            ))}
                        </ul>
                        <Link to="/about" className="bg-[#1a2b4b] text-white px-8 py-3 rounded font-bold uppercase tracking-wider hover:bg-blue-900 transition">
                            Read More
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="absolute -top-4 -left-4 w-24 h-24 bg-zegen-red opacity-10 rounded-full"></div>
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#1a2b4b] opacity-10 rounded-full"></div>
                        {/* Placeholder for About Image if we had one, or use a colored block */}
                        <div className="bg-gray-200 h-[400px] rounded-lg shadow-inner flex items-center justify-center text-gray-400">
                            About Image Placeholder
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
