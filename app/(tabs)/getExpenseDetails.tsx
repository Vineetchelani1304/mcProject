// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, ActivityIndicator, ScrollView, StyleSheet, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useRouter, useLocalSearchParams } from 'expo-router';

// const BACKEND_URL = "http://192.168.29.112:4000"; // Your backend URL

// // 🧩 Interfaces
// interface Expense {
//     expenseHeading: string;
//     descriptions: string;
//     share?: {
//         totalCost: number;
//         perHead: number;
//         paymentDone: boolean;
//         shareCountEmail: string[];
//     };
//     personal?: {
//         totalCost: number;
//         itemsBought?: { name: string; price: number }[];
//     };
// }

// interface ExpenseApiResponse {
//     success: boolean;
//     data: Expense;
//     message?: string;
// }

// interface CreateOrderResponse {
//     success: boolean;
//     order: {
//         id: string;
//         amount: number;
//     };
// }

// const ExpenseDetails = () => {
//     const router = useRouter();
//     const { expenseId } = useLocalSearchParams();

//     const [expenseDetails, setExpenseDetails] = useState<Expense | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [settleLoading, setSettleLoading] = useState(false);

//     useEffect(() => {
//         const fetchExpenseDetails = async () => {
//             setLoading(true);
//             setError('');

//             try {
//                 const token = await AsyncStorage.getItem('token');
//                 if (!token) throw new Error('You must be logged in to view expense details');

//                 const response = await axios.get<ExpenseApiResponse>(`${BACKEND_URL}/expenses/${expenseId}`, {
//                     headers: { 'Authorization': `Bearer ${token}` },
//                 });

//                 if (response.data.success) {
//                     setExpenseDetails(response.data.data);
//                 } else {
//                     throw new Error(response.data.message || 'Unexpected error');
//                 }
//             } catch (err) {
//                 setError(err instanceof Error ? err.message : 'An error occurred');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchExpenseDetails();
//     }, [expenseId]);

//     const handleSettleExpense = async () => {
//         if (!expenseDetails?.share?.totalCost) {
//             Alert.alert("Error", "Invalid expense details.");
//             return;
//         }

//         setSettleLoading(true);

//         try {
//             const token = await AsyncStorage.getItem('token');
//             if (!token) throw new Error('You must be logged in to settle an expense');

//             const orderResponse = await axios.post<CreateOrderResponse>(`${BACKEND_URL}/createOrder`, {
//                 amount: expenseDetails.share.totalCost
//             });

//             if (!orderResponse.data.success) throw new Error('Failed to create order');
//             console.log("Order Response:", orderResponse.data);

//             const { id: orderId, amount } = orderResponse.data.order;

//             router.push({
//                 pathname: "/razorpayWebView",
//                 params: { orderId, amount, expenseId }
//             });

//         } catch (err) {
//             Alert.alert("Error", err instanceof Error ? err.message : 'An error occurred');
//         } finally {
//             setSettleLoading(false);
//         }
//     };

//     if (loading) {
//         return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingContainer} />;
//     }

//     return (
//         <ScrollView contentContainerStyle={styles.container}>
//             {error ? <Text style={styles.errorText}>{error}</Text> : null}
//             {expenseDetails && (
//                 <>
//                     <Text style={styles.header}>Expense Details</Text>
//                     <Text style={styles.title}>{expenseDetails.expenseHeading}</Text>
//                     <Text style={styles.description}>{expenseDetails.descriptions}</Text>

//                     {expenseDetails.share && (
//                         <View style={styles.card}>
//                             <Text style={styles.subHeader}>Shared Expense</Text>
//                             <Text style={styles.text}>Total Cost: ₹{expenseDetails.share.totalCost}</Text>
//                             <Text style={styles.text}>Per Head: ₹{expenseDetails.share.perHead}</Text>
//                         </View>
//                     )}

//                     <View style={styles.buttonContainer}>
//                         {settleLoading ? (
//                             <ActivityIndicator size="small" color="#0000ff" />
//                         ) : (
//                             <Button title="Settle Expense" onPress={handleSettleExpense} />
//                         )}
//                     </View>
//                 </>
//             )}
//         </ScrollView>
//     );
// };

// // 🎨 Styles
// const styles = StyleSheet.create({
//     container: { flexGrow: 1, backgroundColor: '#E3F2FD', padding: 20 },
//     loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     errorText: { color: 'red', fontSize: 16, textAlign: 'center', marginTop: 5 },
//     header: { fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
//     title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
//     description: { fontSize: 16, textAlign: 'center', marginBottom: 15 },
//     subHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
//     card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15 },
//     text: { fontSize: 16 },
//     buttonContainer: { marginTop: 20 },
// });

// export default ExpenseDetails;




import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';

const BACKEND_URL = "http://192.168.29.112:4000";

