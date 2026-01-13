import React from 'react';
import { FaHistory, FaGlobe, FaHandHoldingHeart, FaUsers } from 'react-icons/fa';

const About = () => {
    return (
        <div className="pt-16">
            {/* Hero Section */}
            <div className="relative bg-[#1a2b4b] py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-10"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-zegen-red opacity-10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>

                <div className="container mx-auto relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold text-white font-serif mb-6 tracking-tight">
                        About <span className="text-zegen-red">Us</span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        We are a generation rising up to fulfill the prophecy of Joel 2:28. Empowered by the Spirit, we are moving with purpose, passion, and power.
                    </p>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Card 1 */}
                        <div className="bg-gray-50 p-10 rounded-xl shadow-sm border-b-4 border-zegen-red hover:shadow-xl transition-shadow group">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl text-zegen-red shadow-md mb-6 group-hover:bg-zegen-red group-hover:text-white transition-colors">
                                <FaGlobe />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Our Mission</h3>
                            <p className="text-gray-600 leading-relaxed">
                                To reach the nations with the gospel of Jesus Christ, demonstrating His power and love through service, worship, and the prophetic word.
                            </p>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-gray-50 p-10 rounded-xl shadow-sm border-b-4 border-zegen-blue hover:shadow-xl transition-shadow group">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl text-zegen-blue shadow-md mb-6 group-hover:bg-zegen-blue group-hover:text-white transition-colors">
                                <FaHistory />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Our History</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Founded on the principles of the early church, we have grown from a small prayer group into a global movement of believers dedicated to revival.
                            </p>
                        </div>
                        {/* Card 3 */}
                        <div className="bg-gray-50 p-10 rounded-xl shadow-sm border-b-4 border-zegen-red hover:shadow-xl transition-shadow group">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl text-zegen-red shadow-md mb-6 group-hover:bg-zegen-red group-hover:text-white transition-colors">
                                <FaUsers />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Our Community</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We believe in the power of unity. Our community is diverse, welcoming, and Spirit-filled, providing a home for everyone to grow in faith.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-[#111c30] py-20 text-white relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-12 md:mb-0">
                        <h2 className="text-4xl font-bold font-serif mb-6">Driven by <span className="text-zegen-red">Values</span></h2>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <FaHandHoldingHeart className="text-2xl text-zegen-red mr-4 mt-1" />
                                <div>
                                    <h4 className="text-xl font-bold mb-1">Service</h4>
                                    <p className="text-gray-400">Serving others as Christ served the church.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <FaGlobe className="text-2xl text-zegen-blue mr-4 mt-1" />
                                <div>
                                    <h4 className="text-xl font-bold mb-1">Global Impact</h4>
                                    <p className="text-gray-400">Thinking beyond our walls to touch the world.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <FaUsers className="text-2xl text-zegen-red mr-4 mt-1" />
                                <div>
                                    <h4 className="text-xl font-bold mb-1">Discipleship</h4>
                                    <p className="text-gray-400">Raising up the next generation of leaders.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2 md:pl-12">
                        <img
                            src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                            alt="Community"
                            className="rounded-lg shadow-2xl border-4 border-white/10"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
