import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import RecordingsList from './app/recordings/RecordingsList';
import RecordScreen from './app/recordings/RecordScreen';

// Create the stack navigator
const Stack = createNativeStackNavigator();

// Custom Header component
const CustomHeader = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.headerContainer}>
      {/* Back Arrow - Navigate directly to RecordingsList */}
      {/* <TouchableOpacity
        onPress={() => navigation.navigate('RecordingsList')}
        style={styles.arrowButton}
      >
        <MaterialIcons name="arrow-back" size={25} color="white" />
      </TouchableOpacity> */}
      <Text style={styles.headerText}>Edit</Text>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RecordScreen">
        <Stack.Screen
          name="RecordingsList"
          component={RecordingsList}
          options={{
            headerTitle: 'Voice Memos',
            headerStyle: { backgroundColor: '#f0f0f0' },
            headerTintColor: 'black',
          }}
        />
        <Stack.Screen
          name="RecordScreen"
          component={RecordScreen}
          options={({ navigation }) => ({
            header: () => <CustomHeader navigation={navigation} />, // Use the custom header
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  arrowButton: {
    padding: 10, // Adds padding around the arrow button
  },
  headerText: {
    fontSize: 18,
    fontFamily: 'Arial',
    color: 'white', // Ensure text is visible on the dark background
    fontWeight: 'bold',
  },
});
