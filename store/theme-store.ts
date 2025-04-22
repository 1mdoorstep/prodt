import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  error: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  info: string;
}

interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
}

interface ThemeState {
  theme: Theme;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  updateColors: (colors: Partial<ThemeColors>) => void;
  clearError: () => void;
}

const lightColors: ThemeColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  error: '#FF3B30',
  text: '#000000',
  textSecondary: '#8E8E93',
  border: '#C7C7CC',
  success: '#34C759',
  warning: '#FF9500',
  info: '#5AC8FA',
};

const darkColors: ThemeColors = {
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  background: '#000000',
  surface: '#1C1C1E',
  error: '#FF453A',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  success: '#32D74B',
  warning: '#FF9F0A',
  info: '#64D2FF',
};

const defaultTheme: Theme = {
  mode: 'system',
  colors: lightColors,
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: defaultTheme,
      isLoading: false,
      error: null,

      setThemeMode: (mode: ThemeMode) => {
        const colors = mode === 'dark' ? darkColors : lightColors;
        set({
          theme: {
            mode,
            colors,
          },
        });
      },

      updateColors: (colors: Partial<ThemeColors>) => {
        set((state) => ({
          theme: {
            ...state.theme,
            colors: {
              ...state.theme.colors,
              ...colors,
            },
          },
        }));
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'theme-storage',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
); 