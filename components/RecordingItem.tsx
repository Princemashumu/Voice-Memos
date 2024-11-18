import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio, AVPlaybackStatus } from 'expo-av';  // Added AVPlaybackStatus import
import { updateRecordingName } from '../services/storageService';

interface Recording {
  id: string;
  name: string;
  uri: string;
}

interface RecordingItemProps {
  recording: Recording;
  onDelete: (id: string) => void;
  textStyle?: object;
}

export function RecordingItem({ recording, onDelete, textStyle }: RecordingItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(recording.name);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

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
        
        if (isMounted) {
          setSound(sound);
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {  // Type guard
            setDuration(status.durationMillis ?? null);
          }
        }
      } catch (error) {
        console.error('Error loading sound:', error);
      }
    };

    loadSound();

    return () => {
      isMounted = false;
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [recording.uri]);

  useEffect(() => {
    if (!sound) return;

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
      if (status.isLoaded) {  // Type guard
        if (status.isPlaying) {
          setCurrentTime(status.positionMillis);
        }
        
        if (status.didJustFinish) {
          setIsPlaying(false);
          setCurrentTime(0);
          sound.setPositionAsync(0);
        }
      }
    };

    sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

    return () => {
      sound.setOnPlaybackStatusUpdate(null);
    };
  }, [sound]);

  const handlePlayPause = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error playing/pausing sound:', error);
    }
  };

  const handleNameChange = async () => {
    if (newName.trim() === '') return;
    
    try {
      await updateRecordingName(recording.id, newName);
    } catch (error) {
      console.error('Error updating recording name:', error);
      setNewName(recording.name);
    }
    setIsEditing(false);
  };

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.item}>
      <View style={styles.contentContainer}>
        {isEditing ? (
          <TextInput
            style={styles.textInput}
            value={newName}
            onChangeText={setNewName}
            onBlur={handleNameChange}
            onSubmitEditing={handleNameChange}
            autoFocus
          />
        ) : (
          <Text style={[styles.text, textStyle]} numberOfLines={1}>
            {recording.name}
          </Text>
        )}

        <View style={styles.timeInfo}>
          {duration !== null && (
            <Text style={styles.durationText}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.actionButton}>
          <MaterialIcons name="edit" size={24} color="#333" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handlePlayPause} style={styles.actionButton}>
          <MaterialIcons
            name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
            size={24}
            color="#333"
          />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => onDelete(recording.id)} 
          style={styles.actionButton}
        >
          <MaterialIcons name="delete" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 12,
    backgroundColor: 'grey',
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  textInput: {
    fontSize: 16,
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  timeInfo: {
    marginTop: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#666',
  }
});