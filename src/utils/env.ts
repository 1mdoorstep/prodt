import Constants from 'expo-constants';

interface Environment {
  apiUrl: string;
  socketUrl: string;
  appEnv: string;
  enablePushNotifications: boolean;
  enableLocationTracking: boolean;
  enableOfflineMode: boolean;
}

const env: Environment = {
  apiUrl: Constants.expoConfig?.extra?.apiUrl ?? 'http://localhost:3000/api',
  socketUrl: Constants.expoConfig?.extra?.socketUrl ?? 'http://localhost:3000',
  appEnv: Constants.expoConfig?.extra?.appEnv ?? 'development',
  enablePushNotifications: Constants.expoConfig?.extra?.enablePushNotifications ?? false,
  enableLocationTracking: Constants.expoConfig?.extra?.enableLocationTracking ?? false,
  enableOfflineMode: Constants.expoConfig?.extra?.enableOfflineMode ?? false,
};

export const getEnvVar = <K extends keyof Environment>(key: K): Environment[K] => {
  return env[key];
};

export const isProduction = (): boolean => env.appEnv === 'production';
export const isDevelopment = (): boolean => env.appEnv === 'development';
export const isStaging = (): boolean => env.appEnv === 'staging';

export default env; 