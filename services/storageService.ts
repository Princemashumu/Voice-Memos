import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

interface Recording {
  id?: string;
  uri: string;
  createdAt: Date;
  duration?: number;
  name?: string;
}

const RECORDINGS_KEY = 'voice_recordings';

export const saveRecording = async (recording: Recording): Promise<Recording> => {
  try {
    const recordings = await loadRecordings();
    const newRecording = {
      ...recording,
      id: uuidv4(),
      createdAt: new Date(),
      name: recording.name || `Recording ${(recordings?.length || 0) + 1}`
    };

    const updatedRecordings = recordings ? [...recordings, newRecording] : [newRecording];
    await AsyncStorage.setItem(RECORDINGS_KEY, JSON.stringify(updatedRecordings));
    return newRecording;
  } catch (error) {
    console.error('Error saving recording', error);
    throw error;
  }
};

export const loadRecordings = async (): Promise<Recording[] | null> => {
  try {
    const recordings = await AsyncStorage.getItem(RECORDINGS_KEY);
    return recordings ? JSON.parse(recordings) : null;
  } catch (error) {
    console.error('Error loading recordings', error);
    return null;
  }
};

export const deleteRecording = async (id: string): Promise<void> => {
  try {
    const recordings = await loadRecordings();
    if (recordings) {
      const updatedRecordings = recordings.filter(rec => rec.id !== id);
      await AsyncStorage.setItem(RECORDINGS_KEY, JSON.stringify(updatedRecordings));
    }
  } catch (error) {
    console.error('Error deleting recording', error);
    throw error;
  }
};

export const updateRecordingName = async (id: string, newName: string): Promise<void> => {
  try {
    const recordings = await loadRecordings();
    if (recordings) {
      const updatedRecordings = recordings.map(rec => 
        rec.id === id ? { ...rec, name: newName } : rec
      );
      await AsyncStorage.setItem(RECORDINGS_KEY, JSON.stringify(updatedRecordings));
    }
  } catch (error) {
    console.error('Error updating recording name', error);
    throw error;
  }
};