import * as Location from "expo-location";

export const getCurrentLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Permission to access location was denied");
  }

  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

  const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });

  const readableAddress = `${place.name || ""}, ${place.street || ""}, ${place.city || place.subregion || ""}`;
  return readableAddress.trim();
};
