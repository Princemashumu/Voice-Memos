import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { updateRecordingName } from '../services/storageService';

interface Recording {
  id: string;
  name: string;
  uri: string;
  duration?: number; // Optional duration field
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
  const [duration, setDuration] = useState<number | null>(recording.duration ?? null);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    const setupAudioMode = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error('Error setting audio mode:', error);
        Alert.alert('Audio Error', 'Could not configure audio settings');
      }
    };

    const loadSound = async () => {
      try {
        // Check permissions
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
          Alert.alert('Permission Denied', 'Audio playback permission is required.');
          return;
        }

        // Check if file exists
        const fileInfo = await FileSystem.getInfoAsync(recording.uri);
        if (!fileInfo.exists) {
          throw new Error('Audio file does not exist');
        }

        // Load sound
        const { sound, status } = await Audio.Sound.createAsync(
          { uri: recording.uri },
          { shouldPlay: true }
        );

        if (isMounted) {
          setSound(sound);
          if (status.isLoaded) {
            const loadedDuration = status.durationMillis ?? null;
            setDuration(loadedDuration);
          }
        }
      } catch (error) {
        console.error('Error loading sound:', error);
        Alert.alert('Playback Error', 'Could not load audio file');
      }
    };

    setupAudioMode();
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
      if (status.isLoaded) {
        const playbackStatus = status as AVPlaybackStatusSuccess;
        setCurrentTime(playbackStatus.positionMillis);

        if (playbackStatus.didJustFinish) {
          setIsPlaying(false);
          setCurrentTime(0);
        }
      }
    };

    sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

    return () => {
      sound.setOnPlaybackStatusUpdate(null);
    };
  }, [sound]);

  const handlePlayPause = async () => {
    if (!sound) {
      console.error('Sound not loaded');
      return;
    }

    try {
      const status = await sound.getStatusAsync();
      console.log('Playback Status Before Play/Pause:', status);

      if (status.isLoaded) {
        const playbackStatus = status as AVPlaybackStatusSuccess;

        if (isPlaying) {
          await sound.pauseAsync();
          console.log('Paused');
        } else {
          if (playbackStatus.positionMillis === playbackStatus.durationMillis) {
            await sound.replayAsync();
            console.log('Replayed');
          } else {
            await sound.playAsync();
            console.log('Playing');
          }
        }
        setIsPlaying(!isPlaying);
      } else {
        console.error('Sound not loaded correctly');
      }
    } catch (error) {
      console.error('Error playing/pausing sound:', error);
      Alert.alert('Playback Error', 'Could not play audio');
    }
  };

  const handleNameChange = async () => {
    if (newName.trim() === '') return;

    try {
      await updateRecordingName(recording.id, newName);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating recording name:', error);
      Alert.alert('Update Error', 'Could not update recording name');
      setNewName(recording.name);
    }
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
        {duration !== null && (
          <Text style={styles.durationActionText}>
            {formatTime(duration)}
          </Text>
        )}
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
  durationActionText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
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
  },
});
