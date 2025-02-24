import React, { useEffect, useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";

const Home = () => {
  const router = useRouter();
  const [user, setUser] = useState<boolean | null>(null);

  // Fetch token from AsyncStorage
  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("token");
      setUser(!!token); // If token exists, set user as logged in
    };
    fetchToken();
  }, []);

  // Features list
  const features = useMemo(
    () => [
      { icon: "credit-card", text: "Expense Tracking" },
      { icon: "line-chart", text: "Detailed Reports" },
      { icon: "mobile", text: "Mobile Friendly" },
    ],
    []
  );

  // Steps list
  const steps = useMemo(
    () => [
      { icon: "user-plus", text: "Step 1: Sign Up" },
      { icon: "bank", text: "Step 2: Add Sources" },
      { icon: "money", text: "Step 3: Add Expenses" },
      { icon: "bar-chart", text: "Step 4: View Reports" },
    ],
    []
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#E9D5FF" }}>
      <ScrollView>
        <View style={{ padding: 20, alignItems: "center" }}>
          <Icon name="smile-o" size={50} color="#9333EA" />
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#1E293B", textAlign: "center", marginTop: 10 }}>
            Welcome to Vi_Expense_Tracker
          </Text>
          <Text style={{ fontSize: 16, color: "#475569", textAlign: "center", marginVertical: 10 }}>
            Track your expenses effortlessly. Manage your finances with ease and stay on top of your budget.
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: "#9333EA", padding: 10, borderRadius: 8 }}
            onPress={() => router.push("/signup")}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Get Started</Text>
          </TouchableOpacity>
        </View>

        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", color: "#1E293B" }}>Features</Text>
          <View style={{ marginTop: 20 }}>
            {features.map((item, index) => (
              <View key={index} style={{ alignItems: "center", marginVertical: 10 }}>
                <Icon name={item.icon} size={40} color="#3B82F6" />
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#334155", marginTop: 5 }}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ padding: 20, backgroundColor: "#F1F5F9" }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", color: "#1E293B" }}>How It Works</Text>
          <View style={{ marginTop: 20 }}>
            {steps.map((item, index) => (
              <View key={index} style={{ alignItems: "center", marginVertical: 10 }}>
                <Icon name={item.icon} size={50} color="#3B82F6" />
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#334155", marginTop: 5 }}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ padding: 20, backgroundColor: "#2563EB", alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "white", textAlign: "center" }}>Get Started Today!</Text>
          <Text style={{ fontSize: 16, color: "#BFDBFE", textAlign: "center", marginVertical: 10 }}>
            Sign up now and take control of your finances with ViExpenseTracker.
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: "white", padding: 10, borderRadius: 8 }}
            onPress={() => router.push("/signup")}
          >
            <Text style={{ color: "#2563EB", fontWeight: "bold" }}>Register Now</Text>
          </TouchableOpacity>
        </View>

        <View style={{ padding: 15, backgroundColor: "#7C3AED", alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 14 }}>© {new Date().getFullYear()} Vi_Expense_Tracker. All rights reserved.</Text>
          <Text style={{ color: "white", fontSize: 14 }}>Made with ❤️ by Vineet Chelani</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
