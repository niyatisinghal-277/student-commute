import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button, ActivityIndicator } from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { useNavigation, useRoute } from "@react-navigation/native";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";

const RazorpayPayment = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { ride } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      Alert.alert("Error", "User not logged in.");
      navigation.goBack();
      return;
    }
    initiatePayment();
  }, []);

  const initiatePayment = async () => {
    setLoading(true);
    setError(null);

    const options = {
      description: "Ride Payment",
      currency: "INR",
      key: "rzp_test_m2y9JHluuU4UrH",
      amount: ride.pricePerPassenger * 100, // paise
      name: "Carpool App",
      prefill: {
        email: user.email,
        contact: "", // Add contact if available
        name: user.displayName || "Passenger",
      },
      theme: { color: "#4CAF50" },
    };
console.log("Payment amount (paise):", ride.pricePerPassenger * 100);

    try {
      const paymentData = await RazorpayCheckout.open(options);

      // Payment successful, add booking
      await addDoc(collection(db, "bookings"), {
        rideId: ride.id,
        passengerId: user.uid,
        passengerEmail: user.email,
        source: ride.source?.name || "",
        destination: ride.destination?.name || "",
        date: ride.date,
        time: ride.time,
        riderId: ride.riderId,
        riderEmail: ride.riderEmail,
        price: ride.pricePerPassenger,
        paymentId: paymentData.razorpay_payment_id,
        paymentStatus: "Paid",
      });

      Alert.alert("Success", "Payment successful! Ride booked.");
      navigation.navigate("PaymentSuccess"); // check your route name
    } catch (err) {
      console.log("Payment error or cancelled:", err);
      setError("Payment cancelled or failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.text}>Processing payment...</Text>
        </>
      )}

      {!loading && error && (
        <>
          <Text style={[styles.text, { color: "red", marginBottom: 20 }]}>{error}</Text>
          <Button title="Retry Payment" onPress={initiatePayment} color="#4CAF50" />
          <Button title="Cancel" onPress={() => navigation.goBack()} color="grey" />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  text: { fontSize: 18, color: "#333", textAlign: "center" },
});

export default RazorpayPayment;