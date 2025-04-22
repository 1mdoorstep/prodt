import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '@/types';

interface LanguageState {
  currentLanguage: Language;
  translations: Record<string, Record<Language, string>>;
  setLanguage: (language: Language) => void;
  getTranslation: (key: string) => string;
}

const defaultTranslations = {
  'findJobs': {
    en: 'Find Jobs',
    hi: 'नौकरी ढूंढें',
    ta: 'வேலை தேடு',
    te: 'ఉద్యోగాలు కనుగొనండి',
    kn: 'ಉದ್ಯೋಗಗಳನ್ನು ಹುಡುಕಿ',
    ml: 'ജോലി കണ്ടെത്തുക',
  },
  'findProfessionals': {
    en: 'Find Professionals',
    hi: 'पेशेवरों को ढूंढें',
    ta: 'தொழிலாளரை தேடு',
    te: 'వృత్తిపరులను కనుగొనండి',
    kn: 'ವೃತ್ತಿಪರರನ್ನು ಹುಡುಕಿ',
    ml: 'പ്രൊഫഷണലുകളെ കണ്ടെത്തുക',
  },
  'enterOtp': {
    en: 'Enter OTP sent to your number',
    hi: 'अपने नंबर पर भेजे गए OTP को दर्ज करें',
    ta: 'உங்கள் எண்ணுக்கு அனுப்பப்பட்ட OTP ஐ உள்ளிடவும்',
    te: 'మీ నంబర్‌కు పంపిన OTP ని నమోదు చేయండి',
    kn: 'ನಿಮ್ಮ ಸಂಖ್ಯೆಗೆ ಕಳುಹಿಸಲಾದ OTP ಅನ್ನು ನಮೂದಿಸಿ',
    ml: 'നിങ്ങളുടെ നമ്പറിലേക്ക് അയച്ച OTP നൽകുക',
  },
  'selectLanguage': {
    en: 'Select your preferred language',
    hi: 'अपनी पसंदीदा भाषा चुनें',
    ta: 'உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்',
    te: 'మీరు ఇష్టపడే భాషను ఎంచుకోండి',
    kn: 'ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    ml: 'നിങ്ങൾക്ക് ഇഷ്ടമുള്ള ഭാഷ തിരഞ്ഞെടുക്കുക',
  },
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: 'en',
      translations: defaultTranslations,

      setLanguage: (language: Language) => {
        set({ currentLanguage: language });
      },

      getTranslation: (key: string) => {
        const { currentLanguage, translations } = get();
        return translations[key]?.[currentLanguage] || key;
      },
    }),
    {
      name: 'language-storage',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
); 