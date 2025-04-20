import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { SplashScreen } from 'expo-router';
import { View, Text, StyleSheet, Image, Animated, Dimensions, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/store/auth-store';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // We'll use a simpler approach without custom fonts for now
  const loaded = true;
  const error = null;

  const [appIsReady, setAppIsReady] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const logoAnim = React.useRef(new Animated.Value(0)).current;
  
  const { isAuthenticated, hasCompletedOnboarding, setHasCompletedOnboarding } = useAuthStore();

  // Prepare app resources and data
  useEffect(() => {
    async function prepare() {
      try {
        // Check if user has completed onboarding
        const hasCompletedOnboardingValue = await AsyncStorage.getItem('hasCompletedOnboarding');
        if (hasCompletedOnboardingValue === 'true') {
          setHasCompletedOnboarding(true);
        }
        
        // Animate logo while loading
        Animated.loop(
          Animated.sequence([
            Animated.timing(logoAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(logoAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: Platform.OS !== 'web',
            }),
          ])
        ).start();
        
        // Simulate data loading
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Animate splash screen fade out
  useEffect(() => {
    if (appIsReady) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start(async () => {
        await SplashScreen.hideAsync();
      });
    }
  }, [appIsReady, fadeAnim, scaleAnim]);

  const logoScale = logoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const logoOpacity = logoAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1, 0.8],
  });

  if (!loaded || !appIsReady) {
    return (
      <Animated.View 
        style={[
          styles.container, 
          Platform.OS !== 'web' ? {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          } : undefined
        ]}
      >
        <View style={[styles.gradient, { backgroundColor: colors.primary }]}>
          <View style={styles.logoContainer}>
            <Animated.Image
              source={require('../assets/images/splash-icon.png')}
              style={[
                styles.logo,
                {
                  transform: Platform.OS !== 'web' ? [{ scale: logoScale }] : undefined,
                  opacity: Platform.OS !== 'web' ? logoOpacity : 1
                }
              ]}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Fyke</Text>
            <Text style={styles.tagline}>Connect with skilled professionals instantly</Text>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="worker/[id]"
        options={{
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="chat/[id]"
        options={{
          headerTitle: 'Chat',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="job/[id]"
        options={{
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="post-job"
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          headerTitle: 'Notifications',
        }}
      />
      <Stack.Screen
        name="prototype"
        options={{
          headerTitle: 'App Prototype',
        }}
      />
    </Stack>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    maxWidth: width * 0.8,
  },
});