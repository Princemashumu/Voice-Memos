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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  modalContent: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '80%',
  },
  waveform: {
    width: 200,
    height: 4,
    backgroundColor: '#ff6347',
    marginVertical: 20,
  },
  timer: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  stopButton: {
    backgroundColor: '#ff6347',
    borderRadius: 30,
    padding: 10,
  },
});
