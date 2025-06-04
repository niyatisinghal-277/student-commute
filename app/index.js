import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import 'react-native-get-random-values';



const { width } = Dimensions.get("window");

export default function ChooseYourRole() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.mainTitle}>StudentCommute</Text>
      <Text style={styles.subtitle}>Safe, Reliable, and Affordable Rides</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.squareButton}
          onPress={() => router.push("/passengerLogin")}
        >
          <Ionicons name="person" size={60} color="white" style={styles.icon} />
          <Text style={styles.buttonTextLarge}>Passenger</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.squareButton, styles.riderButton]}
          onPress={() => router.push("/RiderLoginScreen")}
        >
          <Ionicons name="car" size={60} color="white" style={styles.icon} />
          <Text style={styles.buttonTextLarge}>Rider</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#EAEAEA",
    textAlign: "center",
  },
  mainTitle: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#B0B0B0",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  squareButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4A90E2",
    width: width * 0.4, // 40% of screen width
    height: width * 0.4, // Make it square
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#4A90E2",
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  riderButton: {
    backgroundColor: "#50E3C2",
  },
  buttonTextLarge: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 5,
    textAlign: "center",
  },
  icon: {
    marginBottom: 5,
  },
});