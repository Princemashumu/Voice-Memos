import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import styles from '../styles/RecordScreenStyles';

export const PermissionModal = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const requestMicrophonePermission = async () => {
    setLoading(true);
    try {
      if (Platform.OS === 'web') {
        if (navigator.mediaDevices) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log('Microphone access granted (web)');
            setIsVisible(false);
          } catch (error) {
            alert('Microphone access denied or not available.');
          }
        } else {
          alert('Your browser does not support microphone access.');
        }
      } else if (Platform.OS === 'android' || Platform.OS === 'ios') {
        const permission =
          Platform.OS === 'android'
            ? PERMISSIONS.ANDROID.RECORD_AUDIO
            : PERMISSIONS.IOS.MICROPHONE;

        const result = await check(permission);
        if (result === RESULTS.GRANTED) {
          console.log('Microphone access granted (mobile)');
          setIsVisible(false);
        } else if (result === RESULTS.DENIED || result === RESULTS.UNAVAILABLE) {
          const requestResult = await request(permission);
          if (requestResult === RESULTS.GRANTED) {
            console.log('Microphone access granted (mobile after request)');
            setIsVisible(false);
          } else {
            alert('Microphone access is denied. Please enable it in your device settings.');
          }
        } else {
          alert('Microphone access is blocked. Please enable it in your device settings.');
        }
      } else {
        console.log('Unsupported platform');
      }
    } catch (error) {
      console.error('Error requesting microphone access:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsVisible(false)}
      accessibilityViewIsModal={true}
      accessibilityLabel="Microphone Permission Modal"
      accessibilityHint="Modal requesting microphone access"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <MaterialIcons
            name="mic-off"
            size={50}
            color="#ff6347"
            style={styles.modalIcon}
            accessibilityLabel="Microphone Icon"
          />
          <Text style={styles.modalTitle} accessibilityLabel="Microphone Access Required">
            Microphone Access Required
          </Text>
          <Text style={styles.modalText} accessibilityLabel="This app needs access to your microphone">
            This app needs access to your microphone to record audio. Please allow microphone access.
          </Text>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.allowButton]}
              onPress={requestMicrophonePermission}
              disabled={loading}
              accessibilityLabel="Allow microphone access"
              accessibilityHint="Grants access to your microphone for recording."
            >
              <Text style={styles.modalButtonText}>
                {loading ? 'Processing...' : 'Allow Access'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsVisible(false)}
              disabled={loading}
              accessibilityLabel="Cancel microphone permission request"
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
