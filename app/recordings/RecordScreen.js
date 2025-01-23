
 // RecordScreen.js
 import React, { useRef, useState, useEffect } from 'react';
 import {
   View,
   Text,
   TouchableOpacity,
   StyleSheet,
   Animated,
   Modal,
   FlatList,
   TextInput,
   Alert,
 } from 'react-native';
 import { MaterialIcons } from '@expo/vector-icons';
 import { Audio } from 'expo-av';
 import * as FileSystem from 'expo-file-system';
 import { Platform } from 'react-native';
 import AsyncStorage from '@react-native-async-storage/async-storage';
 import { RecordingModal } from './RecordingModal';
 import Icon from 'react-native-vector-icons/Ionicons';
 import { useNavigation } from '@react-navigation/native';
import SettingsModal from '../../components/SettingsModal'; // Import the SettingsModal component


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
   const [filteredRecordings, setFilteredRecordings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debounceTimeoutRef = useRef(null);
  const [editingRecording, setEditingRecording] = useState(null);
  const [newName, setNewName] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  

   const modalAnimation = useRef(new Animated.Value(0)).current;
   const waveformAnimation = useRef(new Animated.Value(0)).current;
   const timerRef = useRef(null);
   const [settingsVisible, setSettingsVisible] = useState(false);


   //seacrh 
   useEffect(() => {
    loadRecordings();
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const openEditModal = (recording) => {
    setEditingRecording(recording);
    setNewName(recording.name); // Initialize with the current name
    setShowEditModal(true);
  };
  const saveEditedName = () => {
    setRecordings((prevRecordings) =>
      prevRecordings.map((rec) =>
        rec.id === editingRecording.id ? { ...rec, name: newName } : rec
      )
    );
    setFilteredRecordings((prevFiltered) =>
      prevFiltered.map((rec) =>
        rec.id === editingRecording.id ? { ...rec, name: newName } : rec
      )
    );
    setShowEditModal(false);
    setEditingRecording(null);
  };
    
  const cancelEditing = () => {
    setShowEditModal(false);
    setEditingRecording(null);
    setNewName('');
  };
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRecordings(recordings);
    } else {
      handleSearch(searchQuery);
    }
  }, [searchQuery, recordings]);

  const handleSearch = (query) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const lowercasedQuery = query.toLowerCase();
      const results = recordings.filter(
        (recording) =>
          recording.name.toLowerCase().includes(lowercasedQuery) ||
          new Date(recording.id).toLocaleDateString().includes(lowercasedQuery)
      );
      setFilteredRecordings(results);
    }, 300); // Debounce delay (300ms)
  };

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
        id: Date.now().toString(),
         time: recordTime,
         name: `Recording ${new Date().toLocaleString()}`,
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

   const handleRenameRecording = (id, newName) => {
    setRecordings((prevRecordings) =>
      prevRecordings.map((rec) =>
        rec.id === id ? { ...rec, name: newName } : rec
      )
    );
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
       } catch (error) {
         console.error('Failed to delete recording', error);
       }
     }
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
 
   const PermissionModal = () => (
     <Modal
       visible={showPermissionModal}
       transparent
       animationType="slide"
       onRequestClose={() => setShowPermissionModal(false)}
     >
       <View style={styles.modalContainer}>
         <View style={styles.modalContent}>
           <MaterialIcons name="mic-off" size={50} color="#ff6347" style={styles.modalIcon} />
           <Text style={styles.modalTitle}>Microphone Access Required</Text>
           <Text style={styles.modalText}>
             This app needs access to your microphone to record audio. Please enable microphone access in your device settings.
           </Text>
           <View style={styles.modalActions}>
             <TouchableOpacity
               style={styles.modalButton}
               onPress={async () => {
                 setShowPermissionModal(false);
                 await checkPermissions();
               }}
             >
               <Text style={styles.modalButtonText}>Check Again</Text>
             </TouchableOpacity>
             <TouchableOpacity
               style={[styles.modalButton, styles.cancelButton]}
               onPress={() => setShowPermissionModal(false)}
             >
               <Text style={styles.modalButtonText}>Cancel</Text>
             </TouchableOpacity>
           </View>
         </View>
       </View>
     </Modal>
   );
 
   return (
     <View style={styles.container}>
      {/* Settings Icon in the Top-Right Corner */}
      <TouchableOpacity
        style={styles.settingsIcon}
        onPress={() => setSettingsVisible(true)}
      >
        <MaterialIcons name="settings" size={24} color="black" />
      </TouchableOpacity>
       <Text style={styles.header}>Voice Memo</Text>
       {/* <Text style={styles.subHeader}>All Your Recordings</Text> */}
 {/* Search Bar */}
 <TextInput
        style={styles.searchBar}
        placeholder="Search for audio..."
        placeholderTextColor="#ccc"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredRecordings}
        keyExtractor={(item) => item.id}
        renderItem={renderRecordingItem}
        onPress={() => openEditModal(item)}
        style={styles.recordingsList}
      />
       {/* <FlatList
         data={recordings}
         keyExtractor={(item) => item.id}
         renderItem={renderRecordingItem}
         style={styles.recordingsList}
       /> */}
 
       {!isRecording && (
         <TouchableOpacity onPress={startRecording} style={styles.recordButton}>
           <MaterialIcons name="mic" size={50} color="white" />
         </TouchableOpacity>
       )}
 
       <Modal visible={isRecording} transparent animationType="none">
         <RecordingModal
           modalAnimation={modalAnimation}
           waveformAnimation={waveformAnimation}
           recordTime={recordTime}
           onStop={stopRecording}
         />
       </Modal>
 
       <Modal visible={showDeleteModal} transparent animationType="slide">
         <View style={styles.modalContainer}>
           <View style={styles.modalContent}>
             <Text style={styles.modalText}>Are you sure you want to delete this recording?</Text>
             <View style={styles.modalActions}>
               <TouchableOpacity onPress={confirmDelete} style={styles.modalButton}>
                 <Text style={styles.modalButtonText}>Yes</Text>
               </TouchableOpacity>
               <TouchableOpacity 
                 onPress={() => setShowDeleteModal(false)} 
                 style={[styles.modalButton, styles.cancelButton]}
               >
                 <Text style={styles.modalButtonText}>No</Text>
               </TouchableOpacity>
             </View>
           </View>
         </View>
       </Modal>
       <Modal visible={showEditModal} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Edit Recording Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new name"
        value={newName}
        onChangeText={setNewName}
      />
      <View style={styles.modalActions}>
        <TouchableOpacity onPress={saveEditedName} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={cancelEditing} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>


