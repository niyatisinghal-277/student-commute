import React, { useState } from "react";
import { 
  View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator 
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "./firebaseConfig"; // Import Firestore and Auth

const ReviewRideScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Ensure all route params have default values
  const {
    date = new Date().toISOString(),
    time = new Date().toISOString(),
    origin = "Unknown",
    destination = "Unknown",
    passengers = 1,
    instantBooking = false
  } = route.params || {};

  // Ensure time remains fixed throughout re-renders
const [fixedTime] = useState(time);
const [fixedDate] = useState(date);

  const [pricePerPassenger, setPricePerPassenger] = useState(100); // Default price
  const [rideComments, setRideComments] = useState("");
  const [loading, setLoading] = useState(false);

  const MAX_PRICE = 1000;
  const MIN_PRICE = 0;
  const PRICE_STEP = 10;

  const handleConfirm = async () => {
    if (pricePerPassenger < MIN_PRICE || pricePerPassenger > MAX_PRICE) {
      Alert.alert("Error", `Price per passenger must be between ₹${MIN_PRICE} and ₹${MAX_PRICE}.`);
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "User not authenticated.");
        setLoading(false);
        return;
      }

      const rideData = {
        riderId: user.uid,
        riderEmail: user.email,
        date,
        time,
        origin,
        destination,
        passengers,
        instantBooking,
        pricePerPassenger,
        rideComments,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "rides"), rideData);

      setLoading(false);
      navigation.navigate("SuccessScreen");
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to publish ride. Please try again.");
      console.error("Firestore Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Your Ride</Text>

      {/* Ride Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>📅 Date: {new Date(fixedDate).toDateString()}</Text>
        <Text style={styles.detail}>⏰ Time: {new Date(fixedTime).toLocaleTimeString()}</Text>
        <Text style={styles.detail}>📍 Source: {origin.name}</Text>
        <Text style={styles.detail}>🎯 Destination: {destination.name}</Text>
        <Text style={styles.detail}>👥 Passengers: {passengers}</Text>
        <Text style={styles.detail}>
          ⚡ Instant Booking: {instantBooking ? "Enabled ✅" : "Disabled ❌"}
        </Text>
      </View>

      {/* Price per Passenger - Stepper */}
      <Text style={styles.label}>Set Price per Passenger (₹)</Text>
      <View style={styles.stepperContainer}>
        <TouchableOpacity
          style={[styles.stepperButton, pricePerPassenger <= MIN_PRICE && styles.disabledButton]}
          onPress={() => setPricePerPassenger((prevPrice) => Math.max(pricePerPassenger - PRICE_STEP, MIN_PRICE))}
          disabled={pricePerPassenger <= MIN_PRICE}
        >
          <Text style={styles.stepperText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.priceText}>₹{pricePerPassenger}</Text>
        <TouchableOpacity
          style={[styles.stepperButton, pricePerPassenger >= MAX_PRICE && styles.disabledButton]}
          onPress={() => setPricePerPassenger((prevPrice) => Math.min(pricePerPassenger + PRICE_STEP, MAX_PRICE))}
          disabled={pricePerPassenger >= MAX_PRICE}
        >
          <Text style={styles.stepperText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Additional Comments */}
      <Text style={styles.label}>Additional Ride Details</Text>
      <TextInput
        style={styles.commentBox}
        placeholder="Enter ride comments..."
        value={rideComments}
        onChangeText={setRideComments}
        multiline
      />

      {/* Confirm Button */}
      {loading ? (
        <ActivityIndicator size="large" color="#2C7865" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm & Publish</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5F5EB",
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2C7865",
    marginBottom: 25,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  detailsContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  detail: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2C7865",
    marginBottom: 5,
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C7865",
    marginTop: 15,
    textAlign: "center",
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  stepperButton: {
    backgroundColor: "#2C7865",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 15,
  },
  stepperText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  priceText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C7865",
  },
  disabledButton: {
    backgroundColor: "#A0D1B6",
  },
  commentBox: {
    width: "90%",
    height: 80,
    borderWidth: 1,
    borderColor: "#2C7865",
    marginTop: 15,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    textAlignVertical: "top",
    fontSize: 16,
    color: "#2C7865",
  },
  button: {
    backgroundColor: "#2C7865",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

export default ReviewRideScreen;
