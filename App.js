import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  FlatList,
  Alert,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RecordingModal } from './RecordingModal';

export default function RecordScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [recordTime, setRecordTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState();
  const [recordingObj, setRecordingObj] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRecordingToDelete, setCurrentRecordingToDelete] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const modalAnimation = useRef(new Animated.Value(0)).current;
  const waveformAnimation = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    checkPermissions();
    loadRecordings();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    saveRecordings();
  }, [recordings]);

  const checkPermissions = async () => {
    try {
      // First, check if permissions are already granted
      const { status: existingStatus } = await Audio.getPermissionsAsync();
      let finalStatus = existingStatus;

      // If not granted, request permissions
      if (existingStatus !== 'granted') {
        const { status } = await Audio.requestPermissionsAsync();
        finalStatus = status;
      }

      setHasPermission(finalStatus === 'granted');

      if (finalStatus !== 'granted') {
        setShowPermissionModal(true);
        return false;
      }

      // Set up audio mode after permissions are granted
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

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

  const saveRecordings = async () => {
    try {
      await AsyncStorage.setItem('recordings', JSON.stringify(recordings));
    } catch (error) {
      console.error('Failed to save recordings', error);
    }
  };

  const startRecording = async () => {
    if (!hasPermission) {
      setShowPermissionModal(true);
      return;
    }

    if (recordingObj) {
      await stopRecording();
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setRecordingObj(recording);
      setIsRecording(true);
      startModalAnimation();
      startTimer();
      startWaveformAnimation();
    } catch (error) {
      console.error('Failed to start recording', error);
      Alert.alert('Error', 'Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = async () => {
    if (!recordingObj) return;

    setIsRecording(false);
    stopModalAnimation();
    clearInterval(timerRef.current);
    waveformAnimation.stopAnimation();

    try {
      await recordingObj.stopAndUnloadAsync();
      const uri = recordingObj.getURI();

      let fileUri = uri;
      if (Platform.OS !== 'web') {
        fileUri = FileSystem.documentDirectory + `recording_${Date.now()}.m4a`;
        await FileSystem.moveAsync({
          from: uri,
          to: fileUri,
        });
      }

      const newRecording = {
        id: `${Date.now()}`,
        time: recordTime,
        name: `Recording ${recordings.length + 1}`,
        uri: fileUri,
      };
      setRecordings((prev) => [newRecording, ...prev]);
      setRecordTime(0);
      setRecordingObj(null);
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const startModalAnimation = () => {
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const stopModalAnimation = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordTime((prevTime) => prevTime + 1);
    }, 1000);
  };

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
      ])
    ).start();
  };

  const handlePlay = async (uri) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
      newSound.setOnPlaybackStatusUpdate((status) => {
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

  const handleDelete = async (id, uri) => {
    setShowDeleteModal(true);
    setCurrentRecordingToDelete({ id, uri });
  };

  const confirmDelete = async () => {
    if (currentRecordingToDelete) {
      const { id, uri } = currentRecordingToDelete;
      try {
        setRecordings((prev) => prev.filter((rec) => rec.id !== id));
        if (Platform.OS !== 'web') {
          await FileSystem.deleteAsync(uri);
        }
        setShowDeleteModal(false);
        setCurrentRecordingToDelete(null);
      } catch (error) {
        console.error('Failed to delete recording', error);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCurrentRecordingToDelete(null);
  };

  const renderItem = ({ item }) => (
    <View style={styles.recordingItem}>
      <Text style={styles.recordingName}>{item.name}</Text>
      <Text style={styles.recordingDuration}>{item.time}s</Text>
      <View style={styles.recordingActions}>
        <TouchableOpacity onPress={() => handlePlay(item.uri)}>
          <MaterialIcons name="play-arrow" size={30} color="#ff6347" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id, item.uri)}>
          <MaterialIcons name="delete" size={30} color="#ff6347" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {showPermissionModal && (
        <Modal
          visible={showPermissionModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPermissionModal(false)}
        >
          <View style={styles.permissionModal}>
            <Text style={styles.permissionText}>
              Microphone permission is required to record audio.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPermissionModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      <RecordingModal
        modalAnimation={modalAnimation}
        isRecording={isRecording}
        recordTime={recordTime}
      />

      <TouchableOpacity
        style={styles.recordButton}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <MaterialIcons
          name={isRecording ? 'stop' : 'mic'}
          size={60}
          color={isRecording ? '#ff6347' : '#000'}
        />
      </TouchableOpacity>

      <FlatList
        data={recordings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <Modal
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={cancelDelete}
      >
        <View style={styles.deleteModal}>
          <Text style={styles.deleteText}>Are you sure you want to delete this recording?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={cancelDelete}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmDelete}>
              <Text style={styles.confirmButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  permissionText: {
    color: 'white',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
  recordButton: {
    marginBottom: 30,
    padding: 10,
  },
  recordingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recordingName: {
    fontSize: 18,
  },
  recordingDuration: {
    fontSize: 16,
    color: '#777',
  },
  recordingActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  deleteText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
  },
  cancelButton: {
    fontSize: 18,
    color: '#ff6347',
    marginRight: 20,
  },
  confirmButton: {
    fontSize: 18,
    color: '#ff6347',
  },
});
