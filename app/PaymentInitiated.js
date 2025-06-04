// app/PaymentInitiated.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const PaymentInitiated = () => {
  const router = useRouter();
  const { ride: rideString, paymentId } = useLocalSearchParams();
  const ride = JSON.parse(rideString || "{}");

  const handleConfirm = () => {
    router.replace({
      pathname: "/PaymentSuccess",
      params: { ride: JSON.stringify(ride), paymentId }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Initiated</Text>
      <Text style={styles.text}>
        If you were prompted by your UPI app, please complete the payment there.
      </Text>
      <Text style={styles.text}>Then press Confirm below.</Text>
      <Button title="Confirm Payment" onPress={handleConfirm} color="#4CAF50" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  text: { fontSize: 16, textAlign: "center", marginBottom: 10 },
});

export default PaymentInitiated;