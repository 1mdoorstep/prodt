import Constants from 'expo-constants';

type Environment = 'dev' | 'prod';

interface EnvConfig {
  API_URL: string;
  SOCKET_URL: string;
}

const ENV: Record<Environment, EnvConfig> = {
  dev: {
    API_URL: "http://localhost:3000/api",
    SOCKET_URL: "http://localhost:3000"
  },
  prod: {
    API_URL: "https://api.fyke.app/api",
    SOCKET_URL: "https://api.fyke.app"
  }
};

const getEnvVars = () => {
  const env = (Constants.expoConfig?.extra?.env || 'dev') as Environment;
  return ENV[env];
};

export default getEnvVars(); 