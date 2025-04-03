import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Define the expected response type
interface CreateShareResponse {
    success: boolean;
    message: string;
    data?: any;
}

const CreateShare = () => {
    const router = useRouter();
    const { expenseId } = useLocalSearchParams(); // Fetch expenseId from route params

    const [itemsBought, setItemsBought] = useState<string>('');
    const [itemsCount, setItemsCount] = useState<string>('');
    const [totalCost, setTotalCost] = useState<string>('');
    const [whoPaid, setWhoPaid] = useState<string>('');
    const [paymentDone, setPaymentDone] = useState<string>('No'); // Default to "No"
    const [shareCountEmail, setShareCountEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        setLoading(true);

        if (!expenseId) {
            Alert.alert('Error', 'No expense ID provided');
            setLoading(false);
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'You must be logged in to create a shared expense');
                setLoading(false);
                return;
            }

            // Convert "Yes"/"No" to boolean (true/false)
            const paymentDoneBoolean = paymentDone.toLowerCase() === 'yes';

            const payload = {
                expenseId,
                itemsBought: itemsBought.split(',').map(item => item.trim()),
                itemsCount: parseInt(itemsCount) || 0,
                totalCost: parseFloat(totalCost) || 0,
                whoPaid,
                paymentDone: paymentDoneBoolean, // Convert to boolean
                shareCountEmail: shareCountEmail ? shareCountEmail.split(',').map(email => email.trim()) : [],
            };

            // Ensure shareCountEmail is an array
            if (!Array.isArray(payload.shareCountEmail) || payload.shareCountEmail.length === 0) {
                Alert.alert('Error', 'Please enter valid emails separated by commas.');
                setLoading(false);
                return;
            }

            const response = await axios.post<CreateShareResponse>(
                'http://192.168.0.106:4000/createShare',
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                Alert.alert('Success', response.data.message);
                router.push("/(tabs)/userExpenses");
            } else {
                Alert.alert('Error', response.data.message);
            }
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to create shared expense');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Create Shared Expense</Text>
            <TextInput
                placeholder="Items Bought (comma separated)"
                value={itemsBought}
                onChangeText={setItemsBought}
                style={styles.input}
            />
            <TextInput
                placeholder="Items Count"
                keyboardType="numeric"
                value={itemsCount}
                onChangeText={setItemsCount}
                style={styles.input}
            />
            <TextInput
                placeholder="Total Cost"
                keyboardType="numeric"
                value={totalCost}
                onChangeText={setTotalCost}
                style={styles.input}
            />
            <TextInput
                placeholder="Who Paid (email)"
                value={whoPaid}
                onChangeText={setWhoPaid}
                style={styles.input}
            />
            <TextInput
                placeholder="Payment Done (Yes/No)"
                value={paymentDone}
                onChangeText={setPaymentDone}
                style={styles.input}
            />
            <TextInput
                placeholder="Share Count Email (comma separated)"
                value={shareCountEmail}
                onChangeText={setShareCountEmail}
                style={styles.input}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Create Shared Expense" onPress={handleSubmit} />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#F3F4F6',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default CreateShare;
