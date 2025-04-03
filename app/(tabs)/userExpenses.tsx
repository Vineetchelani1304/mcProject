
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const BACKEND_URL = 'http://192.168.0.106:4000/getUserExpenses';
const screenWidth = Dimensions.get('window').width;

interface Expense {
  _id: string;
  expenseHeading: string;
  descriptions: string;
  totalCost: number;
  share?: { totalCost: number } | null;
  personal?: { totalCost: number } | null;
}

const UserExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchExpenses = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.push('/signup');
        setError('You must be logged in to view expenses');
        setLoading(false);
        return;
      }

      const response = await axios.get<{ success: boolean; message: string; data: Expense[] }>(BACKEND_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setExpenses(response.data.data || []);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('An error occurred while fetching the expenses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run fetchExpenses when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [])
  );

  const calculateTotals = () => {
    let totalPersonal = 0;
    let totalShared = 0;

    expenses.forEach((expense) => {
      totalShared += expense.share?.totalCost ? Number(expense.share.totalCost) : 0;
      totalPersonal += expense.personal?.totalCost ? Number(expense.personal.totalCost) : 0;
    });

    return { totalPersonal, totalShared };
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', fontSize: 18, textAlign: 'center' }}>{error}</Text>
        <TouchableOpacity onPress={() => router.replace('/')} style={{ marginTop: 20, backgroundColor: '#4F46E5', padding: 10, borderRadius: 5 }}>
          <Text style={{ color: 'white', fontSize: 16 }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { totalPersonal, totalShared } = calculateTotals();
  const pieData = [
    { name: 'Personal', population: totalPersonal, color: '#4F46E5', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Shared', population: totalShared, color: '#FF6384', legendFontColor: '#7F7F7F', legendFontSize: 15 }
  ];

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#F9FAFB' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>Expense Analysis</Text>
      <PieChart
        data={pieData}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#FFFFFF',
          backgroundGradientFrom: '#FFFFFF',
          backgroundGradientTo: '#FFFFFF',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          strokeWidth: 2,
          barPercentage: 0.5,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      <FlatList
        data={expenses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              console.log('Navigating to getExpenseDetails with ID:', item._id); // Debugging log
              router.push({ pathname: '/getExpenseDetails', params: { expenseId: item._id } });
            }}
            style={{
              backgroundColor: '#fff',
              padding: 15,
              marginVertical: 10,
              borderRadius: 8,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.expenseHeading}</Text>
            <Text style={{ color: '#555' }}>{item.descriptions}</Text>
            <Text style={{ color: '#888' }}>Total Cost: ${item.totalCost}</Text>
          </TouchableOpacity>

        )}
      />

      <TouchableOpacity onPress={() => router.push('/createExpense')} style={{ position: 'absolute', bottom: 30, right: 20, backgroundColor: '#4F46E5', padding: 15, borderRadius: 30 }}>
        <Text style={{ color: 'white', fontSize: 16 }}>Create Expense</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserExpenses;


// import React, { useEffect, useState, useCallback } from 'react';
// import { 
//   View, Text, ActivityIndicator, TouchableOpacity, FlatList, Alert, StyleSheet, Modal 
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useFocusEffect } from '@react-navigation/native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BarCodeScanner } from 'expo-barcode-scanner';
// import { Dimensions } from 'react-native';

// const BACKEND_URL = 'http://192.168.0.106:4000/getUserExpenses';
// const screenWidth = Dimensions.get('window').width;

// interface Expense {
//   _id: string;
//   expenseHeading: string;
//   descriptions: string;
//   totalCost: number;
//   share?: { totalCost: number } | null;
//   personal?: { totalCost: number } | null;
// }

// const UserExpenses = () => {
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
//   const [scanned, setScanned] = useState(false);
//   const [showScanner, setShowScanner] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     (async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   const fetchExpenses = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         router.push('/signup');
//         setError('You must be logged in to view expenses');
//         setLoading(false);
//         return;
//       }

//       const response = await axios.get<{ success: boolean; message: string; data: Expense[] }>(BACKEND_URL, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setExpenses(response.data.data || []);
//       } else {
//         setError(response.data.message);
//       }
//     } catch (err) {
//       setError('An error occurred while fetching the expenses');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchExpenses();
//     }, [])
//   );

//   const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
//     setScanned(true);
//     setShowScanner(false);
//     Alert.alert('QR Code Scanned', `Data: ${data}`, [
//       { text: 'Open Link', onPress: () => router.push({ pathname: data } as never) },
//       { text: 'OK', onPress: () => setScanned(false) }
//     ]);
//   };

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#4F46E5" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity onPress={() => router.replace('/')} style={styles.retryButton}>
//           <Text style={styles.buttonText}>Try Again</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Expense Analysis</Text>

//       <FlatList
//         data={expenses}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => (
//           <TouchableOpacity 
//             onPress={() => router.push({ pathname: '/getExpenseDetails', params: { expenseId: item._id } })} 
//             style={styles.expenseCard}
//           >
//             <Text style={styles.expenseTitle}>{item.expenseHeading}</Text>
//             <Text style={styles.expenseDesc}>{item.descriptions}</Text>
//             <Text style={styles.expenseCost}>Total Cost: ${item.totalCost}</Text>
//           </TouchableOpacity>
//         )}
//       />

//       <TouchableOpacity onPress={() => setShowScanner(true)} style={styles.scanButton}>
//         <Text style={styles.buttonText}>Scan QR</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => router.push('/createExpense')} style={styles.createButton}>
//         <Text style={styles.buttonText}>Create Expense</Text>
//       </TouchableOpacity>

//       {/* QR Scanner Modal */}
//       <Modal visible={showScanner} animationType="slide">
//         <View style={styles.scannerContainer}>
//           <Text style={styles.scannerText}>Scan QR Code</Text>
//           <BarCodeScanner
//             onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//             style={StyleSheet.absoluteFillObject}
//           />
//           <TouchableOpacity onPress={() => setShowScanner(false)} style={styles.closeButton}>
//             <Text style={styles.buttonText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
//   expenseCard: { 
//     backgroundColor: '#fff', padding: 15, marginVertical: 10, borderRadius: 8, 
//     shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 
//   },
//   expenseTitle: { fontSize: 18, fontWeight: 'bold' },
//   expenseDesc: { color: '#555' },
//   expenseCost: { color: '#888' },
//   scanButton: { position: 'absolute', bottom: 30, left: 20, backgroundColor: '#FF6384', padding: 15, borderRadius: 30 },
//   createButton: { position: 'absolute', bottom: 30, right: 20, backgroundColor: '#4F46E5', padding: 15, borderRadius: 30 },
//   scannerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
//   scannerText: { color: 'white', fontSize: 18, marginBottom: 20 },
//   closeButton: { position: 'absolute', bottom: 50, backgroundColor: '#FF6384', padding: 15, borderRadius: 30 },
//   retryButton: { marginTop: 20, backgroundColor: '#4F46E5', padding: 10, borderRadius: 5 },
//   buttonText: { color: 'white', fontSize: 16, textAlign: 'center' },
//   errorText: { color: 'red', fontSize: 18, textAlign: 'center' },
// });

// export default UserExpenses;
