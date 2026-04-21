import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FaDownload, FaShareAlt } from 'react-icons/fa';

const QRCodeGenerator = () => {
    const qrRef = useRef();
    const websiteUrl = 'https://project-joel2-28.onrender.com';
    const logoUrl = '/joel228-logo.png';

    const downloadQRCode = () => {
        const svg = qrRef.current.querySelector('svg');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = 'joel-228-qr-code.png';
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
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

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-[#1a2b4b]/50 rounded-2xl border border-white/10 backdrop-blur-sm">
            <h4 className="text-white font-serif text-xl mb-4">Scan to Visit Us</h4>
            <div ref={qrRef} className="bg-white p-4 rounded-xl shadow-2xl mb-6">
                <QRCodeSVG
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
                        height: 40,
                        width: 40,
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
