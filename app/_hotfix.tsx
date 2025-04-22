import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// This file exists solely to indicate the hotfix has been applied
// It's not referenced by the app, but shows up in the file system

export default function HotfixIndicator() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hotfix Applied Successfully</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 