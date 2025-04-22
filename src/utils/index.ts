import { formatDistanceToNow } from 'date-fns';
import { Platform } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import { ThemeColors, Theme } from '@/types/theme';

const THEME: Record<'light' | 'dark', { colors: ThemeColors }> = {
  light: {
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      background: '#FFFFFF',
      text: '#000000',
      error: '#FF3B30',
      success: '#34C759',
      warning: '#FF9500',
      border: '#C7C7CC',
      card: '#FFFFFF',
      notification: '#FF3B30'
    }
  },
  dark: {
    colors: {
      primary: '#0A84FF',
      secondary: '#5E5CE6',
      background: '#000000',
      text: '#FFFFFF',
      error: '#FF453A',
      success: '#32D74B',
      warning: '#FF9F0A',
      border: '#38383A',
      card: '#1C1C1E',
      notification: '#FF453A'
    }
  }
};

export const formatDate = (date: Date | string) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatCurrency = (amount: number, currency: string = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDistance = (distance: number) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const getPlatformSpecificStyles = (ios: any, android: any) => {
  return Platform.select({
    ios,
    android,
  });
};

export const getThemeColor = (theme: Theme, color: keyof ThemeColors): string => {
  return THEME[theme].colors[color];
};

export const validatePhoneNumber = (phone: string) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone);
};

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password: string) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return regex.test(password);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export const getRandomColor = () => {
  const colors = Object.values(THEME.light);
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getFileExtension = (filename: string) => {
  return filename.split('.').pop();
};

export const getFileSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
};

export const isImageFile = (filename: string) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const extension = getFileExtension(filename)?.toLowerCase();
  return extension ? imageExtensions.includes(extension) : false;
};

export const isVideoFile = (filename: string) => {
  const videoExtensions = ['mp4', 'webm', 'ogg'];
  const extension = getFileExtension(filename)?.toLowerCase();
  return extension ? videoExtensions.includes(extension) : false;
};

export const isDocumentFile = (filename: string) => {
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt'];
  const extension = getFileExtension(filename)?.toLowerCase();
  return extension ? documentExtensions.includes(extension) : false;
};

export const useThemeColors = () => {
  const theme = useThemeStore((state) => state.theme);
  return THEME[theme as 'light' | 'dark'].colors;
}; 