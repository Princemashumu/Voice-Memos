import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { saveRecording } from '../../services/storageService';
import { useThemeColors } from '../../styles';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

export default function RecordMemos({ navigation }: any) {  // Renamed to 'RecordMemos'
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const themeColors = useThemeColors();

  // Animated value for the waveform effect
  const waveHeight = useState(new Animated.Value(1))[0];

  // Start recording
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

      // Start animating the waveform during recording
      animateWaveform();
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    setIsRecording(false);
    await recording?.stopAndUnloadAsync();
    const uri = recording?.getURI();
    await saveRecording(uri);
    setRecording(null);

    // Stop the waveform animation
    waveHeight.stopAnimation();

    // Navigate to RecordingsList and hide the back arrow only
    navigation.navigate('RecordingsList', { hideBackButton: true });
  };

  // Pause recording
  const pauseRecording = async () => {
    try {
      await recording?.pauseAsync();
      setIsRecording(false);
    } catch (err) {
      console.error('Failed to pause recording:', err);
    }
  };

  // Resume recording
  const resumeRecording = async () => {
    try {
      await recording?.startAsync();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to resume recording:', err);
    }
  };

  // Animate the waveform (simple animation for demo)
  const animateWaveform = () => {
    Animated.loop(
      Animated.sequence([ 
        Animated.timing(waveHeight, {
          toValue: 2,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(waveHeight, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Animated waveform (simple visual representation) */}
      {isRecording && (
        <Animated.View style={[styles.waveform, { height: waveHeight }]} />
      )}

      <View style={styles.iconContainer}>
        {recording ? (
          isRecording ? (
            // Show pause icon while recording
            <TouchableOpacity onPress={pauseRecording}>
              <FontAwesome name="pause" size={20} color={themeColors.primary} />
            </TouchableOpacity>
          ) : (
            // Show resume icon when paused
            <TouchableOpacity onPress={resumeRecording}>
              <FontAwesome name="play" size={30} color={themeColors.primary} />
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

      {/* {recording && <Text style={[styles.recordingText, { color: themeColors.text }]}>
        {isRecording ? "Recording in progress..." : "Recording paused"}
      </Text>} */}
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
  waveform: {
    width: 250, // Adjust width for better visibility
    height: 250, // Initial height, will be animated
    backgroundColor: 'grey', // Soft white background
    marginBottom: 30,
    borderRadius: 5, // Rounded corners
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
    elevation: 4, // For Android
    overflow: 'hidden', // Ensures animation stays within the bounds
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
