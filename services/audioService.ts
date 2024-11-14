// services/audioService.ts
import { Audio } from 'expo-av';

export async function playAudio(uri: string) {
  const { sound } = await Audio.Sound.createAsync({ uri });
  await sound.playAsync();
}
