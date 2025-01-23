import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/RecordScreenStyles';

export const RecordingItem = ({ item, onPlay, onPause, onDelete, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(item.name);

  const handleSave = () => {
    onRename(item.id, newName);  // Call rename function
    setIsEditing(false);
  };

  return (
    <View style={styles.recordingItem}>
      <MaterialIcons name="audiotrack" size={24} color="#ff6347" />
      <View style={styles.recordingDetails}>
        {isEditing ? (
          <TextInput
            style={styles.recordingNameInput}
            value={newName}
            onChangeText={setNewName}
            autoFocus
            onSubmitEditing={handleSave}
          />
        ) : (
          <Text style={styles.recordingName}>{item.name}</Text>
        )}
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
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <MaterialIcons name="edit" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
