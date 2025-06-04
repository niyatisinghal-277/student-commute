import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { auth, db } from "./firebaseConfig"; // Ensure correct Firebase import
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native"; // Corrected navigation import

const RiderSignupScreen = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [license, setLicense] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [seats, setSeats] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation(); // Corrected navigation

  const handleSignup = async () => {
    if (!name || !email || !password || !age || !gender || !license || !vehicleType || !seats || !mobile) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "riders", user.uid), {
        name,
        age,
        gender,
        license,
        vehicleType,
        seats,
        mobile,
        email,
      });

      Alert.alert("Success", "Signup Successful!", [
        { text: "OK", onPress: () => navigation.replace("RiderLoginScreen") }, // Corrected navigation
      ]);
      //router.push("/RiderLoginScreen");
    } catch (error) {
      console.error("Signup error:", error.message); // Logs error for debugging
      Alert.alert("Signup Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rider Signup</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#88DAC9"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        placeholderTextColor="#88DAC9"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        placeholderTextColor="#88DAC9"
        value={gender}
        onChangeText={setGender}
      />
      <TextInput
        style={styles.input}
        placeholder="License Number"
        placeholderTextColor="#88DAC9"
        value={license}
        onChangeText={setLicense}
      />
      <TextInput
        style={styles.input}
        placeholder="Vehicle Type"
        placeholderTextColor="#88DAC9"
        value={vehicleType}
        onChangeText={setVehicleType}
      />
      <TextInput
        style={styles.input}
        placeholder="Seats"
        placeholderTextColor="#88DAC9"
        value={seats}
        onChangeText={setSeats}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile"
        placeholderTextColor="#88DAC9"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#88DAC9"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#88DAC9"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace("RiderLoginScreen")}>
        <Text style={styles.link}>Already have an account? Login</Text>
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
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  input: {
    width: "90%",
    height: 55,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    marginBottom: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#50E3C2",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    marginTop: 10,
    color: "#FFFFFF",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default RiderSignupScreen;
