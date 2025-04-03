import { useState } from 'react';
import axios from 'axios';

const QRCodeGenerator = () => {
    const [qrImage, setQrImage] = useState('');

    const generateQRCode = async () => {
        const { data } = await axios.post('/api/payments/generate-qrcode', {
            amount: 500, // Example amount in INR
            name: "Expense Tracker"
        });

        setQrImage(data.qrCode.image_url);
    };

    return (
        <div>
            <button onClick={generateQRCode} className="bg-blue-500 text-white p-2 rounded-md">
                Generate QR Code
            </button>

            {qrImage && (
                <div className="mt-4">
                    <img src={qrImage} alt="QR Code" />
                </div>
            )}
        </div>
    );
};

export default QRCodeGenerator;
