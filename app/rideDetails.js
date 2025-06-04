import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { startSharingLocation, stopSharingLocation } from './utils/startLiveLocationUtils';
import { getAuth } from "firebase/auth";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";

const RideDetails = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const route = useRoute();
  const localParams = useLocalSearchParams();
  const { ride: rideParamRoute } = route.params || {};
  const { ride: rideParamLocal, payLater } = localParams;

  const [ride, setRide] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    let parsedRide = rideParamRoute || rideParamLocal;
    try {
      if (typeof parsedRide === "string") {
        parsedRide = JSON.parse(parsedRide);
      }
      if (parsedRide && parsedRide.id) {
        setRide(parsedRide);
      }
    } catch (e) {
      console.warn("Invalid ride data:", e);
    }
  }, [rideParamRoute, rideParamLocal]);

  useEffect(() => {
    if (payLater === "true" && ride?.id) {
      handleBookRide();
    }
  }, [payLater, ride]);

  if (!ride || !ride.id) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: No ride details available.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.canGoBack() ? navigation.goBack() : router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const rideDate = new Date(ride.date?.toDate?.() || ride.date);
  const rideTime = new Date(ride.time?.toDate?.() || ride.time);

  const handleBookRide = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "You must be logged in to book a ride.");
        setLoading(false);
        return;
      }

      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, where("rideId", "==", ride.id), where("passengerId", "==", user.uid));
      const existingBookings = await getDocs(q);

      if (!existingBookings.empty) {
        Alert.alert("Already Booked", "You have already booked this ride.");
        setLoading(false);
        return;
      }

      await addDoc(bookingsRef, {
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
      });

      Alert.alert("Success", "Ride booked successfully!");
      navigation.canGoBack() ? navigation.goBack() : router.back();
    } catch (error) {
      console.error("Error booking ride:", error);
      Alert.alert("Error", "Failed to book ride. Please try again.");
    }
    setLoading(false);
  };

  const handleProceedToPayment = () => {
    router.push({
      pathname: "/paymentScreen",
      params: { ride: JSON.stringify(ride) }
    });
  };

  const handleLocationToggle = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) {
        Alert.alert("Error", "You must be logged in to share location.");
        return;
      }

      if (!isSharing) {
        await startSharingLocation(ride.id, user.uid);
        router.push({
          pathname: '/share-location/[userId]',
          params: { userId: user.uid },
        });
      } else {
        await stopSharingLocation(ride.id, user.uid);
      }

      setIsSharing(!isSharing);
    } catch (err) {
      console.error("Location sharing error:", err);
      Alert.alert("Location Error", err.message || "Failed to toggle location sharing.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ride Details</Text>

      <Text style={styles.detail}>🚗 Rider: {ride.riderEmail}</Text>
      <Text style={styles.detail}>📍 Source: {ride.origin?.name || "N/A"}</Text>
      <Text style={styles.detail}>📍 Destination: {ride.destination?.name || "N/A"}</Text>
      <Text style={styles.detail}>💺 Available Seats: {ride.passengers}</Text>
      <Text style={styles.detail}>💰 Price per Passenger: ₹{ride.pricePerPassenger}</Text>
      <Text style={styles.detail}>📝 Comments: {ride.rideComments || "No comments"}</Text>
      <Text style={styles.detail}>⏰ Date: {rideDate.toLocaleDateString()}</Text>
      <Text style={styles.detail}>
        ⏰ Time: {rideTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>

      <TouchableOpacity
        style={[styles.bookButton, { backgroundColor: "#FF9800" }]}
        onPress={handleProceedToPayment}
        disabled={loading}
      >
        <Text style={styles.bookButtonText}>
          {loading ? "Redirecting..." : "Pay Now (UPI)"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleBookRide}
        disabled={loading}
      >
        <Text style={styles.bookButtonText}>
          {loading ? "Booking..." : "Pay Later"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.bookButton,
          { backgroundColor: isSharing ? "#F44336" : "#2196F3" },
        ]}
        onPress={handleLocationToggle}
      >
        <Text style={styles.bookButtonText}>
          {isSharing ? "Stop Sharing Location" : "Share Live Location"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#4A90E2", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#FFFFFF", marginBottom: 20 },
  detail: { color: "#333", fontSize: 18, marginBottom: 10, textAlign: "center" },
  button: { backgroundColor: "#FFFFFF", paddingVertical: 12, borderRadius: 8, width: "80%", alignItems: "center", marginTop: 20 },
  buttonText: { color: "#50E3C2", fontSize: 18, fontWeight: "bold" },
  errorText: { color: "#FFF", fontSize: 18, textAlign: "center", marginBottom: 20 },
  bookButton: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 8, marginTop: 20 },
  bookButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});

export default RideDetails;