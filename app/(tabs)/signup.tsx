import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Define TypeScript type for form data
type FormDataType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Signup = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (name: keyof FormDataType, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const response = await axios.post<{ success: boolean; token?: string; message?: string }>(
        "http://192.168.0.106:4000/signup", // ✅ Fixed: Corrected API endpoint
        formData
      );

      console.log("Response:", response.data);

      if (response.data.success) {
        router.push("/login");
      } else {
        Alert.alert("Signup Failed");
      }
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>

      <TextInput
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        keyboardType="email-address"
        style={styles.input}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={formData.password}
          onChangeText={(text) => handleChange("password", text)}
          secureTextEntry={!showPassword}
          style={styles.passwordInput} // ✅ Fix: Prevent overflow
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(text) => handleChange("confirmPassword", text)}
          secureTextEntry={!showConfirm}
          style={styles.passwordInput} // ✅ Fix: Prevent overflow
        />
        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
          <Icon name={showConfirm ? "eye-off" : "eye"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E9D5FF",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "white",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "white",
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1, // ✅ Fix: Prevents text overflow
    paddingVertical: 10,
  },
  button: {
    backgroundColor: "#9333EA",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  link: {
    color: "#2563EB",
    marginTop: 15,
    textDecorationLine: "underline",
  },
});

export default Signup;
