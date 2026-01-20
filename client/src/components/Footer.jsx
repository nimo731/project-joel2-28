import React from 'react';
import { FaFacebookF, FaYoutube, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer style={{
            background: '#1a2b4b',
            color: 'white',
            padding: '1.5rem 0',
            textAlign: 'center',
            marginTop: '2rem'
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
                {/* Social Icons */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginBottom: '0.75rem' }}>
                    <a href="https://www.facebook.com/profile.php?id=100089073216441"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'white', fontSize: '1.25rem', transition: 'opacity 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        aria-label="Facebook">
                        <FaFacebookF />
                    </a>
                    <a href="https://www.youtube.com/channel/UCA4U2A4os66uiXi9XSxBOtQ"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'white', fontSize: '1.25rem', transition: 'opacity 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        aria-label="YouTube">
                        <FaYoutube />
                    </a>
                    <a href="https://wa.me/254742426038"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'white', fontSize: '1.25rem', transition: 'opacity 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        aria-label="WhatsApp">
                        <FaWhatsapp />
                    </a>
                    <a href="mailto:thejoelgeneration52@gmail.com"
                        style={{ color: 'white', fontSize: '1.25rem', transition: 'opacity 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        aria-label="Email">
                        <FaEnvelope />
                    </a>
                </div>

                {/* Email Address */}
                <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: '0 0 0.5rem 0' }}>
                    thejoelgeneration52@gmail.com
                </p>

                {/* Copyright */}
                <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: 0 }}>
                    &copy; {new Date().getFullYear()} THE JOEL 2:28 GENERATION. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
