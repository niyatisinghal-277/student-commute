import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { auth } from "./firebaseConfig"; // Ensure correct path
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";

const PassengerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/passengerDashboard");
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passenger Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#B0C4DE"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#B0C4DE"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/PassengerSignup")}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4A90E2",
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 40,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  input: {
    width: "90%",
    height: 55,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    marginBottom: 20,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#4A90E2",
    fontSize: 22,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  link: {
    marginTop: 25,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default PassengerLogin;