import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

export default function SplashScreen({ navigation }) {
  const handleGetStarted = () => {
    navigation.replace('LoginSignup'); // Navigate to LoginSignup screen
  };

  return (
    <View style={styles.container}>
      {/* Top Section with Background Image */}
      <ImageBackground
  source={require('../assets/1732283085433_8f1b.jpg')} // Replace with your background image
  style={styles.topSection} // Styles for the container
  imageStyle={styles.imageStyle} // Styles applied to the actual image (e.g., borderRadius)
  resizeMode="cover" // Use resizeMode as a prop
>
      </ImageBackground>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Text style={styles.description}>
          The best app to record and manage your voice notes effortlessly.
        </Text>
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topSection: {
    flex: 2, // Occupies two-thirds of the screen
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 150, // Creates the circular border at the top
    borderBottomRightRadius: 150,
    overflow: 'hidden', // Ensures the image doesn't exceed the border radius
    width: '100%', // Ensures the background image covers the full width
  },
  imageStyle: {
    resizeMode: 'cover', // Ensures the image scales to fill while maintaining aspect ratio
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  bottomSection: {
    flex: 1, // Occupies one-third of the screen
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Ensures content doesn't overflow the border radius
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  description: {
    fontSize: 18, // Slightly larger text for better readability
    fontWeight: '600', // Semi-bold font weight
    color: '#455a64',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 30,
    letterSpacing: 0.5, // Adds slight spacing between letters
    lineHeight: 24, // Improves spacing between lines for better readability
  },
  getStartedButton: {
    backgroundColor: '#FF1493',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
