// app/recordings/RecordingsList.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { RecordingItem } from '../../components/RecordingItem';
import { loadRecordings, deleteRecording } from '../../services/storageService';

export default function RecordingsList({ navigation }: any) {
  const [recordings, setRecordings] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      const loadedRecordings = await loadRecordings();
      setRecordings(loadedRecordings);
    };
    fetchRecordings();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteRecording(id);
    setRecordings((prev) => prev.filter((rec) => rec.id !== id));
  };

  return (
    <View>
      <Button title="Record New Note" onPress={() => navigation.navigate('RecordScreen')} />
      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecordingItem recording={item} onDelete={handleDelete} />
        )}
      />
    </View>
  );
}
