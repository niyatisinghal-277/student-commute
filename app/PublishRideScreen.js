import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";



const PublishRideScreen = () => {
  const route = useRoute();
  const {origin, destination } = route.params;
  const navigation = useNavigation();
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [passengers, setPassengers] = useState("");
  const [instantBooking, setInstantBooking] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleNext = () => {
    if (!date || !time) {
      Alert.alert("Error", "Please enter date and time.");
      return;
    }
    navigation.navigate("ReviewRideScreen", {
      date,
      origin,
      destination,
      passengers,
      instantBooking,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Publish Ride</Text>

      {/* Travel Date */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text style={date ? styles.inputText : styles.placeholderText}>
          {date ? date.toDateString() : "Select Date"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}


      {/* Travel Time */}
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
        <Text style={time ? styles.inputText : styles.placeholderText}>
          {time ? time.toLocaleTimeString() : "Select Time"}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time || new Date()}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}

      {/* Number of Passengers */}
      <TextInput
        style={styles.input}
        value={passengers}
        onChangeText={setPassengers}
        keyboardType="numeric"
        placeholder="Enter No. of Passengers"
        placeholderTextColor="#4ABF9F"
      />

      {/* Instant Booking */}
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Instant Booking</Text>
        <TouchableOpacity
          style={[styles.switchButton, instantBooking && styles.switchButtonActive]}
          onPress={() => setInstantBooking(!instantBooking)}
        >
          <Text style={[styles.switchText, instantBooking && styles.switchTextActive]}>
            {instantBooking ? "Enabled" : "Disabled"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
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
    backgroundColor: "rgba(255, 255, 255, 0.5)", // LIGHTER BACKGROUND
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 1, height: 3 },
    shadowRadius: 3,
    justifyContent: "center",
  },
  inputText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2E6A5B",
    textAlign: "center",
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#4ABF9F", // NEW PLACEHOLDER COLOR
    textAlign: "center",
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
  switchContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  switchButton: {
    backgroundColor: "rgba(255, 255, 255, 0.4)", // Lighter switch button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  switchButtonActive: {
    backgroundColor: "#FFFFFF",
  },
  switchText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E6A5B",
  },
  switchTextActive: {
    color: "#50E3C2",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default PublishRideScreen;