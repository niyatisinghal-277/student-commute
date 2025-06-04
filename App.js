
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RiderSignupScreen from './app/RiderSignupScreen'; // Adjust path if necessary
import RiderLoginScreen from './app/RiderLoginScreen'; // Adjust path if necessary
import ReviewRideScreen from './app/ReviewRideScreen';
import SuccessScreen from './app/SuccessScreen';
import PassengerSignup from './app/PassengerSignup';
import { StyleSheet } from 'react-native';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="RiderSignupScreen">
        <Stack.Screen name="RiderSignupScreen" component={RiderSignupScreen} />
        <Stack.Screen name="RiderLoginScreen" component={RiderLoginScreen} />
        <Stack.Screen name="ReviewRideScreen" component={ReviewRideScreen} />
        <Stack.Screen name="SuccessScreen" component={SuccessScreen} />

        <Stack.Screen name="PassengerSignup" component={PassengerSignup} />

        <Stack.Screen name="rideDetails" component={RideDetails} />
  <Stack.Screen name="paymentScreen" component={paymentScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({}); // Empty styles if not used