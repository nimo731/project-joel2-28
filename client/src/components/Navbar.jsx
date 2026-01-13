import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaSearch } from 'react-icons/fa';
import logo from '../assets/logo.png';

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
            {/* Main Navbar */}
            <nav className={`w-full transition-all duration-300 ${scrolled || !isHome ? 'bg-[#1a2b4b] shadow-lg py-3' : 'bg-transparent py-5'}`}>
                <div className="container mx-auto px-4 flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <img
                            src={logo}
                            alt="Joel 2:28 Generation"
                            className="h-16 w-16 md:h-16 object-contain rounded-full border-2 border-white/30 hover:border-zegen-red hover:scale-105 transition-all duration-300"
                        />
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
                    </ul>
                </div>
            </nav>
        </header >
    );
};

export default Navbar;
