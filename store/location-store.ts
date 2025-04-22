import { create } from 'zustand';
import * as Location from 'expo-location';
import { apiClient } from '@/utils/api';

interface LocationState {
  currentLocation: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
  
  // Actions
  requestLocationPermission: () => Promise<void>;
  getCurrentLocation: () => Promise<void>;
  updateLocation: (location: { latitude: number; longitude: number }) => Promise<void>;
  clearError: () => void;
}

export const useLocationStore = create<LocationState>()((set, get) => ({
  currentLocation: null,
  isLoading: false,
  error: null,
  hasPermission: false,

  requestLocationPermission: async () => {
    try {
      set({ isLoading: true, error: null });
      const { status } = await Location.requestForegroundPermissionsAsync();
      set({
        hasPermission: status === 'granted',
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to request location permission',
        isLoading: false,
      });
    }
  },

  getCurrentLocation: async () => {
    try {
      set({ isLoading: true, error: null });
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Get address from coordinates
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const address = addressResponse[0]?.formattedAddress || 'Unknown location';

      set({
        currentLocation: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to get current location',
        isLoading: false,
      });
    }
  },

  updateLocation: async (location) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get address from coordinates
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.latitude,
        longitude: location.longitude,
      });

      const address = addressResponse[0]?.formattedAddress || 'Unknown location';

      // Update location in backend
      await apiClient.post('/users/location', {
        latitude: location.latitude,
        longitude: location.longitude,
        address,
      });

      set({
        currentLocation: {
          ...location,
          address,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update location',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
})); 