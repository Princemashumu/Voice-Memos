import React, { useRef, useState, useEffect } from 'react'; 
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, Alert, Animated, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { loadFromStorage, saveToStorage } from '../../utils/storageHelpers';
import { setupAudioMode } from '../../utils/audioHelpers';
import { PermissionModal } from '../../components/PermissionModal';
import { RecordingItem } from '../../components/RecordingItem';
import styles from '../../styles/RecordScreenStyles';
import RecordingModal from '../../components/RecordingModal'; // Assuming you have this component

export default function RecordScreen() {
  const [recordings, setRecordings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecordings, setFilteredRecordings] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [recordTime, setRecordTime] = useState(0);
  const [showRecordingModal, setShowRecordingModal] = useState(false); // Show Recording Modal
  const [modalAnimation] = useState(new Animated.Value(0)); // Modal fade-in animation
  const [waveformAnimation] = useState(new Animated.Value(0)); // Waveform animation
  const [timerInterval, setTimerInterval] = useState(null); // Timer interval reference

  const debounceTimeoutRef = useRef(null);

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

  useEffect(() => {
    saveToStorage('recordings', recordings);
  }, [recordings]);

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
      setShowRecordingModal(true); // Show the modal when recording starts
      setRecordTime(0);

      // Start timer
      const interval = setInterval(() => {
        setRecordTime((prevTime) => prevTime + 1);
      }, 1000);
      setTimerInterval(interval);

      // Animate the modal
      Animated.timing(modalAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Animate the waveform
      Animated.loop(
        Animated.timing(waveformAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Animated.Easing.ease,
        })
      ).start();
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
      setShowRecordingModal(false); // Hide the modal when recording stops

      // Stop timer and animations
      clearInterval(timerInterval);
      setRecordTime(0);
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      console.error('Failed to stop recording:', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Icon and Voice Memo Title */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Voice Memo</Text>
        <View style={styles.profilePictureContainer}>
          <Image
            source={{ uri: 'https://example.com/your-image.jpg' }} // replace with your image URL or placeholder
            style={styles.profilePicture}
          />
        </View>
      </View>

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

      {/* Recording Modal */}
      {showRecordingModal && (
        <RecordingModal
          modalAnimation={modalAnimation}
          waveformAnimation={waveformAnimation}
          recordTime={recordTime}
          onStop={stopRecording}
        />
      )}

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
