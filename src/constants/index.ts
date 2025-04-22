import { ThemeColors } from '@store/theme-store';

export const APP_NAME = 'Fyke';
export const APP_VERSION = '1.0.0';

export const API_URL = process.env.API_URL || 'http://localhost:3000/api';
export const SOCKET_URL = process.env.SOCKET_URL || 'http://localhost:3000';

export const AUTH_TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

export const FEATURE_FLAGS = {
  PUSH_NOTIFICATIONS: true,
  LOCATION_TRACKING: true,
  REAL_TIME_CHAT: true,
};

export const APP_CONFIG = {
  NAME: APP_NAME,
  VERSION: APP_VERSION,
  ENVIRONMENT: process.env.NODE_ENV || 'development',
};

export const THEME = {
  LIGHT: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    error: '#FF3B30',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C7C7CC',
    success: '#34C759',
    warning: '#FF9500',
    info: '#5AC8FA',
  } as ThemeColors,
  DARK: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#000000',
    surface: '#1C1C1E',
    error: '#FF453A',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    success: '#32D74B',
    warning: '#FF9F0A',
    info: '#64D2FF',
  } as ThemeColors,
};

export const LANGUAGES = {
  en: 'English',
  hi: 'हिंदी',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
};

export const SKILL_CATEGORIES = {
  driver: 'Driver',
  cook: 'Cook',
  electrician: 'Electrician',
  plumber: 'Plumber',
  maid: 'Maid',
  delivery: 'Delivery',
  other: 'Other',
};

export const VEHICLE_TYPES = {
  bike: 'Bike',
  car: 'Car',
  van: 'Van',
  truck: 'Truck',
};

export const NOTIFICATION_TYPES = {
  JOB_APPLICATION: 'job_application',
  JOB_OFFER: 'job_offer',
  MESSAGE: 'message',
  SYSTEM: 'system',
};

export const SEARCH_FILTERS = {
  SORT_BY: {
    DISTANCE: 'distance',
    SALARY: 'salary',
    DATE: 'date',
  },
  SORT_ORDER: {
    ASC: 'asc',
    DESC: 'desc',
  },
};

export const SETTINGS = {
  NOTIFICATIONS: {
    ENABLED: true,
    SOUND: true,
    VIBRATION: true,
  },
  LOCATION: {
    AUTO_UPDATE: true,
    UPDATE_INTERVAL: 15, // minutes
  },
  APPEARANCE: {
    THEME: 'system',
    FONT_SIZE: 'medium',
  },
  PRIVACY: {
    SHOW_PROFILE: true,
    SHOW_LOCATION: true,
    SHOW_CONTACT: true,
  },
  LANGUAGE: 'en',
}; 