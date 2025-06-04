// app/PaymentSuccess.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const PaymentSuccess = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ride Booked & Payment Completed!</Text>
      <Text style={styles.text}>Thank you for booking. We hope you have a great ride.</Text>
      <Button title="Go to Dashboard" onPress={() => router.replace("/PassengerDashboard")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "green" },
  text: { fontSize: 16, marginBottom: 20, textAlign: "center" },
});

export default PaymentSuccess;