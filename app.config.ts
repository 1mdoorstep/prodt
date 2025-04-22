import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Project X",
  slug: "project-x",
  scheme: "fyke",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#4361EE"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.fyke.app",
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.fyke.app",
    permissions: [
      "ACCESS_COARSE_LOCATION",
      "ACCESS_FINE_LOCATION",
      "FOREGROUND_SERVICE",
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE"
    ],
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY
      }
    }
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/favicon.png"
  },
  plugins: [
    "expo-router",
    "expo-location",
    "expo-camera",
    "expo-notifications"
  ],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true
  },
  extra: {
    apiUrl: process.env.API_URL || "http://localhost:3000/api",
    socketUrl: process.env.SOCKET_URL || "http://localhost:3000",
    appEnv: process.env.APP_ENV || "development",
    eas: {
      projectId: "fyke-mobile-app"
    },
    expoGo: {
      minSdkVersion: "52.0.0",
      minClientVersion: "2.32.0"
    }
  },
  owner: "fyke",
  sdkVersion: "52.0.0",
  runtimeVersion: {
    policy: "sdkVersion"
  },
  updates: {
    url: "https://u.expo.dev/fyke-mobile-app",
    enabled: true,
    fallbackToCacheTimeout: 0
  }
}); 