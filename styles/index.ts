// styles/index.ts
import { useColorScheme } from 'react-native';

export const colors = {
  light: {
    primary: '#4caf50',
    accent: '#f57c00',
    background: '#f0f0f0',
    text: '#333',
  },
  dark: {
    primary: '#388e3c',
    accent: '#ef6c00',
    background: '#121212',
    text: '#ffffff',
  },
};

export const fonts = {
  regular: 'Arial, sans-serif',
  bold: 'Arial-BoldMT, sans-serif',
};

export const useThemeColors = () => {
  const theme = useColorScheme();
  return theme === 'dark' ? colors.dark : colors.light;
};
