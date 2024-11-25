import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadFromStorage = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load data', error);
    return [];
  }
};

export const saveToStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save data', error);
  }
};
