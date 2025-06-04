import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from "expo-router";


const RiderLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/map"); // Redirect to Publish Ride Screen
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rider Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#B0EAE0"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#B0EAE0"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#FFFFFF" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      {/* Signup Option */}
      <TouchableOpacity onPress={() => router.push("/RiderSignupScreen")}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#50E3C2",
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
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 3 },
    shadowRadius: 4,
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
    color: "#50E3C2",
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

export default RiderLoginScreen;