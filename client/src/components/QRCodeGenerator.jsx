import React, { useRef, useState, useEffect } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { FaDownload, FaShareAlt } from 'react-icons/fa';

const QRCodeGenerator = () => {
    const qrRef = useRef();
    const [websiteUrl, setWebsiteUrl] = useState('');
    const logoUrl = '/joel228-logo.png';

    useEffect(() => {
        setWebsiteUrl(window.location.origin);
    }, []);

    const downloadQRCode = () => {
        // The QRCode component from react-qrcode-logo renders a canvas with id "react-qrcode-logo" by default
        // but we can access it via ref or just find it in our container
        const canvas = qrRef.current.querySelector('canvas');
        if (!canvas) return;

        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'joel-228-qr-code.png';
        downloadLink.href = pngFile;
        downloadLink.click();
    };

    const shareQRCode = () => {
        if (navigator.share) {
            navigator.share({
                title: 'THE JOEL 2:28 GENERATION',
                text: 'Check out our website!',
                url: websiteUrl,
            }).catch(console.error);
        } else {
            alert('Sharing not supported on this browser. You can download the QR code instead.');
        }
    };

    if (!websiteUrl) return null;

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-[#1a2b4b]/50 rounded-2xl border border-white/10 backdrop-blur-sm">
            <h4 className="text-white font-serif text-xl mb-4">Scan to Visit Us</h4>
            <div ref={qrRef} className="bg-white p-4 rounded-xl shadow-2xl mb-6">
                <QRCode
                    value={websiteUrl}
                    size={220}
                    logoImage={logoUrl}
                    logoWidth={50}
                    logoHeight={50}
                    logoOpacity={1}
                    qrStyle="dots"
                    eyeRadius={10} // Rounded corners for the "eyes" (position markers)
                    quietZone={10}
                    bgColor="#ffffff"
                    fgColor="#000000" // Strong contrast black on white
                />
            </div>
            <div className="flex gap-4">
                <button
                    onClick={downloadQRCode}
                    className="flex items-center gap-2 bg-zegen-red hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
                >
                    <FaDownload /> Download
                </button>
                <button
                    onClick={shareQRCode}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
                >
                    <FaShareAlt /> Share
                </button>
            </div>
        </div>
    );
};

export default QRCodeGenerator;
