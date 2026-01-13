import React from 'react';
import { FaEnvelope, FaPhone, FaWhatsapp, FaFacebookF, FaYoutube, FaVideo, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Hero Header */}
            <div className="bg-zegen-blue text-white pt-24 pb-16 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Contact Us</h1>
                <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                    Get in touch with THE JOEL 2:28 GENERATION - We'd love to hear from you!
                </p>
            </div>

            {/* Contact Methods */}
            <div className="max-w-6xl mx-auto px-4 -mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Email */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border-b-4 border-zegen-red hover:shadow-xl transition">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-zegen-red text-2xl mx-auto mb-4">
                            <FaEnvelope />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">Email Us</h3>
                        <p className="text-gray-600 text-center mb-4">Send us your prayer requests or questions</p>
                        <a href="mailto:thejoelgeneration52@gmail.com"
                            className="block text-center text-zegen-red font-semibold hover:underline">
                            thejoelgeneration52@gmail.com
                        </a>
                    </div>

                    {/* WhatsApp */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border-b-4 border-green-500 hover:shadow-xl transition">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl mx-auto mb-4">
                            <FaWhatsapp />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">WhatsApp</h3>
                        <p className="text-gray-600 text-center mb-4">Join our prayer community</p>
                        <a href="https://wa.me/254742426038"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center text-green-600 font-semibold hover:underline">
                            Message on WhatsApp
                        </a>
                    </div>

                    {/* Google Meet */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border-b-4 border-zegen-blue hover:shadow-xl transition">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-zegen-blue text-2xl mx-auto mb-4">
                            <FaVideo />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">Join Prayer Meeting</h3>
                        <p className="text-gray-600 text-center mb-4">Midnight Prayer: 11:00 PM EAT</p>
                        <a href="https://meet.google.com/smr-grwa-fey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center text-zegen-blue font-semibold hover:underline">
                            Join via Google Meet
                        </a>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="mt-16 text-center bg-gray-50 p-10 rounded-xl">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 font-serif">Follow Our Ministry</h3>
                    <div className="flex justify-center gap-6">
                        <a href="https://www.facebook.com/profile.php?id=100089073216441"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl hover:bg-blue-700 transition">
                            <FaFacebookF />
                        </a>
                        <a href="https://www.youtube.com/channel/UCA4U2A4os66uiXi9XSxBOtQ"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white text-xl hover:bg-red-700 transition">
                            <FaYoutube />
                        </a>
                    </div>
                </div>

                {/* Location Info */}
                <div className="mt-10 text-center bg-zegen-blue text-white p-10 rounded-xl">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <FaMapMarkerAlt className="text-2xl" />
                        <h3 className="text-2xl font-bold font-serif">Our Location</h3>
                    </div>
                    <p className="text-xl">684 West College St. Sun City, USA</p>
                </div>
            </div>
        </div>
    );
};

export default Contact;
