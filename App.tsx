import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens
import LoginSignup from './app/recordings/LoginSignup'; // Path to your LoginSignup component
import RecordScreen from './app/recordings/RecordScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const fadeAnim = useState(new Animated.Value(1))[0]; // Fade animation state

  useEffect(() => {
    // Start fading the splash screen after 2 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000, // Fade out duration
        useNativeDriver: true,
      }).start();

      // Hide the splash screen completely after fade out
      setTimeout(() => {
        setIsSplashVisible(false);
      }, 1000); // Match the fade duration
    }, 2000); // Start fading after 2 seconds

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, [fadeAnim]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Splash Screen Transition */}
        {isSplashVisible ? (
          <Stack.Screen name="Splash">
            {() => (
              <Animated.View
                style={[styles.splashContainer, { opacity: fadeAnim }]}
              >
                <ImageBackground
                  source={require('./assets/VOICE MEMOS (2).png')}
                  style={styles.imageBackground}
                  resizeMode="contain" // Makes sure the image is scaled properly
                />
              </Animated.View>
            )}
          </Stack.Screen>
        ) : (
          // Redirect to LoginSignup after splash
          <Stack.Screen name="LoginSignup" component={LoginSignup} />
          // <Stack.Screen name="RecordScreen" component={RecordScreen}/>
        )}
        {/* You can add more screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    
  },
  imageBackground: {
    width: 100, 
    height: 100,
    // borderRadius: "", 
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Ensures the image doesn't overflow the border radius
  },
});
