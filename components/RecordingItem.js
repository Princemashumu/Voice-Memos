import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/RecordScreenStyles';

export const RecordingItem = ({ item, onPlay, onPause, onDelete }) => (
  <View style={styles.recordingItem}>
    <MaterialIcons name="audiotrack" size={24} color="#ff6347" />
    <View style={styles.recordingDetails}>
      <Text style={styles.recordingName}>{item.name}</Text>
      <Text style={styles.recordingTime}>{`${item.time}s`}</Text>
    </View>
    <View style={styles.playbackControls}>
      <TouchableOpacity onPress={() => onPlay(item.uri)}>
        <MaterialIcons name="play-arrow" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPause}>
        <MaterialIcons name="pause" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(item.id, item.uri)}>
        <MaterialIcons name="delete" size={30} color="white" />
      </TouchableOpacity>
    </View>
  </View>
);
