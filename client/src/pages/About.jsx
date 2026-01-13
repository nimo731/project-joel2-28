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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                        {/* Mission */}
                        <div className="bg-gray-50 p-10 rounded-xl shadow-sm border-b-4 border-zegen-red hover:shadow-xl transition-shadow group">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl text-zegen-red shadow-md mb-6 group-hover:bg-zegen-red group-hover:text-white transition-colors">
                                <FaGlobe />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Our Mission</h3>
                            <p className="text-gray-600 leading-relaxed">
                                A well where we gather to contend for our generation as we experience Christ through prayers. For men always ought to pray. We are THE JOEL 2:28 GENERATION, experiencing the outpouring of God's Spirit.
                            </p>
                        </div>
                        {/* Vision */}
                        <div className="bg-gray-50 p-10 rounded-xl shadow-sm border-b-4 border-zegen-blue hover:shadow-xl transition-shadow group">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl text-zegen-blue shadow-md mb-6 group-hover:bg-zegen-blue group-hover:text-white transition-colors">
                                <FaHistory />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Our Vision</h3>
                            <p className="text-gray-600 leading-relaxed">
                                To see lives transformed through the power of prayer and to witness God's Spirit moving in our generation, fulfilling His promise to pour out His Spirit upon all flesh.
                            </p>
                        </div>
                    </div>

                    {/* Foundation Scripture */}
                    <div className="bg-gradient-to-r from-zegen-blue to-[#1a3b5c] p-10 rounded-xl text-white mb-16">
                        <h3 className="text-2xl font-bold mb-4 font-serif">Our Foundation</h3>
                        <blockquote className="text-lg italic border-l-4 border-zegen-red pl-6">
                            "And it shall come to pass afterward, that I will pour out my spirit upon all flesh; and your sons and your daughters shall prophesy, your old men shall dream dreams, your young men shall see visions"
                            <footer className="text-sm mt-4 not-italic opacity-80">- Joel 2:28 (KJV)</footer>
                        </blockquote>
                    </div>

                    {/* Leaders Section */}
                    <div>
                        <h3 className="text-3xl font-bold text-center text-gray-800 mb-10 font-serif">Our Leaders</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Leader 1 */}
                            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow text-center border border-gray-100">
                                <div className="w-24 h-24 bg-gradient-to-br from-zegen-red to-red-700 rounded-full flex items-center justify-center text-4xl text-white shadow-lg mx-auto mb-4">
                                    <FaUsers />
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 mb-1">James Kinyanjui Maina</h4>
                                <p className="text-zegen-red font-semibold mb-2">CEO & Founder</p>
                                <span className="text-gray-600 text-sm">Leader of THE JOEL 2:28 GENERATION</span>
                            </div>
                            {/* Leader 2 */}
                            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow text-center border border-gray-100">
                                <div className="w-24 h-24 bg-gradient-to-br from-zegen-blue to-blue-900 rounded-full flex items-center justify-center text-4xl text-white shadow-lg mx-auto mb-4">
                                    <FaHandHoldingHeart />
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 mb-1">Ruth Muriuki</h4>
                                <p className="text-zegen-blue font-semibold mb-2">Ministry Helper</p>
                                <span className="text-gray-600 text-sm">Supporting the vision</span>
                            </div>
                            {/* Leader 3 */}
                            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow text-center border border-gray-100">
                                <div className="w-24 h-24 bg-gradient-to-br from-zegen-red to-red-700 rounded-full flex items-center justify-center text-4xl text-white shadow-lg mx-auto mb-4">
                                    <FaUsers />
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 mb-1">Peter Kariuki</h4>
                                <p className="text-zegen-red font-semibold mb-2">Ministry Leader</p>
                                <span className="textgray-600 text-sm">Prayer & fellowship coordinator</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
