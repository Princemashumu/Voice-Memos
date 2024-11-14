// services/storageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export async function saveRecording(uri: string | null) {
  if (!uri) return;
  const id = uuid.v4().toString();
  const recording = { id, uri, name: `Recording ${new Date().toLocaleString()}` };
  const recordings = await loadRecordings();
  recordings.push(recording);
  await AsyncStorage.setItem('recordings', JSON.stringify(recordings));
}

export async function loadRecordings() {
  const recordings = await AsyncStorage.getItem('recordings');
  return recordings ? JSON.parse(recordings) : [];
}

export async function deleteRecording(id: string) {
  const recordings = await loadRecordings();
  const updatedRecordings = recordings.filter((rec: any) => rec.id !== id);
  await AsyncStorage.setItem('recordings', JSON.stringify(updatedRecordings));
}
