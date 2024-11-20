import React, { useState, useEffect } from 'react';
import { View, Animated, StyleSheet, Platform } from 'react-native';
import { Audio } from 'expo-av';
import Header from './Header';
import RecordingsList from './RecordingsList.tsx';
import RecordingControls from './RecordingControls';
import RecordingModal from './RecordingModal';
import { saveRecording, loadRecordings } from '../../services/storageService';

export default function RecordMemos({ navigation }) {
  const [recordings, setRecordings] = useState([]);
  const [filteredRecordings, setFilteredRecordings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [modalAnimation] = useState(new Animated.Value(0));
  const [waveformAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchRecordings = async () => {
      const data = await loadRecordings();
      setRecordings(data || []);
      setFilteredRecordings(data || []);
    };
    fetchRecordings();
  }, []);

  useEffect(() => {
    if (isRecording) {
      Animated.timing(modalAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Microphone permission is required to record.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });

      setIsRecording(true);

      const recordingOptions = Platform.select({
        ios: Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
        android: Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
        default: Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
      });

      const recordingInstance = new Audio.Recording();
      await recordingInstance.prepareToRecordAsync(recordingOptions);
      await recordingInstance.startAsync();
      setRecording(recordingInstance);
      setRecordTime(0);
    } catch (error) {
      console.error('Failed to start recording', error);
      alert(`Recording failed: ${error.message}`);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      // Save the recording and immediately refresh the list
      const newRecording = await saveRecording({ uri, createdAt: new Date() });
      
      // Immediately fetch the latest recordings to ensure seamless update
      const updatedRecordings = await loadRecordings();
      setRecordings(updatedRecordings || []);
      setFilteredRecordings(updatedRecordings || []);
    } catch (error) {
      console.error('Failed to stop recording', error);
      alert(`Stopping recording failed: ${error.message}`);
    } finally {
      setRecording(null);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredRecordings(recordings);
    } else {
      const filtered = recordings.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRecordings(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <Header searchQuery={searchQuery} onSearch={handleSearch} />
      <RecordingsList
        recordings={filteredRecordings}
        onSelect={(item) =>
          navigation.navigate('RecordScreen', { recordingId: item.id })
        }
      />
      <RecordingControls
        isRecording={isRecording}
        onStart={startRecording}
        onStop={stopRecording}
      />
      {isRecording && (
        <RecordingModal
          modalAnimation={modalAnimation}
          waveformAnimation={waveformAnimation}
          recordTime={recordTime}
          onStop={stopRecording}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCA65F',
    color: 'black',
  },
});