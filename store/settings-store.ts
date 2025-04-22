import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/utils/api';

interface Settings {
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
  };
  location: {
    autoUpdate: boolean;
    updateInterval: number; // in minutes
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
  };
  privacy: {
    showProfile: boolean;
    showLocation: boolean;
    showContact: boolean;
  };
  language: string;
}

interface SettingsState {
  settings: Settings;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  clearError: () => void;
}

const defaultSettings: Settings = {
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
  },
  location: {
    autoUpdate: true,
    updateInterval: 15,
  },
  appearance: {
    theme: 'system',
    fontSize: 'medium',
  },
  privacy: {
    showProfile: true,
    showLocation: true,
    showContact: true,
  },
  language: 'en',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      isLoading: false,
      error: null,

      fetchSettings: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await apiClient.get<Settings>('/settings');
          set({
            settings: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to fetch settings',
            isLoading: false,
          });
        }
      },

      updateSettings: async (settings) => {
        try {
          set({ isLoading: true, error: null });
          const response = await apiClient.put<Settings>('/settings', settings);
          set({
            settings: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to update settings',
            isLoading: false,
          });
        }
      },

      resetSettings: async () => {
        try {
          set({ isLoading: true, error: null });
          await apiClient.delete('/settings');
          set({
            settings: defaultSettings,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to reset settings',
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'settings-storage',
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