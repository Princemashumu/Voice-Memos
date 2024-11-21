import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system'; // Import Expo FileSystem
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import RecordingModal from './RecordingModal';

export default function RecordScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [recordTime, setRecordTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState();
  const [recordingObj, setRecordingObj] = useState(null); // Store the recording object
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal visibility
  const [currentRecordingToDelete, setCurrentRecordingToDelete] = useState(null); // Current recording to delete

  const modalAnimation = useRef(new Animated.Value(0)).current;
  const waveformAnimation = useRef(new Animated.Value(0)).current;

  // Fetch recordings from AsyncStorage on component mount
  useEffect(() => {
    const loadRecordings = async () => {
      try {
        const savedRecordings = await AsyncStorage.getItem('recordings');
        if (savedRecordings) {
          setRecordings(JSON.parse(savedRecordings));
        }
      } catch (error) {
        console.error('Failed to load recordings', error);
      }
    };

    loadRecordings();
  }, []);

  // Save recordings to AsyncStorage
  useEffect(() => {
    const saveRecordings = async () => {
      try {
        await AsyncStorage.setItem('recordings', JSON.stringify(recordings));
      } catch (error) {
        console.error('Failed to save recordings', error);
      }
    };

    saveRecordings();
  }, [recordings]);

  // Handle recording start
  const startRecording = async () => {
    if (recordingObj) {
      await stopRecording(); // Stop any existing recording before starting a new one
    }

    setIsRecording(true);
    startModalAnimation();
    startTimer();
    startWaveformAnimation();

    try {
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setRecordingObj(recording); // Save the recording object for later use
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  // Handle recording stop
  const stopRecording = async () => {
    if (!recordingObj) {
      console.log('No recording object found');
      return;
    }

    setIsRecording(false);
    stopModalAnimation();
    clearInterval(timerRef.current);
    waveformAnimation.stopAnimation();

    try {
      await recordingObj.stopAndUnloadAsync(); // Stop and unload the recording
      const uri = recordingObj.getURI(); // Get the URI of the saved recording

      // Only use FileSystem if on a mobile device (not the web)
      let fileUri = uri;
      if (Platform.OS !== 'web') {
        fileUri = FileSystem.documentDirectory + `recording_${Date.now()}.m4a`;
        await FileSystem.moveAsync({
          from: uri,
          to: fileUri,
        });
      }

      // Add the recording to the state
      const newRecording = {
        id: `${Date.now()}`,
        time: recordTime,
        name: `Recording ${recordings.length + 1}`,
        uri: fileUri, // Use the actual URI (FileSystem URI or original URI)
      };
      setRecordings((prev) => [newRecording, ...prev]);
      setRecordTime(0);
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  // Animation for modal
  const startModalAnimation = () => {
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const stopModalAnimation = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Timer for recording
  const timerRef = useRef(null);
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  // Animation for waveform
  const startWaveformAnimation = () => {
    Animated.loop(
      Animated.sequence([ 
        Animated.timing(waveformAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(waveformAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start()
    );
  };

  const handlePlay = async (uri) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      setSound(sound);
      setIsPlaying(true);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Failed to play audio', error);
    }
  };

  const handlePause = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const handleStop = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  // Handle delete action
  const handleDelete = async (id, uri) => {
    setShowDeleteModal(true); // Show confirmation modal
    setCurrentRecordingToDelete({ id, uri }); // Set the current recording to delete
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (currentRecordingToDelete) {
      const { id, uri } = currentRecordingToDelete;
      try {
        // Remove the recording from the state
        setRecordings((prev) => prev.filter((rec) => rec.id !== id));

        // Delete the recording file from the file system
        await FileSystem.deleteAsync(uri);

        setShowDeleteModal(false); // Close the modal after successful deletion
      } catch (error) {
        console.error('Failed to delete recording', error);
      }
    }
  };

  // Cancel delete action
  const cancelDelete = () => {
    setShowDeleteModal(false); // Close the modal without deleting
  };

  const renderRecordingItem = ({ item }) => (
    <View style={styles.recordingItem}>
      <MaterialIcons name="audiotrack" size={24} color="#ff6347" />
      <View style={styles.recordingDetails}>
        <Text style={styles.recordingName}>{item.name}</Text>
        <Text style={styles.recordingTime}>{`${item.time}s`}</Text>
      </View>
      <View style={styles.playbackControls}>
        <TouchableOpacity onPress={() => handlePlay(item.uri)}>
          <MaterialIcons name="play-arrow" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePause}>
          <MaterialIcons name="pause" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id, item.uri)}>
          <MaterialIcons name="delete" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Voice Memo</Text>
      <Text style={styles.subHeader}>All Your Recordings</Text>

      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        renderItem={renderRecordingItem}
        style={styles.recordingsList}
      />

      {!isRecording ? (
        <TouchableOpacity onPress={startRecording} style={styles.recordButton}>
          <MaterialIcons name="mic" size={50} color="white" />
        </TouchableOpacity>
      ) : null}

      <Modal visible={isRecording} transparent animationType="none">
        <RecordingModal
          modalAnimation={modalAnimation}
          waveformAnimation={waveformAnimation}
          recordTime={recordTime}
          isPlaying={isPlaying}
          onStop={stopRecording}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={showDeleteModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this recording?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={confirmDelete} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={cancelDelete} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  header: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subHeader: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
  recordButton: {
    marginTop: 20,
    backgroundColor: '#ff6347',
    borderRadius: 50,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingsList: {
    marginTop: 20,
    width: '100%',
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  recordingDetails: {
    flex: 1,
    marginLeft: 10,
  },
  recordingName: {
    color: 'white',
    fontWeight: 'bold',
  },
  recordingTime: {
    color: 'lightgray',
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
