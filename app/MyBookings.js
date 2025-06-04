import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";
import { useNavigation } from "@react-navigation/native";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert("Error", "You must be logged in to view your bookings.");
          return;
        }

        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("passengerId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const userBookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(userBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        Alert.alert("Error", "Could not fetch bookings. Please try again.");
      }
      setLoading(false);
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      setBookings(bookings.filter(booking => booking.id !== bookingId));
      Alert.alert("Success", "Booking canceled successfully.");
    } catch (error) {
      console.error("Error canceling booking:", error);
      Alert.alert("Error", "Could not cancel booking. Please try again.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#50E3C2" style={{ flex: 1, justifyContent: "center" }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>

      {bookings.length === 0 ? (
        <Text style={styles.noBookings}>No bookings found.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bookingCard}>
              <Text style={styles.detail}>🚗 Rider: {item.riderEmail}</Text>
              <Text style={styles.detail}>📍 From: {item.source}</Text>
              <Text style={styles.detail}>📍 To: {item.destination}</Text>
              <Text style={styles.detail}>💰 Price: ₹{item.price}</Text>
              <Text style={styles.detail}>⏰ Date: {item.date.toDate().toLocaleDateString()}</Text>
              <Text style={styles.detail}>⏰ Time: {item.time.toDate().toLocaleTimeString()}</Text>

              <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelBooking(item.id)}>
                <Text style={styles.cancelButtonText}>Cancel Booking</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#4A90E2", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#FFFFFF", textAlign: "center", marginBottom: 20 },
  noBookings: { textAlign: "center", fontSize: 18, color: "#FFFFFF", marginTop: 20 },
  bookingCard: { backgroundColor: "#FFF", padding: 15, borderRadius: 10, marginBottom: 10 },
  detail: { color: "#333", fontSize: 16, marginBottom: 5 },
  cancelButton: { backgroundColor: "#FF5733", padding: 10, borderRadius: 5, marginTop: 10, alignItems: "center" },
  cancelButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});

export default MyBookings;