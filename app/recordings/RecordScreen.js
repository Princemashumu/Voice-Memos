import React, { useRef, useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { loadFromStorage, saveToStorage } from '../../utils/storageHelpers';
import { setupAudioMode } from '../../utils/audioHelpers';
import { PermissionModal } from '../../components/PermissionModal';
import { RecordingItem } from '../../components/RecordingItem';
import styles from '../../styles/RecordScreenStyles';

export default function RecordScreen() {
  const [recordings, setRecordings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecordings, setFilteredRecordings] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const debounceTimeoutRef = useRef(null);

  // Initialize audio mode and load saved recordings
  useEffect(() => {
    async function initialize() {
      const permissionGranted = await setupAudioMode();
      if (!permissionGranted) {
        setShowPermissionModal(true);
        return;
      }
      setHasPermission(permissionGranted);
      const savedRecordings = await loadFromStorage('recordings') || [];
      setRecordings(savedRecordings);
      setFilteredRecordings(savedRecordings);
    }
    initialize();
  }, []);

  // Save recordings to storage whenever they are updated
  useEffect(() => {
    saveToStorage('recordings', recordings);
  }, [recordings]);

  // Handle search with debouncing
  const handleSearch = (query) => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      const results = recordings.filter((rec) =>
        rec.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRecordings(results);
    }, 300);
  };

  // Start recording
  const startRecording = async () => {
    if (!hasPermission) {
      setShowPermissionModal(true);
      return;
    }
    try {
      console.log('Starting recording...');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    if (!recording) return;
    try {
      console.log('Stopping recording...');
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const newRecording = {
        id: Date.now().toString(),
        name: `Recording-${recordings.length + 1}`,
        uri,
      };
      setRecordings((prev) => [newRecording, ...prev]);
      setFilteredRecordings((prev) => [newRecording, ...prev]);
      setRecording(null);
      setIsRecording(false);
    } catch (err) {
      console.error('Failed to stop recording:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Voice Memo</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for audio..."
        value={searchQuery}
        onChangeText={(query) => {
          setSearchQuery(query);
          handleSearch(query);
        }}
      />
      <FlatList
        data={filteredRecordings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecordingItem
            item={item}
            onPlay={(uri) => console.log('Play', uri)}
            onPause={() => console.log('Pause')}
            onDelete={(id) => {
              const updatedRecordings = recordings.filter((rec) => rec.id !== id);
              setRecordings(updatedRecordings);
              setFilteredRecordings(updatedRecordings);
              Alert.alert('Deleted', `Recording ${id} deleted.`);
            }}
          />
        )}
      />
      <TouchableOpacity
        style={styles.recordButton}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <MaterialIcons name={isRecording ? 'stop' : 'mic'} size={50} color="white" />
      </TouchableOpacity>
      <PermissionModal
        isVisible={showPermissionModal}
        onRetry={async () => {
          const permissionGranted = await setupAudioMode();
          setHasPermission(permissionGranted);
          setShowPermissionModal(!permissionGranted);
        }}
        onCancel={() => setShowPermissionModal(false)}
      />
    </View>
  );
}
