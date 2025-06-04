// utils/startLiveLocationUtils.js
import * as Location from 'expo-location';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from "../firebaseConfig";

let locationSubscription = null;

export const startSharingLocation = async (rideId, userId) => {
  // 1. Ask for location permissions
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission not granted');
  }

  // 2. Start watching position
  locationSubscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000, // every 5 seconds
      distanceInterval: 10, // or every 10 meters
    },
    async (location) => {
      const { latitude, longitude } = location.coords;

      // 3. Update Firestore
      const locationRef = doc(db, `rideLocations/${rideId}/passengerLocations/${userId}`);
      await setDoc(locationRef, {
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });
    }
  );
};

export const stopSharingLocation = async (rideId, userId) => {
  // 1. Stop background tracking
  if (locationSubscription) {
    locationSubscription.remove();
    locationSubscription = null;
  }

  // 2. Optionally delete the user's location doc
  const locationRef = doc(db, `rideLocations/${rideId}/passengerLocations/${userId}`);
  await deleteDoc(locationRef);
};
