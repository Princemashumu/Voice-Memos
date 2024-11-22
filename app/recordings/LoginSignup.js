import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';

export default function LoginSignup({ navigation }) {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please fill out both fields.');
      return;
    }

    setLoading(true);

    try {
      // Replace this with your authentication API
      // const response = await yourAuthApi.login(email, password);
      console.log('Login with email:', email, 'password:', password);

      // On success
      setLoading(false);
      Alert.alert('Login Success', 'You are now logged in!');
      // Navigate to another screen, e.g., home screen
      navigation.navigate('Home');
    } catch (error) {
      setLoading(false);
      Alert.alert('Login Failed', 'There was an error logging you in. Please try again.');
    }
  };

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please fill out both fields.');
      return;
    }

    setLoading(true);

    try {
      // Replace this with your authentication API
      // const response = await yourAuthApi.signup(email, password);
      console.log('Signup with email:', email, 'password:', password);

      // On success
      setLoading(false);
      Alert.alert('Signup Success', 'Your account has been created!');
      // Navigate to login screen
      setIsLogin(true);
    } catch (error) {
      setLoading(false);
      Alert.alert('Signup Failed', 'There was an error creating your account. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isLogin ? 'Login' : 'Sign Up'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={isLogin ? handleLogin : handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.toggleText}>
        <Text style={styles.toggleText}>
          {isLogin ? 'Don\'t have an account? Sign Up' : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
    color:'white'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
    coloe:'white'
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  toggleText: {
    marginTop: 15,
    color: '#007BFF',
  },
});
