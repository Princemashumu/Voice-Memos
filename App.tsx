// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecordingsList from './app/recordings/RecordingsList';
import RecordScreen from './app/recordings/RecordScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RecordingsList">
        <Stack.Screen name="RecordingsList" component={RecordingsList} />
        <Stack.Screen name="RecordScreen" component={RecordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
