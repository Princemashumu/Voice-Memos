import React from "react";
import { Alert, View, Text, Button, Platform } from "react-native";
import {
  request,
  check,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from "react-native-permissions";

const RequestPermissions = () => {
  const requestPermission = async (permission, permissionName) => {
    try {
      const result = await request(permission);

      switch (result) {
        case RESULTS.GRANTED:
          console.log(`${permissionName} permission granted`);
          break;
        case RESULTS.DENIED:
          Alert.alert(
            `${permissionName} Permission Denied`,
            "You can grant this permission later in app settings."
          );
          break;
        case RESULTS.BLOCKED:
          Alert.alert(
            `${permissionName} Permission Blocked`,
            "Permission is blocked. Open settings to enable it manually.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: openSettings },
            ]
          );
          break;
        default:
          console.log(`${permissionName} permission result:`, result);
      }
    } catch (error) {
      console.error(`Error requesting ${permissionName} permission:`, error);
    }
  };

  const handleRequestPermissions = async () => {
    const micPermission =
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.RECORD_AUDIO
        : PERMISSIONS.IOS.MICROPHONE;

    const storagePermission =
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
        : PERMISSIONS.IOS.MEDIA_LIBRARY;

    await requestPermission(micPermission, "Microphone");
    await requestPermission(storagePermission, "Storage");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Request Microphone and Storage Permissions</Text>
      <Button title="Request Permissions" onPress={handleRequestPermissions} />
    </View>
  );
};

export default RequestPermissions;
