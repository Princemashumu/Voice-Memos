import { Audio } from 'expo-av';

export const setupAudioMode = async () => {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });
};

export const createSound = async (uri) => {
  const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });
  return sound;
};
