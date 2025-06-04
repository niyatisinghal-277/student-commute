import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCkO0BPoO8HWvIDYY99P_VAzd4WChgABrE",
  authDomain: "carpooling-8ba60.firebaseapp.com",
  projectId: "carpooling-8ba60",
  storageBucket: "carpooling-8ba60.firebasestorage.app",
  messagingSenderId: "624688456635",
  appId: "1:624688456635:web:4c1d81552d0a4c3de7da9e",
  measurementId: "G-CJ5GKDSRTH"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

// Export the instances
export { auth, db, app };
export default app;