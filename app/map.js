import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { db, auth } from "./firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const GOOGLE_MAPS_API_KEY = "AIzaSyCjNsZDMlhndRmHUKoywto7ErVeBdnm-6c";

const Map = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const navigation = useNavigation();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "drivers"));
        const driverList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDrivers(driverList);
      } catch (err) {
        setError("Error loading drivers");
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const saveRouteToFirebase = async () => {
    if (!origin || !destination) {
      Alert.alert("Error", "Please select both origin and destination.");
      return;
    }

    try {
      await addDoc(collection(db, "rides"), {
        riderId: user.uid,
        riderEmail: user.email,
        source: origin.name,
        destination: destination.name,
        timestamp: new Date(),
      });

      navigation.navigate("PublishRideScreen", { origin, destination });
    } catch (error) {
      console.error("Error saving route:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      {/* Autocomplete Fields */}
      <View style={styles.autocompleteWrapper}>
        <GooglePlacesAutocomplete
          placeholder="Enter origin"
          fetchDetails={true}
          onPress={(data, details = null) => {
            if (details) {
              setOrigin({
                name: data.description,
                coords: {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                },
              });
            }
          }}
          query={{ key: GOOGLE_MAPS_API_KEY, language: "en" }}
          styles={autocompleteStyles}
          enablePoweredByContainer={false}
        />

        <GooglePlacesAutocomplete
          placeholder="Enter destination"
          fetchDetails={true}
          onPress={(data, details = null) => {
            if (details) {
              setDestination({
                name: data.description,
                coords: {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                },
              });
            }
          }}
          query={{ key: GOOGLE_MAPS_API_KEY, language: "en" }}
          styles={{ ...autocompleteStyles, container: { ...autocompleteStyles.container, marginTop: 70 } }}
          enablePoweredByContainer={false}
        />
      </View>

      {/* Map Section */}
      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {drivers.map((driver) => (
            <Marker
              key={driver.id}
              coordinate={{
                latitude: driver.location.lat,
                longitude: driver.location.lng,
              }}
              title={driver.name}
            />
          ))}

          {origin && destination && (
            <MapViewDirections
              origin={origin.coords}
              destination={destination.coords}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={3}
              strokeColor="blue"
            />
          )}
        </MapView>

        {loading && <ActivityIndicator size="large" color="blue" style={{ position: "absolute", top: "50%" }} />}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.button} onPress={saveRouteToFirebase}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  autocompleteWrapper: {
    position: "absolute",
    top: 20,
    width: "100%",
    paddingHorizontal: 20,
    zIndex: 2,
  },
  mapWrapper: {
    flex: 1,
    marginTop: 150,
    zIndex: 0,
  },
  map: {
    flex: 1,
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    position: "absolute",
    bottom: 70,
    width: "100%",
  },
});

const autocompleteStyles = {
  container: {
    flex: 0,
    zIndex: 999,
  },
  textInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    backgroundColor: "#fff",
  },
  listView: {
    zIndex: 999,
    backgroundColor: "#fff",
  },
};

export default Map;
