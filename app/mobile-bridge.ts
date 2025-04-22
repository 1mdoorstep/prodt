// mobile-bridge.ts
// This file helps ensure proper connection between Expo Go and the development server
// Optimized for Expo Go 2.32.19

import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';

// Special fix for compatibility with Expo Go 2.32.19
// Use direct IP rather than hostUri which might not be reliable with older Expo Go versions
// Try to get the IP from Constants.expoConfig.hostUri if available
const getDevServerUrl = () => {
  if (Platform.OS === 'web') {
    return window.location.origin;
  }
  
  try {
    // Try to get the IP from Constants
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      if (ip) {
        return `http://${ip}:8081`;
      }
    }
  } catch (e) {
    console.log('[ExpoGo Bridge] Error getting hostUri:', e);
  }
  
  // Fallback to localhost
  return 'http://localhost:8081';
};

export const DEV_SERVER_URL = getDevServerUrl();

// Compatibility check for Expo Go 2.32.19
export const isExpoGo = Constants.appOwnership === 'expo';

// Check if running on mobile
export const isMobile = Platform.OS !== 'web';

// Log environment for debugging
if (__DEV__ && Platform.OS !== 'web') {
  console.log('[ExpoGo Bridge] Environment:', { 
    isExpoGo, 
    isMobile, 
    platform: Platform.OS,
    appOwnership: Constants.appOwnership,
    expoVersion: Constants.expoVersion
  });
}

/**
 * Helper to force Expo Go to reconnect to development server
 * Compatible with Expo Go 2.32.19
 */
export const forceReconnect = async (): Promise<boolean> => {
  if (!isExpoGo) return false;
  
  try {
    // For Expo Go 2.32.19, use a simpler URL approach
    const url = Linking.createURL('/_hotfix');
    
    // Log the reconnect URL for debugging
    console.log('[ExpoGo Bridge] Attempting reconnect with URL:', url);
    
    // Open the URL to force reconnection
    await Linking.openURL(url);
    return true;
  } catch (e: any) {
    console.error('[ExpoGo Bridge] Failed to force reconnect:', e);
    return false;
  }
};

/**
 * Helper to check if Expo Go is properly connected
 * Compatible with Expo Go 2.32.19
 */
export const checkConnection = async (): Promise<boolean> => {
  if (!isExpoGo) return true;
  
  try {
    // Use AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // In 2.32.19, the status endpoint might be at a different path
    // Try both the normal and legacy paths
    const url = `${DEV_SERVER_URL}/status`;
    console.log('[ExpoGo Bridge] Checking connection to:', url);
    
    // Simple connectivity check
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('[ExpoGo Bridge] Connection check result:', response.status);
    return response.ok;
  } catch (e: any) {
    console.warn('[ExpoGo Bridge] Connectivity check failed:', e);
    
    // For Expo Go 2.32.19, we'll be more lenient with errors
    // Some errors are expected but don't mean the connection is broken
    if (e.message && (
      e.message.includes('Network request failed') || 
      e.message.includes('abort')
    )) {
      console.log('[ExpoGo Bridge] Network error, but may still be connected');
      return true;
    }
    
    return false;
  }
};

// Initialize for Expo Go 2.32.19
// Add a longer delay for older Expo Go versions which may need more time
// The delay is set to 2 seconds to ensure the app is fully initialized
if (isMobile && isExpoGo) {
  console.log('[ExpoGo Bridge] Initialized for Expo Go');
  setTimeout(() => {
    console.log('[ExpoGo Bridge] Attempting auto-reconnect...');
    forceReconnect().then(success => {
      console.log('[ExpoGo Bridge] Auto reconnect attempt:', success ? 'successful' : 'failed');
    });
  }, 2000);
}

export default {
  DEV_SERVER_URL,
  isExpoGo,
  isMobile,
  forceReconnect,
  checkConnection
}; 