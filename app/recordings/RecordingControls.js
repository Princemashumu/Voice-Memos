import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const RecordingControls = ({ isRecording, onStart, onStop }) => (
  <View style={styles.container}>
    {!isRecording ? (
      <TouchableOpacity onPress={onStart} style={styles.recordButton}>
        <FontAwesome name="circle" size={50} color="red" />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={onStop} style={styles.stopButton}>
        <MaterialIcons name="circle" size={50} color="green" />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 20 },
  recordButton: { justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', padding: 20, borderRadius: 50 },
  stopButton: { justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', padding: 20, borderRadius: 50 },
});

export default RecordingControls;
