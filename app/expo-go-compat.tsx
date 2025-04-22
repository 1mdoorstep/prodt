// Special compatibility file for Expo Go 2.32.19
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import mobileBridge from './mobile-bridge';

/**
 * This component serves as an intermediary between Expo Go 2.32.19 and the main app
 * It ensures proper connectivity and loading before showing the app content
 */
export default function ExpoGoCompatScreen() {
  const router = useRouter();
  const [connectionChecked, setConnectionChecked] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [retryCount, setRetryCount] = useState(0);
  
  // Check connection and handle reconnection
  useEffect(() => {
    async function checkConnectionAndProceed() {
      try {
        // If we're not in Expo Go, immediately navigate to the tabs
        if (!mobileBridge.isExpoGo) {
          router.replace('/(tabs)');
          return;
        }
        
        // Signal that we're checking connection
        setConnectionStatus('checking');
        
        // First try to reconnect to ensure we have a fresh connection
        await mobileBridge.forceReconnect();
        
        // Then check if connection is successful
        const isConnected = await mobileBridge.checkConnection();
        
        if (isConnected) {
          // Successfully connected
          setConnectionStatus('connected');
          setConnectionChecked(true);
          
          // Wait a moment before redirecting to ensure the connection is stable
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 1500);
        } else {
          // Failed to connect
          setConnectionStatus('failed');
          
          // Retry up to 3 times
          if (retryCount < 3) {
            setTimeout(() => {
              setRetryCount(prevCount => prevCount + 1);
            }, 2000);
          }
        }
      } catch (e) {
        console.error('Error in connection check:', e);
        setConnectionStatus('error');
      }
    }
    
    checkConnectionAndProceed();
  }, [router, retryCount]);
  
  // Render loading screen
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fyke</Text>
      <Text style={styles.subtitle}>Optimizing for Expo Go 2.32.19</Text>
      
      <View style={styles.statusContainer}>
        <ActivityIndicator size="large" color="#4361EE" style={styles.spinner} />
        
        <Text style={styles.statusText}>
          {connectionStatus === 'checking' && 'Establishing connection...'}
          {connectionStatus === 'connected' && 'Connection established! Loading app...'}
          {connectionStatus === 'failed' && `Connection failed. Retrying (${retryCount}/3)...`}
          {connectionStatus === 'error' && 'An error occurred. Please restart the app.'}
        </Text>
        
        {connectionStatus === 'failed' && retryCount >= 3 && (
          <Text style={styles.helpText}>
            Please make sure your device is on the same network as your computer.
            Try closing and reopening Expo Go app.
          </Text>
        )}
      </View>
      
      <Text style={styles.versionText}>
        App Mode: {Platform.OS.toUpperCase()} {mobileBridge.isExpoGo ? '(Expo Go)' : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 48, 
    fontWeight: 'bold',
    color: '#4361EE',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#38434D',
    marginBottom: 50,
    textAlign: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  spinner: {
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  helpText: {
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 20,
    maxWidth: 300,
  },
  versionText: {
    position: 'absolute',
    bottom: 20,
    fontSize: 12,
    color: '#999',
  },
}); 