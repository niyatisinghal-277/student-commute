import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { startLiveLocationSharing } from '../utils/startLiveLocationUtils';
import * as Location from 'expo-location';

export default function ShareLocationScreen() {
  const { userId } = useLocalSearchParams();
  const [location, setLocation] = useState(null);
  const watchRef = useRef(null);

  useEffect(() => {
    const startTracking = async () => {
      try {
        watchRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          (loc) => {
            const coords = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            };
            setLocation(coords);
            startLiveLocationSharing(userId); // Upload to Firestore
          }
        );
      } catch (e) {
        console.error('Error in tracking:', e);
      }
    };

    startTracking();

    return () => {
      if (watchRef.current) {
        watchRef.current.remove();
      }
    };
  }, []);

  if (!location) {
    return (
      <View style={styles.center}>
        <Text>Sharing live location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={{
        ...location,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}>
        <Marker coordinate={location} title="Your Location" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
