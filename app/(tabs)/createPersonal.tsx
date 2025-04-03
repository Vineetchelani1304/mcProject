import React, { useState } from 'react';
import axios from 'axios';
// Using axios generics instead of AxiosResponse

import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Define response structure
interface CreatePersonalResponse {
    success: boolean;
    message: string;
    data?: any;
}

const CreatePersonal = () => {
    const router = useRouter();
    const { expenseId } = useLocalSearchParams(); // Corrected hook for search params

    console.log('Expense ID:', expenseId); // Debugging line
    const [itemsBought, setItemsBought] = useState('');
    const [itemsCount, setItemsCount] = useState('');
    const [totalCost, setTotalCost] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);

        // Validate expenseId
        if (!expenseId) {
            Alert.alert('Error', 'No expense ID provided');
            setLoading(false);
            return;
        }

        // Retrieve token from AsyncStorage
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert('Error', 'You must be logged in to create a personal expense');
            setLoading(false);
            return;
        }

        try {
            // Make the API request
            const response = await axios.post<CreatePersonalResponse>(
                'http://192.168.0.106:4000/createPersonal',
                {
                    expenseId,
                    itemsBought: itemsBought.split(',').map(item => item.trim()),
                    itemsCount: parseInt(itemsCount),
                    totalCost: parseFloat(totalCost),
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Handle response
            if (response.data.success) {
                Alert.alert('Success', response.data.message);
                router.push("/(tabs)/userExpenses");
            } else {
                Alert.alert('Error', response.data.message);
            }
        } catch (error: any) {
            // Improved error handling
            Alert.alert('Error', error.response?.data?.message || 'An error occurred while creating the personal expense');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Create Personal Expense</Text>
            <TextInput
                style={styles.input}
                placeholder="Items Bought (comma separated)"
                value={itemsBought}
                onChangeText={setItemsBought}
            />
            <TextInput
                style={styles.input}
                placeholder="Items Count"
                keyboardType="numeric"
                value={itemsCount}
                onChangeText={setItemsCount}
            />
            <TextInput
                style={styles.input}
                placeholder="Total Cost"
                keyboardType="numeric"
                value={totalCost}
                onChangeText={setTotalCost}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Create Personal Expense" onPress={handleSubmit} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
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

export default CreatePersonal;
