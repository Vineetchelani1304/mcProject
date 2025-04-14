import React, { useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Import AsyncStorage
import { useRouter, useLocalSearchParams } from "expo-router";

const BACKEND_URL = "http://192.168.29.112:4000";
const RAZORPAY_KEY_ID = "rzp_test_BDWc7xTAoR7Bx3";

const RazorpayWebView = () => {
    const router = useRouter();
    const { orderId, amount, expenseId } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);

    // ✅ Convert amount to paisa (ensure it's a valid number)
    const amountNumber = Number(amount) * 100;

    // ✅ Razorpay Checkout HTML (with QR Scanner)
    const paymentHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </head>
    <body onload="payNow()">
        <script>
            function payNow() {
                var options = {
                    key: '${RAZORPAY_KEY_ID}',
                    amount: ${amountNumber},
                    currency: 'INR',
                    name: 'Expense Splitter',
                    description: 'Payment for Expense',
                    order_id: '${orderId}',
                    handler: function (response) {
                        window.ReactNativeWebView.postMessage(JSON.stringify(response));
                    },
                    prefill: {
                        email: 'user@example.com',
                        contact: '9999999999',
                        name: 'John Doe'
                    },
                    method: {
                        upi: { flow: "collect" }  // ✅ QR Code Payment
                    },
                    theme: { color: '#F37254' }
                };
                var rzp = new Razorpay(options);
                rzp.open();
            }
        </script>
    </body>
    </html>
    `;

    // ✅ Handle Payment Success
    const handlePaymentSuccess = async (event: WebViewMessageEvent) => {
        try {
            const response = JSON.parse(event.nativeEvent.data);
            console.log("Razorpay Response:", response);

            if (response.razorpay_payment_id) {
                // ✅ Step 1: Verify Payment on Backend
                const verifyResponse = await axios.post(`${BACKEND_URL}/verifyPayment`, {
                    order_id: orderId,
                    payment_id: response.razorpay_payment_id,
                    signature: response.razorpay_signature,
                });

                console.log("Payment Verification Response:", verifyResponse.data);

                if (verifyResponse.data.success) {
                    // ✅ Step 2: Settle Expense
                    const token = await AsyncStorage.getItem("token");
                    if (!token) {
                        Alert.alert("Error", "You must be logged in to settle the expense.");
                        return;
                    }

                    const settleResponse = await axios.post(
                        `${BACKEND_URL}/settleExpense`,
                        { expenseId }, // ✅ Send expenseId in the request body
                        { headers: { Authorization: `Bearer ${token}` } } // ✅ Send Auth Token
                    );

                    console.log("Settle Expense Response:", settleResponse.data);

                    if (settleResponse.data.success) {
                        Alert.alert("Success", "Payment & Expense Settlement Successful!");
                        router.push("/userExpenses"); // ✅ Navigate back to user expenses
                    } else {
                        Alert.alert("Error", "Expense settlement failed.");
                    }
                } else {
                    Alert.alert("Error", "Payment verification failed.");
                }
            } else {
                Alert.alert("Error", "Invalid payment response.");
            }
        } catch (error) {
            console.error("Payment Processing Error:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            <WebView
                originWhitelist={["*"]}
                source={{ html: paymentHtml }}
                onLoadEnd={() => setLoading(false)}
                onMessage={handlePaymentSuccess} // ✅ Handle payment success
            />
        </View>
    );
};

export default RazorpayWebView;
