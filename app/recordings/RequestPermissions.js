// src/RequestPermissions.js or components/RequestPermissions.js

import React from 'react';
import { Alert, View, Text, Button } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const RequestPermissions = () => {
  const requestMicrophonePermission = async () => {
    const permission = PERMISSIONS.ANDROID.RECORD_AUDIO;
    
    try {
      const result = await request(permission);

      switch (result) {
        case RESULTS.GRANTED:
          console.log("Microphone permission granted");
          break;
        case RESULTS.DENIED:
          console.log("Microphone permission denied");
          break;
        case RESULTS.BLOCKED:
          console.log("Microphone permission blocked");
          break;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const requestStoragePermission = async () => {
    const permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    
    try {
      const result = await request(permission);

      switch (result) {
        case RESULTS.GRANTED:
          console.log("Storage permission granted");
          break;
        case RESULTS.DENIED:
          console.log("Storage permission denied");
          break;
        case RESULTS.BLOCKED:
          console.log("Storage permission blocked");
          break;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRequestPermissions = () => {
    Alert.alert(
      "Permissions Needed",
      "This app needs microphone and storage permissions to record audio and save files.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Grant Permissions",
          onPress: async () => {
            await requestMicrophonePermission();
            await requestStoragePermission();
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Request Microphone and Storage Permissions</Text>
      <Button title="Request Permissions" onPress={handleRequestPermissions} />
    </View>
  );
};

export default RequestPermissions;