// 🧩 Interfaces
interface Expense {
    expenseHeading: string;
    descriptions: string;
    share?: {
        totalCost: number;
        perHead: number;
        paymentDone: boolean;
        shareCountEmail: string[];
    };
    personal?: {
        totalCost: number;
        itemsBought?: { name: string; price: number }[];
    };
}

interface ExpenseApiResponse {
    success: boolean;
    data: Expense;
    message?: string;
}

interface CreateOrderResponse {
    success: boolean;
    order: {
        id: string;
        amount: number;
    };
}

const ExpenseDetails = () => {
    const router = useRouter();
    const { expenseId } = useLocalSearchParams();

    const [expenseDetails, setExpenseDetails] = useState<Expense | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [settleLoading, setSettleLoading] = useState(false);

    useEffect(() => {
        const fetchExpenseDetails = async () => {
            setLoading(true);
            setError('');

            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) throw new Error('You must be logged in to view expense details');

                const response = await axios.get<ExpenseApiResponse>(`${BACKEND_URL}/expenses/${expenseId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (response.data.success) {
                    setExpenseDetails(response.data.data);
                } else {
                    throw new Error(response.data.message || 'Unexpected error');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchExpenseDetails();
    }, [expenseId]);

    const handleSettleExpense = async () => {
        const totalAmount = expenseDetails?.share?.totalCost ?? expenseDetails?.personal?.totalCost;

        if (!totalAmount) {
            Alert.alert("Error", "Invalid expense details.");
            return;
        }

        setSettleLoading(true);

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error('You must be logged in to settle an expense');

            if (expenseDetails?.share) {
                // 🧾 Shared expense → use Razorpay
                const orderResponse = await axios.post<CreateOrderResponse>(`${BACKEND_URL}/createOrder`, {
                    amount: totalAmount
                });

                if (!orderResponse.data.success) throw new Error('Failed to create order');
                const { id: orderId, amount } = orderResponse.data.order;

                router.push({
                    pathname: "/razorpayWebView",
                    params: { orderId, amount, expenseId }
                });
            } else if (expenseDetails?.personal) {
                // 🧍 Personal expense → directly settle via backend
                const settleResponse = await axios.post(
                    `${BACKEND_URL}/settleExpense`,
                    { expenseId }, // ✅ Send expenseId in the request body
                    { headers: { Authorization: `Bearer ${token}` } } // ✅ Send Auth Token
                );

                if (settleResponse.data.success) {
                    Alert.alert("Success", "Personal expense settled successfully!");
                    router.back(); // Go back after settling
                } else {
                    throw new Error(settleResponse.data.message || "Failed to settle personal expense");
                }
            }
        } catch (err) {
            Alert.alert("Error", err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setSettleLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingContainer} />;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {expenseDetails && (
                <>
                    <Text style={styles.header}>Expense Details</Text>
                    <Text style={styles.title}>{expenseDetails.expenseHeading}</Text>
                    <Text style={styles.description}>{expenseDetails.descriptions}</Text>

                    {expenseDetails.share && (
                        <View style={styles.card}>
                            <Text style={styles.subHeader}>Shared Expense</Text>
                            <Text style={styles.text}>Total Cost: ₹{expenseDetails.share.totalCost}</Text>
                            <Text style={styles.text}>Per Head: ₹{expenseDetails.share.perHead}</Text>
                        </View>
                    )}

                    {expenseDetails.personal && (
                        <View style={styles.card}>
                            <Text style={styles.subHeader}>Personal Expense</Text>
                            <Text style={styles.text}>Total Cost: ₹{expenseDetails.personal.totalCost}</Text>
                        </View>
                    )}

                    <View style={styles.qrContainer}>
                        <Text style={styles.subHeader}>Share via QR</Text>
                        <QRCode
                            value={JSON.stringify({
                                heading: expenseDetails.expenseHeading,
                                description: expenseDetails.descriptions,
                                totalAmount:
                                    expenseDetails?.share?.totalCost ??
                                    expenseDetails?.personal?.totalCost ?? 0,
                            })}
                            size={200}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        {settleLoading ? (
                            <ActivityIndicator size="small" color="#0000ff" />
                        ) : (
                            <Button
                                title={`Settle ${expenseDetails.share ? 'Shared' : 'Personal'} Expense`}
                                onPress={handleSettleExpense}
                            />
                        )}
                    </View>
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#E3F2FD', padding: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: 'red', fontSize: 16, textAlign: 'center', marginTop: 5 },
    header: { fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
    description: { fontSize: 16, textAlign: 'center', marginBottom: 15 },
    subHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
    card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15 },
    text: { fontSize: 16 },
    qrContainer: {
        alignItems: 'center',
        marginTop: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonContainer: { marginTop: 20 },
});

export default ExpenseDetails;
