import React, { useRef, useState, useEffect } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { FaDownload, FaShareAlt, FaExpand, FaTimes, FaQrcode } from 'react-icons/fa';

const QRCodeGenerator = () => {
    const qrRef = useRef();
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const logoUrl = '/joel228-logo.png';

    useEffect(() => {
        setWebsiteUrl(window.location.origin);
    }, []);

    const downloadQRCode = () => {
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
        <>
            {/* Trigger View - Compact Card */}
            <div
                onClick={() => setIsOpen(true)}
                className="group relative flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 max-w-[120px] mx-auto"
            >
                <div className="text-white/40 group-hover:text-zegen-red transition-colors duration-300 mb-1">
                    <FaQrcode size={24} />
                </div>
                <span className="text-white/60 text-[10px] font-semibold uppercase tracking-wider group-hover:text-white transition-colors duration-300">
                    Scan Site
                </span>

                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white/20 rounded-tl-sm group-hover:border-zegen-red"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-white/20 rounded-br-sm group-hover:border-zegen-red"></div>
            </div>

            {/* Modal Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                >
                    {/* Modal Content */}
                    <div
                        className="relative bg-white rounded-3xl p-8 shadow-2xl transform transition-all duration-500 scale-100 opacity-100 max-w-sm w-full mx-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute -top-4 -right-4 w-10 h-10 bg-zegen-red text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors z-10"
                        >
                            <FaTimes size={20} />
                        </button>

                        <div className="text-center">
                            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">Scan & Connect</h3>
                            <p className="text-gray-500 text-sm mb-6">Scan the code to visit our ministry online</p>

                            <div ref={qrRef} className="flex justify-center mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-inner">
                                <QRCode
                                    value={websiteUrl}
                                    size={240}
                                    logoImage={logoUrl}
                                    logoWidth={60}
                                    logoHeight={60}
                                    logoOpacity={1}
                                    qrStyle="dots"
                                    eyeRadius={15}
                                    quietZone={10}
                                    bgColor="#f9fafb"
                                    fgColor="#000000"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={downloadQRCode}
                                    className="w-full flex items-center justify-center gap-2 bg-zegen-red text-white py-3 rounded-xl font-bold tracking-wide hover:bg-red-700 transition-all shadow-md active:transform active:scale-[0.98]"
                                >
                                    <FaDownload /> Download Image
                                </button>
                                <button
                                    onClick={shareQRCode}
                                    className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold tracking-wide hover:bg-gray-200 transition-all"
                                >
                                    <FaShareAlt /> Share Link
                                </button>
                            </div>

                            <p className="mt-6 text-[10px] text-gray-400 font-semibold uppercase tracking-[0.2em]">
                                THE JOEL 2:28 GENERATION
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default QRCodeGenerator;
