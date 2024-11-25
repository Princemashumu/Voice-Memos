import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/RecordScreenStyles';

export const PermissionModal = ({ isVisible, onRetry, onCancel }) => (
  <Modal
    visible={isVisible}
    transparent
    animationType="slide"
    onRequestClose={onCancel}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <MaterialIcons name="mic-off" size={50} color="#ff6347" style={styles.modalIcon} />
        <Text style={styles.modalTitle}>Microphone Access Required</Text>
        <Text style={styles.modalText}>
          This app needs access to your microphone to record audio. Please enable microphone access in your device settings.
        </Text>
        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.modalButton} onPress={onRetry}>
            <Text style={styles.modalButtonText}>Check Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);
