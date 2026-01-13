import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaSearch } from 'react-icons/fa';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    return (
        <header className="w-full z-50 fixed top-0 transition-all duration-300">
            {/* Top Bar - Zegen Style */}
            <div className="bg-[#111c30] text-gray-400 text-xs py-2 hidden md:block border-b border-gray-800">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-2"><FaMapMarkerAlt /> 684 West College St. Sun City, USA</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="#" className="hover:text-white transition"><FaFacebookF /></a>
                        <a href="#" className="hover:text-white transition"><FaTwitter /></a>
                        <a href="#" className="hover:text-white transition"><FaInstagram /></a>
                        <a href="#" className="hover:text-white transition"><FaYoutube /></a>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className={`w-full transition-all duration-300 ${scrolled || !isHome ? 'bg-[#1a2b4b] shadow-lg py-3' : 'bg-transparent py-5'}`}>
                <div className="container mx-auto px-4 flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-white tracking-widest uppercase">
                            ZEGEN<span className="text-zegen-red text-3xl">†</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <ul className="flex items-center gap-6 text-sm font-bold text-white uppercase tracking-wide">
                            {['Home', 'Sermons', 'Events', 'About', 'Testimonials'].map(item => (
                                <li key={item}>
                                    <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="hover:text-zegen-red transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link to="/login" className="hover:text-zegen-red transition-colors">Login</Link>
                            </li>
                            <li>
                                <Link to="/signup" className="hover:text-zegen-red transition-colors">Sign Up</Link>
                            </li>
                        </ul>
                        <Link to="/prayers" className="bg-zegen-red text-white px-6 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition transform hover:-translate-y-1">
                            Donate
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden text-white text-2xl cursor-pointer" onClick={toggleMenu}>
                        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden absolute top-full left-0 w-full bg-[#1a2b4b] text-white transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-screen py-4' : 'max-h-0'}`}>
                    <ul className="flex flex-col items-center gap-4 text-sm font-bold uppercase">
                        {['Home', 'Sermons', 'Events', 'About', 'Testimonials'].map(item => (
                            <li key={item}>
                                <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} onClick={toggleMenu} className="block py-2">
                                    {item}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link to="/login" onClick={toggleMenu} className="block py-2">Login</Link>
                        </li>
                        <li>
                            <Link to="/signup" onClick={toggleMenu} className="block py-2">Sign Up</Link>
                        </li>
                        <li>
                            <Link to="/prayers" onClick={toggleMenu} className="bg-zegen-red px-6 py-2 rounded inline-block mt-2">Donate</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header >
    );
};

export default Navbar;
