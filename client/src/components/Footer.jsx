import React from 'react';

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
                <p style={{ marginTop: '2rem', fontSize: '0.9rem', opacity: 0.8 }}>
                    &copy; {new Date().getFullYear()} All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
