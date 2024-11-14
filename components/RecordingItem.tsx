// components/RecordingItem.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { playAudio } from '../services/audioService';

export function RecordingItem({ recording, onDelete }: any) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
      <Text>{recording.name}</Text>
      <Button title="Play" onPress={() => playAudio(recording.uri)} />
      <Button title="Delete" onPress={() => onDelete(recording.id)} />
    </View>
  );
}
