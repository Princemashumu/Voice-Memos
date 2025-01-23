// RecordingModal.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function RecordingModal({ modalAnimation, waveformAnimation, recordTime, onStop }) {
  return (
    <Animated.View 
      style={[
        styles.modalContainer,
        {
          opacity: modalAnimation,
          transform: [{
            translateY: modalAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [100, 0],
            }),
          }],
        },
      ]}
    >
      <View style={styles.modalContent}>
        <Animated.View
          style={[
            styles.waveform,
            {
              transform: [{
                scaleY: waveformAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1.5],
                }),
              }],
            },
          ]}
        />
        <Text style={styles.timer}>{recordTime}s</Text>
        <TouchableOpacity onPress={onStop} style={styles.stopButton}>
          <MaterialIcons name="stop" size={40} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent black overlay
  },
  modalContent: {
    backgroundColor: "rgba(51, 51, 51, 0.9)", // Semi-transparent dark background
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5, // Shadow for Android
  },
  waveform: {
    width: 200,
    height: 6,
    backgroundColor: "#ff6347",
    borderRadius: 3,
    marginVertical: 20,
  },
  timer: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  stopButton: {
    backgroundColor: "#ff6347",
    borderRadius: 50,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ff6347",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5, // Enhancing button visibility
  },
});
