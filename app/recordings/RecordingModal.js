import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Helper function to format seconds into HH:MM:SS
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // Return formatted string as HH:MM:SS
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function RecordingModal({ modalAnimation, waveformAnimation, recordTime, onStop }) {
  return (
    <Animated.View
      style={[
        styles.modal,
        {
          transform: [
            {
              translateY: modalAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.time}>{formatTime(recordTime)}</Text>
      <Animated.View
        style={[
          styles.waveform,
          {
            transform: [
              {
                translateX: waveformAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 50],
                }),
              },
            ],
          },
        ]}
      />
      <TouchableOpacity onPress={onStop} style={styles.stopButton}>
        <MaterialIcons name="stop" size={50} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  waveform: {
    height: 5,
    backgroundColor: 'green',
    marginVertical: 20,
  },
  stopButton: {
    backgroundColor: 'red',
    borderRadius: 50,
    padding: 15,
  },
});
