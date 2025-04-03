const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config(); // Ensure you have dotenv installed

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});

// 🏷️ Function to Create an Order
exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // Convert to paisa (1 INR = 100 paisa)
            currency: "INR",
            receipt: `receipt_${crypto.randomBytes(10).toString('hex')}`
        };

        const order = await razorpay.orders.create(options);
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating order", error });
    }
};

// 🏷️ Function to Verify Payment
exports.verifyPayment = async (req, res) => {
    try {
        const { order_id, payment_id, signature } = req.body;

        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
        hmac.update(order_id + "|" + payment_id);
        const generatedSignature = hmac.digest("hex");

        if (generatedSignature !== signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        res.json({ success: true, message: "Payment verified successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error verifying payment", error });
    }
};
