// RecordingsList.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RecordingItem } from '../../components/RecordingItem';
import { loadRecordings, deleteRecording } from '../../services/storageService';

export default function RecordingsList() {
  const [recordings, setRecordings] = useState<any[]>([]);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    navigation.setOptions({
      title: 'Voice Memos',
      headerLeft: route.params?.hideBackButton
        ? () => null
        : undefined,
    });

    const fetchRecordings = async () => {
      try {
        const loadedRecordings = await loadRecordings();
        setRecordings(loadedRecordings || []);
      } catch (error) {
        console.error('Failed to load recordings:', error);
      }
    };

    fetchRecordings();
  }, [route.params, navigation]);

  const handleDelete = async (id: string) => {
    try {
      await deleteRecording(id);
      setRecordings((prev) => prev.filter((rec) => rec.id !== id));
    } catch (error) {
      console.error('Failed to delete recording:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecordingItem recording={item} onDelete={handleDelete} textStyle={styles.text} />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCA65F',
  },
  listContainer: {
    paddingVertical: 10,
  },
  text: {
    color: 'white',
  },
});
