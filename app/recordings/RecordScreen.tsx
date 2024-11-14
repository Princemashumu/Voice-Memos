// app/recordings/RecordScreen.tsx
import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { Audio } from 'expo-av';
import { saveRecording } from '../../services/storageService';

export default function RecordScreen({ navigation }: any) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return;

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = async () => {
    setRecording(null);
    await recording?.stopAndUnloadAsync();
    const uri = recording?.getURI();
    await saveRecording(uri);
    navigation.navigate('RecordingsList');
  };

  return (
    <View>
      <Button title={recording ? "Stop Recording" : "Start Recording"} onPress={recording ? stopRecording : startRecording} />
      {recording && <Text>Recording in progress...</Text>}
    </View>
  );
}
