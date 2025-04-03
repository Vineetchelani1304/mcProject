import Razorpay from 'razorpay';

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Endpoint to generate QR Code for payment
export const generateQRCode = async (req, res) => {
    const { amount, name } = req.body;

    try {
        const qrCode = await razorpayInstance.qrCode.create({
            type: 'upi_qr',
            name: name || 'Expense Tracker',
            usage: 'single_use',
            fixed_amount: true,
            payment_amount: amount * 100, // Razorpay requires amount in paise
            description: 'Payment for Expenses'
        });

        res.status(200).json({ success: true, qrCode });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Endpoint to verify payment
export const verifyPayment = async (req, res) => {
    const { payment_id } = req.body;

    try {
        const payment = await razorpayInstance.payments.fetch(payment_id);
        
        if (payment.status === 'captured') {
            res.status(200).json({ success: true, message: 'Payment successful' });
        } else {
            res.status(400).json({ success: false, message: 'Payment not completed' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
