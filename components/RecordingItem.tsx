import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';  // Import Audio from expo-av
import { updateRecordingName, deleteRecording } from '../services/storageService';

export function RecordingItem({ recording, onDelete, textStyle }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(recording.name);
  const [sound, setSound] = useState<Audio.Sound | null>(null);  // State for the sound
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null); // Duration of the recording
  const [currentTime, setCurrentTime] = useState<number>(0); // Current playback time

  // Load sound when the recording URI changes
  useEffect(() => {
    const loadSound = async () => {
      if (!recording.uri) {
        console.error('Recording URI is missing.');
        return;
      }

      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: recording.uri },
          { shouldPlay: false }
        );
        setSound(sound);

        // Get the duration of the recording
        const status = await sound.getStatusAsync();
        setDuration(status.durationMillis);
      } catch (error) {
        console.error('Error loading sound:', error);
      }
    };

    loadSound();

    // Cleanup on component unmount
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [recording.uri]);

  // Play or pause the sound
  const handlePlayPause = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);

    // Track current playback time
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isPlaying) {
        setCurrentTime(status.positionMillis);
      }
    });
  };

  // Handle name change for the recording
  const handleNameChange = async () => {
    if (newName.trim() !== '') {
      await updateRecordingName(recording.id, newName);
    }
    setIsEditing(false);
  };

  return (
    <View style={styles.item}>
      {isEditing ? (
        <TextInput
          style={styles.textInput}
          value={newName}
          onChangeText={setNewName}
          onBlur={handleNameChange}
          autoFocus
        />
      ) : (
        <Text style={[styles.text, textStyle]}>{recording.name}</Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <MaterialIcons name="edit" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(recording.id)}>
          <MaterialIcons name="delete" size={24} color="black" />
        </TouchableOpacity>

        {/* Play button */}
        <TouchableOpacity onPress={handlePlayPause}>
          <MaterialIcons
            name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {/* Display dropdown with duration and current time */}
      {isPlaying && (
        <View style={styles.durationContainer}>
          <Text style={styles.durationText}>
            {duration ? `Duration: ${Math.floor(duration / 1000)}s` : 'Loading...'}
          </Text>
          <Text style={styles.durationText}>
            {`Playing: ${Math.floor(currentTime / 1000)}s`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    backgroundColor: 'grey',
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
  textInput: {
    fontSize: 16,
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationContainer: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  durationText: {
    fontSize: 14,
    color: 'black',
  },
});
