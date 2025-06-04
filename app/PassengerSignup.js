import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { auth, db } from "./firebaseConfig"; // Ensure correct path to your Firebase config
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const PassengerSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [idCardImage, setIdCardImage] = useState(null);
  const [isIdValid, setIsIdValid] = useState(false);
  const [usn, setUsn] = useState("");
  const router = useRouter();

  // Function to pick an image from the device
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      setIdCardImage(result.assets[0]);
      console.log("Image picked successfully:", result.assets[0].uri); // Debug log
    } else {
      console.log("Image picking canceled");
    }
  };

  // Function to validate the ID card using OCR extracted text
  const validateIdCard = (extractedText) => {
    console.log("Extracted Text:", extractedText); // Debug log
    const universityRegex = /DAHANAL SAOAP UNTVRSITY/i;
    const regNoRegex = /ENG\d{2}CS\d{4}/;
    const branchRegex = /B Tech - CSE/i;
    const academicYearRegex = /202\d - 202\d/;
    const dobRegex = /\d{2}-\d{2}-\d{4}/;

    const isUniversityValid = universityRegex.test(extractedText);
    const isRegNoValid = regNoRegex.test(extractedText);
    const isBranchValid = branchRegex.test(extractedText);
    const isAcademicYearValid = academicYearRegex.test(extractedText);
    const isDobValid = dobRegex.test(extractedText);
    // USN validation
    const usnRegex = /ENG\d{2}CS\d{4}/;
    const extractedUsnMatch = extractedText.match(usnRegex);
    const extractedUsn = extractedUsnMatch ? extractedUsnMatch[0] : "";
    const isUsnMatch = extractedUsn.toLowerCase() === usn.toLowerCase();

    const nameRegex = /Name\s*-\s*([A-Z\s]+)/i;
    const extractedNameMatch = extractedText.match(nameRegex);
    const extractedName = extractedNameMatch ? extractedNameMatch[1].trim() : "";
    const isNameMatch = extractedName.toLowerCase() === name.toLowerCase();

    console.log("Validation Results:", {
      isUniversityValid,
      isRegNoValid,
      isBranchValid,
      isAcademicYearValid,
      isDobValid,
      isNameMatch,
      isUsnMatch
    }); // Debug log

    return (
      isUniversityValid &&
      isRegNoValid &&
      isBranchValid &&
      isAcademicYearValid &&
      isDobValid &&
      isNameMatch
    );
  };

  // Updated function to handle ID card validation using Google Vision API
  const handleIdCardValidation = async () => {
    console.log("Validate ID Card button pressed"); // Debug log
    if (!idCardImage) {
      Alert.alert("Error", "Please select an ID card image.");
      console.log("No image selected"); // Debug log
      return;
    }

    try {
      console.log("Reading image as base64:", idCardImage.uri); // Debug log
      const base64ImageData = await FileSystem.readAsStringAsync(idCardImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const apiKey = "AIzaSyA3Il9ntFtzIP_awRvgPnw8Fa5UlM0CtU0";
      const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
      const requestData = {
        requests: [
          {
            image: { content: base64ImageData },
            features: [{ type: "TEXT_DETECTION", maxResults: 1 }],
          },
        ],
      };

      console.log("Sending request to Google Vision API..."); // Debug log
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        timeout: 10000,
      });

      const apiResponse = await response.json();
      console.log("Google Vision API response:", apiResponse); // Debug log

      const extractedText = apiResponse.responses[0]?.textAnnotations[0]?.description;
      if (!extractedText) {
        Alert.alert("Error", "No text could be extracted from the ID card image.");
        console.log("No text extracted from image"); // Debug log
        return;
      }

      const isValid = validateIdCard(extractedText);
      setIsIdValid(isValid);

      if (isValid) {
        Alert.alert("Success", "ID card validated successfully!");
        console.log("ID card validation successful"); // Debug log
      } else {
        Alert.alert(
          "Error",
          "Invalid ID card. Ensure it matches the DSU student ID format."
        );
        console.log("ID card validation failed"); // Debug log
      }
    } catch (error) {
      console.error("ID Card Validation Failed:", error.message); // Debug log
      if (error.code === "ECONNABORTED") {
        Alert.alert("Error", "Request timed out. Please check your network connection.");
      } else {
        Alert.alert("Validation Failed", `Error: ${error.message}`);
      }
    }
  };

  const handleSignup = async () => {
    if (!name || !email || !age || !contact || !gender || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (isNaN(age) || age < 18 || age > 100) {
      Alert.alert("Error", "Enter a valid age between 18 and 100.");
      return;
    }

    if (!/^\d{10}$/.test(contact)) {
      Alert.alert("Error", "Enter a valid 10-digit contact number.");
      return;
    }

    if (!/^ENG\d{2}CS\d{4}$/.test(usn)) {
      Alert.alert("Error", "Enter a valid USN (e.g., ENG21CS0268).");
      return;
    }

    if (!isIdValid) {
      Alert.alert("Error", "Please upload and validate your ID card first.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        age: parseInt(age, 10),
        contact,
        usn,
        gender,
      });

      Alert.alert("Success", "Signup Successful!");
      router.push("/passengerLogin");
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Passenger Signup</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#D0E1F9"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#D0E1F9"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Age"
          placeholderTextColor="#D0E1F9"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          placeholderTextColor="#D0E1F9"
          value={contact}
          onChangeText={setContact}
          keyboardType="phone-pad"
        />
        
        <TextInput
         style={styles.input}
         placeholder="USN (e.g., ENGXXXX0XXX)"
         placeholderTextColor="#D0E1F9"
         value={usn}
         onChangeText={setUsn}
         autoCapitalize="characters"
         />

        <TextInput
          style={styles.input}
          placeholder="Gender (M/F/O)"
          placeholderTextColor="#D0E1F9"
          value={gender}
          onChangeText={setGender}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#D0E1F9"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>
            {idCardImage ? "Image Selected" : "Pick ID Card Image"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleIdCardValidation}>
          <Text style={styles.buttonText}>Validate ID Card</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/passengerLogin")}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4A90E2",
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: "center",
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
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
    color: "#4A90E2",
    fontSize: 22,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  link: {
    marginTop: 25,
    marginBottom: 20,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default PassengerSignup;