import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Animated } from 'react-native';
import RecordScreen from './app/recordings/RecordScreen';

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
    <View style={{ flex: 1 }}>
      {isSplashVisible ? (
        <Animated.View
          style={[styles.splashContainer, { opacity: fadeAnim }]}
        >
          <ImageBackground
            source={require('./assets/VOICE MEMOS.jpg')}
            style={styles.imageBackground}
            resizeMode="contain" // Makes sure the image is scaled properly
          >
          </ImageBackground>
        </Animated.View>
      ) : (
        <RecordScreen /> // Main app content after splash
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'black'
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Ensure it takes up full width
    height: '100%', // Ensure it takes up full height
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
