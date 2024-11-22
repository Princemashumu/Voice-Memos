import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground } from 'react-native';

export default function SplashScreen({ navigation }) {
  const fadeAnim = new Animated.Value(0); // Initial opacity value

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000, // 2 seconds
      useNativeDriver: true,
    }).start();

    // Navigate to the next screen after 3 seconds
    setTimeout(() => {
      navigation.replace('Home'); // Replace 'Home' with your next screen name
    }, 3000); // 3 seconds
  }, []);

  return (
    <ImageBackground
      source={require('assets/1732283085433_8f1b.jpg')} // Path to your background image
      style={styles.container}
    >
      <Animated.View style={{ ...styles.splashText, opacity: fadeAnim }}>
        <Text style={styles.splashText}>Welcome to My App</Text>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover', // To ensure the image covers the entire screen
  },
  splashText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
});
