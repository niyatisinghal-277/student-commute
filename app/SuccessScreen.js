import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

const SuccessScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("index"); // Replace with the actual home screen
    }, 3000); // Navigate after 3 seconds
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/success.json")} // Place animation file in assets
        autoPlay
        loop={false}
        style={styles.animation}
      />
      <Text style={styles.message}>Your ride has been successfully published.</Text>
      <Text style={styles.subMessage}>
        We'll notify you when passengers are interested in joining you.{"\n"}
        Thank you! 🚀
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5F5EB",
  },
  animation: {
    width: 150,
    height: 150,
  },
  message: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C7865",
    marginTop: 20,
    textAlign: "center",
  },
  subMessage: {
    fontSize: 16,
    color: "#2C7865",
    textAlign: "center",
    marginTop: 10,
  },
});

export default SuccessScreen;
