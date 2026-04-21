import React, { useRef, useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { FaDownload, FaShareAlt } from 'react-icons/fa';

const QRCodeGenerator = () => {
    const canvasRef = useRef();
    const [websiteUrl, setWebsiteUrl] = useState('');
    const logoUrl = '/joel228-logo.png';

    useEffect(() => {
        // Use the current origin as the website URL
        setWebsiteUrl(window.location.origin);
    }, []);

    const downloadQRCode = () => {
        const canvas = canvasRef.current.querySelector('canvas');
        if (!canvas) return;

        // Create a temporary canvas with a white background for the PNG
        const downloadCanvas = document.createElement('canvas');
        const context = downloadCanvas.getContext('2d');
        downloadCanvas.width = canvas.width;
        downloadCanvas.height = canvas.height;

        // Fill background with white
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);

        // Draw the QR code canvas on top
        context.drawImage(canvas, 0, 0);

        const pngFile = downloadCanvas.toDataURL('image/png');
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
            <div ref={canvasRef} className="bg-white p-4 rounded-xl shadow-2xl mb-6">
                <QRCodeCanvas
                    value={websiteUrl}
                    size={200}
                    bgColor={"#ffffff"}
                    fgColor={"#1a2b4b"}
                    level={"H"}
                    includeMargin={false}
                    imageSettings={{
                        src: logoUrl,
                        x: undefined,
                        y: undefined,
                        height: 50,
                        width: 50,
                        excavate: true,
                    }}
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
