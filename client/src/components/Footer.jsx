import React from 'react';
import { FaFacebookF, FaYoutube, FaEnvelope, FaVideo, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer style={{
            background: 'var(--primary-blue)',
            color: 'white',
            padding: '3rem 0',
            textAlign: 'center',
            marginTop: 'auto'
        }}>
            <div className="container">
                <h3 style={{ color: 'white', marginBottom: '1rem' }}>THE JOEL 2:28 GENERATION</h3>
                <p>"And it shall come to pass afterward, that I will pour out my spirit upon all flesh"</p>

                {/* Location Info */}
                <div style={{ margin: '1.5rem 0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <FaMapMarkerAlt />
                    <span>684 West College St. Sun City, USA</span>
                </div>

                {/* Social Links */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', margin: '2rem 0' }}>
                    <a href="https://www.facebook.com/profile.php?id=100089073216441" target="_blank" rel="noopener noreferrer"
                        style={{ color: 'white', fontSize: '1.5rem', transition: 'opacity 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        aria-label="Facebook">
                        <FaFacebookF />
                    </a>
                    <a href="https://www.youtube.com/channel/UCA4U2A4os66uiXi9XSxBOtQ" target="_blank" rel="noopener noreferrer"
                        style={{ color: 'white', fontSize: '1.5rem', transition: 'opacity 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        aria-label="YouTube">
                        <FaYoutube />
                    </a>
                    <a href="https://meet.google.com/smr-grwa-fey" target="_blank" rel="noopener noreferrer"
                        style={{ color: 'white', fontSize: '1.5rem', transition: 'opacity 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        aria-label="Google Meet">
                        <FaVideo />
                    </a>
                    <a href="mailto:thejoelgeneration52@gmail.com"
                        style={{ color: 'white', fontSize: '1.5rem', transition: 'opacity 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        aria-label="Email">
                        <FaEnvelope />
                    </a>
                </div>

                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Email: thejoelgeneration52@gmail.com | Midnight Prayer: 11:00 PM EAT
                </p>
                <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
                    &copy; {new Date().getFullYear()} All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
