// import React, { useEffect, useState } from "react";
// import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet, ScrollView } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import { useRouter } from "expo-router";
// import { PieChart, BarChart } from "react-native-chart-kit";
// import { Dimensions } from "react-native";

// const screenWidth = Dimensions.get("window").width;

// const UserExpenses = () => {
//   const [expenses, setExpenses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     const fetchExpenses = async () => {
//       try {
//         const token = await AsyncStorage.getItem("token");
//         if (!token) {
//           router.push("/signup");
//           setError("You must be logged in to view expenses");
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get("http://localhost:4000/getUserExpenses", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.data.success) {
//           setExpenses(response.data.data);
//         } else {
//           setError(response.data.message);
//         }
//       } catch (err) {
//         setError("An error occurred while fetching expenses");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchExpenses();
//   }, []);

//   const calculateTotals = () => {
//     let totalPersonal = 0;
//     let totalShared = 0;

//     expenses.forEach((expense) => {
//       if (expense.share) {
//         totalShared += parseFloat(expense.share.totalCost);
//       } else {
//         totalPersonal += parseFloat(expense.personal.totalCost);
//       }
//     });

//     return { totalPersonal, totalShared };
//   };

//   const { totalPersonal, totalShared } = calculateTotals();
//   const dataForPieChart = [
//     { name: "Personal", population: totalPersonal, color: "#4F46E5", legendFontColor: "#7F7F7F", legendFontSize: 15 },
//     { name: "Shared", population: totalShared, color: "#34D399", legendFontColor: "#7F7F7F", legendFontSize: 15 },
//   ];

//   if (loading) return <ActivityIndicator size="large" color="#4F46E5" style={styles.center} />;
//   if (error) return <Text style={styles.error}>{error}</Text>;

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.chartContainer}>
//         <Text style={styles.chartTitle}>Expense Distribution</Text>
//         <PieChart data={dataForPieChart} width={screenWidth - 40} height={220} chartConfig={chartConfig} accessor="population" backgroundColor="transparent" paddingLeft="15" />
//       </View>
//       <FlatList
//         data={expenses}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => (
//           <TouchableOpacity style={styles.expenseItem} onPress={() => router.push(`/expenses/${item._id}`)}>
//             <Text style={styles.expenseTitle}>{item.expenseHeading}</Text>
//             <Text style={styles.expenseDesc}>{item.descriptions}</Text>
//             <Text style={styles.expenseCost}>Total Cost: ${item.totalCost}</Text>
//           </TouchableOpacity>
//         )}
//       />
//       <TouchableOpacity style={styles.addButton} onPress={() => router.push("/createExpense")}> 
//         <Text style={styles.addButtonText}>Create New Expense</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const chartConfig = {
//   backgroundGradientFrom: "#fff",
//   backgroundGradientTo: "#fff",
//   color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
//   strokeWidth: 2,
//   barPercentage: 0.5,
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#E9D5FF", padding: 10 },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   error: { color: "red", textAlign: "center", marginTop: 20 },
//   chartContainer: { backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 20, alignItems: "center" },
//   chartTitle: { fontSize: 18, fontWeight: "bold", color: "#1E293B", marginBottom: 10 },
//   expenseItem: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 },
//   expenseTitle: { fontSize: 18, fontWeight: "bold" },
//   expenseDesc: { fontSize: 14, color: "#555" },
//   expenseCost: { fontSize: 16, color: "#4F46E5", marginTop: 5 },
//   addButton: { backgroundColor: "#4F46E5", padding: 15, borderRadius: 30, alignItems: "center", marginVertical: 20 },
//   addButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
// });

// export default UserExpenses;



import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const UserExpenses = () => {
  const router = useRouter();

  // Dummy Expenses Data
  const dummyExpenses = [
    {
      _id: "1",
      expenseHeading: "Groceries",
      descriptions: "Monthly grocery shopping",
      totalCost: "200",
      personal: { totalCost: "200" },
    },
    {
      _id: "2",
      expenseHeading: "Dinner Out",
      descriptions: "Dinner with friends",
      totalCost: "100",
      share: { totalCost: "100" },
    },
    {
      _id: "3",
      expenseHeading: "Electricity Bill",
      descriptions: "Monthly electricity bill",
      totalCost: "80",
      personal: { totalCost: "80" },
    },
    {
      _id: "4",
      expenseHeading: "Weekend Trip",
      descriptions: "Trip to the mountains",
      totalCost: "500",
      share: { totalCost: "500" },
    },
  ];

  // Calculate Totals
  const calculateTotals = () => {
    let totalPersonal = 0;
    let totalShared = 0;

    dummyExpenses.forEach((expense) => {
      if (expense.share) {
        totalShared += parseFloat(expense.share.totalCost);
      } else {
        totalPersonal += parseFloat(expense.personal.totalCost);
      }
    });

    return { totalPersonal, totalShared };
  };

  const { totalPersonal, totalShared } = calculateTotals();
  const dataForPieChart = [
    { name: "Personal", population: totalPersonal, color: "#4F46E5", legendFontColor: "#7F7F7F", legendFontSize: 15 },
    { name: "Shared", population: totalShared, color: "#34D399", legendFontColor: "#7F7F7F", legendFontSize: 15 },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Expense Distribution</Text>
        <PieChart
          data={dataForPieChart}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View>
      <FlatList
        data={dummyExpenses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.expenseItem} onPress={() => router.push(`/expenses/${item._id}`)}>
            <Text style={styles.expenseTitle}>{item.expenseHeading}</Text>
            <Text style={styles.expenseDesc}>{item.descriptions}</Text>
            <Text style={styles.expenseCost}>Total Cost: ${item.totalCost}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/createExpense")}> 
        <Text style={styles.addButtonText}>Create New Expense</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E9D5FF", padding: 10 },
  chartContainer: { backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 20, alignItems: "center" },
  chartTitle: { fontSize: 18, fontWeight: "bold", color: "#1E293B", marginBottom: 10 },
  expenseItem: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 },
  expenseTitle: { fontSize: 18, fontWeight: "bold" },
  expenseDesc: { fontSize: 14, color: "#555" },
  expenseCost: { fontSize: 16, color: "#4F46E5", marginTop: 5 },
  addButton: { backgroundColor: "#4F46E5", padding: 15, borderRadius: 30, alignItems: "center", marginVertical: 20 },
  addButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default UserExpenses;
