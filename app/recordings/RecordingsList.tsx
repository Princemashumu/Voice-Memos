// RecordingsList.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RecordingItem } from '../../components/RecordingItem';
import { loadRecordings, deleteRecording } from '../../services/storageService';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

interface Recording {
  id: string;
  uri: string;
  duration: number;
  // Add other properties as needed
}

interface RecordingModalProps {
  visible: boolean;
  recording: Recording | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const RecordingModal: React.FC<RecordingModalProps> = ({
  visible,
  recording,
  onClose,
  onDelete,
}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const loadSound = async () => {
    if (recording?.uri) {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: recording.uri },
          { shouldPlay: false }, // Changed to false
          onPlaybackStatusUpdate
        );
        setSound(newSound);
      } catch (error) {
        console.error('Error loading sound:', error);
      }
    }
  };
  
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      const loadedStatus = status as AVPlaybackStatusSuccess;
      setPosition(loadedStatus.positionMillis / loadedStatus.durationMillis);
      if (loadedStatus.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else {
      await loadSound();
    }
  };

  const handleDelete = () => {
    if (recording) {
      onDelete(recording.id);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar,
                { width: `${position * 100}%` }
              ]} 
            />
          </View>
          
          <View style={styles.controlsContainer}>
            <TouchableOpacity onPress={handlePlayPause}>
              <Ionicons 
                name={isPlaying ? "pause-circle" : "play-circle"} 
                size={40} 
                color="#CCA65F"
              />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleDelete}>
              <Ionicons name="trash-outline" size={30} color="red" />
            </TouchableOpacity>
          </View>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={30} color="#666" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default function RecordingsList() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    navigation.setOptions({
      title: 'Voice Memos',
      headerLeft: route.params ? () => null : undefined,
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
          <TouchableOpacity onPress={() => setSelectedRecording(item)}>
            <RecordingItem 
              recording={item} 
              onDelete={handleDelete} 
              textStyle={styles.text} 
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />

      <RecordingModal
        visible={!!selectedRecording}
        recording={selectedRecording}
        onClose={() => setSelectedRecording(null)}
        onDelete={handleDelete}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    marginVertical: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#CCA65F',
    borderRadius: 2,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});