// app/recordings/RecordingsList.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { RecordingItem } from '../../components/RecordingItem';
import { loadRecordings, deleteRecording } from '../../services/storageService';

export default function RecordingsList({ navigation, route }: any) {
  const [recordings, setRecordings] = useState<any[]>([]);

  useEffect(() => {
    // Configure header with custom title, left, and right icons
    navigation.setOptions({
      title: 'Voice Memos',
      headerLeft: route.params?.hideBackButton ? () => null : undefined,
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('RecordScreen')}>
          <MaterialIcons name="arrow-forward" size={24} color="black" />
        </TouchableOpacity>
      ),
    });

    const fetchRecordings = async () => {
      const loadedRecordings = await loadRecordings();
      setRecordings(loadedRecordings);
    };
    fetchRecordings();
  }, [route.params]);

  const handleDelete = async (id: string) => {
    await deleteRecording(id);
    setRecordings((prev) => prev.filter((rec) => rec.id !== id));
  };

  return (
    <View>
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
