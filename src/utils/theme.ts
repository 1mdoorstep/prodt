import { useColorScheme } from 'react-native';
import { colors } from '@constants/colors';

export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    ...colors,
    background: isDark ? '#000000' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#000000',
    border: isDark ? '#38383A' : '#C7C7CC',
    card: isDark ? '#1C1C1E' : '#FFFFFF',
    notification: isDark ? '#FF453A' : '#FF3B30',
  };
}; 