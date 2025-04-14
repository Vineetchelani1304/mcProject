import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

interface ExpenseResponse {
    success: boolean;
    data: {
        _id: string;
    };
    message?: string;
}

const CreateExpense = () => {
    const [expenseHeading, setExpenseHeading] = useState('');
    const [descriptions, setDescriptions] = useState('');
    const [category, setCategory] = useState('share');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const router = useRouter();


    const handleSubmit = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            Alert.alert('Error', 'You must be logged in to create an expense');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post<ExpenseResponse>(
                'http://192.168.29.112:4000/createExpense',
                {
                    expenseHeading,
                    descriptions,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                const expenseId = response.data.data._id;
            
                // Use absolute paths
                if (category === 'share') {
                    router.push({
                        pathname: '/(tabs)/createShare',
                        params: { expenseId }
                    } as never); // Add 'as never' to fix TypeScript error
                } else if (category === 'personal') {
                    router.push({
                        pathname: '/(tabs)/createPersonal',
                        params: { expenseId }
                    } as never);
                }
            } else {
                Alert.alert('Error', response.data.message);
            }

            
        } catch (error) {
            Alert.alert('Error', 'An error occurred while creating the expense');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9' }}>
            <View style={{ width: '90%', backgroundColor: 'white', padding: 20, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>Create Expense</Text>
                <TextInput
                    placeholder='Heading for Expense...'
                    value={expenseHeading}
                    onChangeText={setExpenseHeading}
                    style={{ borderBottomWidth: 1, marginBottom: 10, padding: 8 }}
                />
                <TextInput
                    placeholder='Description...'
                    value={descriptions}
                    onChangeText={setDescriptions}
                    multiline
                    style={{ borderBottomWidth: 1, marginBottom: 10, padding: 8 }}
                />
                <Picker
                    selectedValue={category}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                    style={{ marginBottom: 20 }}
                >
                    <Picker.Item label='Share' value='share' />
                    <Picker.Item label='Personal' value='personal' />
                </Picker>
                <TouchableOpacity
                    onPress={handleSubmit}
                    style={{ backgroundColor: '#3b82f6', padding: 12, borderRadius: 5, alignItems: 'center' }}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color='#fff' /> : <Text style={{ color: 'white', fontSize: 16 }}>Create Expense</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CreateExpense;
