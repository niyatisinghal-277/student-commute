import { getAuth } from "firebase/auth";
import { getCurrentLocation } from "./utils/getCurrentLocation";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker"; // Import date picker
import { Timestamp } from "firebase/firestore"; // Import Timestamp for Firestore queries


const PassengerDashboard = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // NEW: Track if the search has been performed
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);

  const navigation = useNavigation();
  
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
   useEffect(() => {
  if (!useCurrentLocation) return;

  (async () => {
    try {
      const address = await getCurrentLocation();
      setSource(address);
    } catch (error) {
      console.log("Error fetching location:", error.message);
    }
  })();
}, [useCurrentLocation]);

  const fetchRides = async () => {
    if (!source || !destination || !selectedDate) {
      alert("Please enter source, destination and date.");
      return;
    }

    setLoading(true);
    setSearched(true); // Set searched to true when search button is clicked

    try {
      // Convert the selected date to Firestore timestamp range (start & end of the day)
    const startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);
    const startOfDay = Timestamp.fromDate(startDate);

    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);
    const endOfDay = Timestamp.fromDate(endDate);

    console.log("Fetching rides for:", {
      source: source.trim().toLowerCase(),
      destination: destination.trim().toLowerCase(),
      startOfDay: startOfDay.toDate(),
      endOfDay: endOfDay.toDate(),
    });

      const ridesRef = collection(db, "rides");
      const q = query(
        ridesRef,
       // where("origin.name", "==", source.trim().toLowerCase()),
        //where("destination.name", "==", destination.trim().toLowerCase()),
        where("date", ">=", startOfDay),
        where("date", "<=", endOfDay) // Filter by selected date
      );

      const querySnapshot = await getDocs(q);
      /*const availableRides = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched Rides:", availableRides);

      setRides(availableRides);*/
      const allRides = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filteredRides = allRides.filter((ride) => {
      const rideOrigin = ride.origin?.name?.toLowerCase?.() || ride.source?.toLowerCase?.() || "";
      const rideDestination = ride.destination?.name?.toLowerCase?.() || ride.destination?.toLowerCase?.() || "";

      return (
        rideOrigin.includes(source.trim().toLowerCase()) &&
        rideDestination.includes(destination.trim().toLowerCase())
      );
    });
console.log("Fetched Rides:", filteredRides);
    setRides(filteredRides);
    } catch (error) {
      console.error("Error fetching rides:", error);
      alert("Error fetching rides. Please try again.");
    } finally {
      //console.log("ride found?", availableRides);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find a Ride</Text>
      <TouchableOpacity
  style={styles.toggleButton}
  onPress={() => {
    setUseCurrentLocation((prev) => !prev);
    if (useCurrentLocation) {
      setSource(""); // Clear field when switching to manual
    }
  }}
>
  <Text style={styles.toggleText}>
    {useCurrentLocation ? "Switch to Manual Entry" : "Use Current Location"}
  </Text>
</TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Enter Source Location"
        placeholderTextColor="#B0C4DE"
        value={source}
        onChangeText={setSource}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Destination Location"
        placeholderTextColor="#B0C4DE"
        value={destination}
        onChangeText={setDestination}
      />
      <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.datePickerText}>
          {selectedDate.toDateString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={fetchRides}>
        <Text style={styles.buttonText}>Find Rides</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />}

      {searched && rides.length === 0 && !loading && (
        <Text style={styles.noRidesText}>No rides available for this route on the selected date.</Text>
      )}

      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.rideCard}
            onPress={() => navigation.navigate("rideDetails", { ride: item })}
          >
            <Text style={styles.rideText}>🚗 Rider: {item.riderEmail}</Text>
            <Text style={styles.rideText}>📍 {item.origin?.name} → {item.destination?.name}</Text>
            <Text style={styles.rideText}>💺 Seats: {item.passengers}</Text>
            <Text style={styles.rideText}>💰 Price: ₹{item.pricePerPassenger}</Text>
            <Text style={styles.rideText}>📅 Date: {new Date(item.date.seconds * 1000).toDateString()}</Text>
            <Text style={styles.rideText}>⏰ Time: {new Date(item.time?.toDate?.() || item.time).toLocaleTimeString()}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
      style={[styles.button, { backgroundColor: "#FFD700" }]}
      onPress={() => navigation.navigate("ShareLocationScreen", { userId })}
      >
        <Text style={styles.buttonText}>📍 Share My Live Location</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("MyBookings")}>
       <Text>View My Bookings</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "#4A90E2", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#FFFFFF", marginBottom: 20 },
  input: {
    width: "90%",
    height: 50,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#FFFFFF",
    fontSize: 16,
  },
  toggleButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10
  },
  toggleText: {
    color: "#333",
    fontWeight: "bold",
    textAlign: "center"
  },

  datePickerButton: { 
    backgroundColor: "#FFF", 
    paddingVertical: 12, 
    borderRadius: 8, 
    width: "90%", 
    alignItems: "center", 
    marginBottom: 10 
  },
  datePickerText: { color: "#4A90E2", fontSize: 18, fontWeight: "bold" },
  button: { backgroundColor: "#FFFFFF", paddingVertical: 12, borderRadius: 8, width: "90%", alignItems: "center", marginBottom: 20 },
  buttonText: { color: "#4A90E2", fontSize: 18, fontWeight: "bold" },
  noRidesText: { color: "#FFD700", fontSize: 18, marginTop: 20 },
  rideCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 2 },
    elevation: 3,
  },
  rideText: { color: "#333", fontSize: 16 },
});

export default PassengerDashboard;
