// app/paymentScreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const PaymentScreen = () => {
  const router = useRouter();
  const { ride: rideString } = useLocalSearchParams();
  const ride = JSON.parse(rideString || "{}");

  const handlePayLater = () => {
    router.push({
      pathname: "/rideDetails",
      params: { ride: JSON.stringify(ride), payLater: "true" }
    });
  };

  const handlePayNow = () => {
    router.push({
      pathname: "/RazorpayWebView", // use lowercase if filename is lowercase
      params: { ride: JSON.stringify(ride) }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Payment Option</Text>
      <TouchableOpacity style={styles.button} onPress={handlePayNow}>
        <Text style={styles.buttonText}>Pay Now (UPI)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handlePayLater}>
        <Text style={styles.buttonText}>Pay Later</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  button: { backgroundColor: "#4A90E2", padding: 15, borderRadius: 8, marginVertical: 10, width: "80%", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default PaymentScreen;