{/* Settings Modal */}
<SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
 
       <PermissionModal />
     </View>
   );
 }

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: 'white',
     alignItems: 'flex-start',
     justifyContent: 'flex-start',
     paddingTop: 60,
   },
   settingsIcon: {
    position: 'absolute',
    top: "8%",
    right: 25,
    zIndex: 10, // Ensures the icon is above the rest of the content
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
   header: {
     color: 'black',
     fontSize: 38,
     fontWeight: 'bold',
     marginLeft:20
   },
   subHeader: {
     color: 'white',
     fontSize: 18,
     marginTop: 10,
   },
   searchBar: {
    backgroundColor: '#333',
    color: 'white',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    width: '90%',
    marginLeft:20

  },
   recordButton: {
     marginTop: 20,
     backgroundColor: '#ff6347',
     borderRadius: 50,
     padding: 20,
     justifyContent: 'center',
     alignItems: 'center',
     bottom:20,
     left:'40%'
   },
   recordingsList: {
     marginTop: 20,
     width: '100%',
     paddingHorizontal: 20,
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
   playbackControls:
    {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 10,
   },
   modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#d9534f", // Red for delete action
  },
  cancelButton: {
    backgroundColor: "#6c757d", // Gray for cancel action
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginRight: 5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginLeft: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
 });
 