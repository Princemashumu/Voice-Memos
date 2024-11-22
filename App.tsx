import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens
import LoginSignup from './app/recordings/LoginSignup'; // Path to your LoginSignup component
import RecordScreen from './app/recordings/RecordScreen';
import SplashScreen from './app/SplashScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        {/* Splash Screen */}
        <Stack.Screen name="Splash" component={SplashScreen} />

        {/* Login/Signup Screen */}
        <Stack.Screen name="LoginSignup" component={LoginSignup} />

        {/* Other Screens */}
        <Stack.Screen name="RecordScreen" component={RecordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
