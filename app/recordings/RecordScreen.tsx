// app/recordings/RecordScreen.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { saveRecording } from '../../services/storageService';
import { useThemeColors } from '../../styles';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

export default function RecordScreen({ navigation }: any) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const themeColors = useThemeColors();

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return;

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    await recording?.stopAndUnloadAsync();
    const uri = recording?.getURI();
    await saveRecording(uri);
    setRecording(null);
    navigation.navigate('RecordingsList');
  };

  const pauseRecording = async () => {
    try {
      await recording?.pauseAsync();
      setIsRecording(false);
    } catch (err) {
      console.error('Failed to pause recording:', err);
    }
  };

  const resumeRecording = async () => {
    try {
      await recording?.startAsync();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to resume recording:', err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.iconContainer}>
        {recording ? (
          isRecording ? (
            // Show pause icon while recording
            <TouchableOpacity onPress={pauseRecording}>
              <FontAwesome name="pause" size={50} color={themeColors.primary} />
            </TouchableOpacity>
          ) : (
            // Show resume icon when paused
            <TouchableOpacity onPress={resumeRecording}>
              <FontAwesome name="play" size={50} color={themeColors.primary} />
            </TouchableOpacity>
          )
        ) : (
          // Show record icon if not recording
          <TouchableOpacity onPress={startRecording}>
            <FontAwesome name="microphone" size={40} color={themeColors.primary} />
          </TouchableOpacity>
        )}
        
        {recording && (
          // Show stop icon if recording is in progress or paused
          <TouchableOpacity onPress={stopRecording} style={styles.stopButton}>
            <MaterialIcons name="stop" size={40} color={themeColors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {recording && <Text style={[styles.recordingText, { color: themeColors.text }]}>
        {isRecording ? "Recording in progress..." : "Recording paused"}
      </Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButton: {
    marginLeft: 20,
  },
  recordingText: {
    marginTop: 10,
    fontSize: 16,
  },
});
