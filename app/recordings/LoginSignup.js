import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import {
  initializeApp,
  getApp,
  getApps,
} from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { StatusBar } from 'expo-status-bar';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCIYK60-qXsGs_7_XO9-KmSygzZ5wk6d8",
  authDomain: "voice-memos-2b296.firebaseapp.com",
  projectId: "voice-memos-2b296",
  storageBucket: "voice-memos-2b296.appspot.com",
  messagingSenderId: "492632608683",
  appId: "1:492632608683:web:50cad3db015949227c8cee",
  measurementId: "G-BJPXMSTZZ4",
};

// Initialize Firebase
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// Get Auth instance
const auth = getAuth(getApp());

// Custom Input Component
const CustomInput = ({ placeholder, value, onChangeText, secureTextEntry, keyboardType }) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    secureTextEntry={secureTextEntry}
    placeholderTextColor="#aaa"
    value={value}
    onChangeText={onChangeText}
    keyboardType={keyboardType || 'default'}
    autoCapitalize="none"
    autoCorrect={false}
  />
);

export default function LoginSignup({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateInput = () => {
    if (!email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'The email address is invalid.';
      case 'auth/user-not-found':
        return 'No user found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const handleLogin = async () => {
    if (!validateInput()) return;
  
    setLoading(true);
    Keyboard.dismiss();
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user.email);
      // Navigate to the home screen
      navigation.replace('RecordScreen'); // Adjust 'Home' to your desired screen
    } catch (error) {
      console.error('Login error:', error.code);
      Alert.alert('Login Failed', getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignup = async () => {
    if (!validateInput()) return;
  
    setLoading(true);
    Keyboard.dismiss();
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', userCredential.user.email);
      Alert.alert(
        'Success',
        'Your account has been created successfully!',
        [{ text: 'OK', onPress: () => setIsLogin(true) }]
      );
    } catch (error) {
      console.error('Signup error:', error.code);
      Alert.alert('Signup Failed', getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <ImageBackground
      source={require('../../assets/1732283085433_8f1b.jpg')}
      resizeMode="cover"
      style={styles.background}
    >
      <StatusBar style="auto" />
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <View style={styles.formContainer}>
            <View style={styles.topSection}>
  <Text style={styles.header}>{isLogin ? 'Login' : 'Sign Up'}</Text>
</View>

<CustomInput
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
/>

              
              <CustomInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={isLogin ? handleLogin : handleSignup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => {
                  setIsLogin(!isLogin);
                  setEmail('');
                  setPassword('');
                }} 
                style={styles.toggleContainer}
              >
                <Text style={styles.toggleText}>
                  {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height:'100%',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  container: {
    flex: 1,
    borderBottomLeftRadius: 250,
    borderBottomRightRadius: 250,
  },
  topSection: {
    width: '100%',
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)', // Semi-transparent for effect
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 250,
    borderBottomRightRadius: 250,
    marginBottom: 20, // Separates topSection from formContainer
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    width: '90%', // Adjust to fit smaller screens
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Slightly more opaque
    padding: 20,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333', // Better contrast with light background
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    fontSize: 16,
  },
  button: {
    width: '30%',
    height: 50,
    borderRadius:25,
    backgroundColor: '#FF1493',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleContainer: {
    marginTop: 15,
  },
  toggleText: {
    color: 'black',
    fontSize: 15,
    textAlign: 'center',
    fontWeight:'bold'
  },
});
