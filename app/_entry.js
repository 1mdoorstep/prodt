// Custom fixed entry point
import 'expo/build/Expo.fx';
import { AppRegistry } from 'react-native';
import { createRoot } from 'react-dom/client';
import { startRouter } from 'expo-router';

// Ensure compatibility with Expo Go 2.32.19 and SDK 52
const Router = startRouter();

// Register the app for both web and native
if (typeof document !== 'undefined') {
  // For web: Use createRoot for React 18+
  const root = createRoot(document.getElementById('root') ?? document.getElementById('main'));
  root.render(<Router />);
} else {
  // For native: Use AppRegistry
  AppRegistry.registerComponent('main', () => Router);
} 