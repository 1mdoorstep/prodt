import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Platform, ActivityIndicator } from "react-native";
import { useRouter, Redirect, Stack } from "expo-router";
import Constants from 'expo-constants';

// Import the mobile bridge to ensure better connection in Expo Go
import mobileBridge from "./mobile-bridge";

// Check if running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

export default function Home() {
  // If using Expo Go on mobile, redirect to the compatibility screen
  if (Platform.OS !== 'web' && isExpoGo) {
    // This ensures better handling for Expo Go 2.32.19
    console.log('Redirecting to Expo Go compatibility screen');
    return <Redirect href="/expo-go-compat" />;
  }
  
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // For mobile, automatically redirect to welcome screen after a brief display
  useEffect(() => {
    if (Platform.OS !== 'web') {
      // Route to the welcome screen for mobile users
      const timer = setTimeout(() => {
        try {
          setIsLoading(false);
          router.replace("/welcome");
          console.log("Auto-navigated to welcome screen for mobile experience");
        } catch (e) {
          console.error("Navigation error:", e);
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      // For web, shorter loading time
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [router]);

  useEffect(() => {
    // Add any initialization logic here
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Fyke',
          headerLargeTitle: true,
        }}
      />
      <Text style={styles.title}>Welcome to Fyke</Text>
      <Text style={styles.subtitle}>Your Gig Economy Hub</Text>
      
      {/* Show loading indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4361EE" />
          <Text style={styles.loadingText}>
            {Platform.OS !== 'web' ? 'Optimizing for mobile...' : 'Loading...'}
          </Text>
        </View>
      )}
      
      {/* Show web navigation options */}
      {!isLoading && Platform.OS === 'web' && (
        <View style={styles.webNav}>
          <Text style={styles.navButton} onPress={() => router.push("/welcome")}>
            Get Started
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4361EE",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#4361EE",
  },
  webNav: {
    marginTop: 60,
    alignItems: "center",
  },
  navButton: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    backgroundColor: "#4361EE",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    overflow: "hidden",
  },
  versionText: {
    position: 'absolute',
    bottom: 20,
    fontSize: 12,
    color: '#999',
  },
});
