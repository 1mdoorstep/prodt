import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    role?: 'worker' | 'employer';
    language?: string;
    profilePicture?: string;
    location?: string;
    skills?: string[];
  } | null;
  isLoading: boolean;
  error: string | null;
  hasCompletedOnboarding: boolean;
  hasSelectedRole: boolean;
  hasSelectedLanguage: boolean;
  hasSetupProfile: boolean;
}

interface AuthStore extends AuthState {
  login: (phone: string) => Promise<void>;
  signup: (name: string, phone: string, referralCode: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => void;
  setHasCompletedOnboarding: (value: boolean) => void;
  setHasSelectedRole: (value: boolean) => void;
  setHasSelectedLanguage: (value: boolean) => void;
  setHasSetupProfile: (value: boolean) => void;
  selectRole: (role: 'worker' | 'employer') => void;
  selectLanguage: (language: string) => void;
  updateProfile: (profile: Partial<AuthState['user']>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
      hasCompletedOnboarding: false,
      hasSelectedRole: false,
      hasSelectedLanguage: false,
      hasSetupProfile: false,

      login: async (phone: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would make an API call to send OTP
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // For demo, we'll just set a temporary user
          set({ 
            isLoading: false,
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Failed to login" 
          });
        }
      },

      signup: async (name: string, phone: string, referralCode: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would make an API call to register user
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // For demo, we'll just set a temporary user
          set({ 
            isLoading: false,
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Failed to sign up" 
          });
        }
      },

      verifyOtp: async (otp: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would verify the OTP with an API
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // For demo, we'll accept any OTP
          if (otp.length !== 4) {
            throw new Error('Please enter a valid 4-digit OTP');
          }
          
          // Set authenticated user
          set({ 
            isAuthenticated: true,
            user: {
              id: 'user-1',
              name: 'Demo User',
              phone: '9876543210',
            },
            isLoading: false,
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Failed to verify OTP" 
          });
          throw error;
        }
      },

      logout: () => {
        set({ 
          isAuthenticated: false,
          user: null,
          hasSelectedRole: false,
          hasSelectedLanguage: false,
          hasSetupProfile: false,
        });
      },

      setHasCompletedOnboarding: (value: boolean) => {
        set({ hasCompletedOnboarding: value });
        AsyncStorage.setItem('hasCompletedOnboarding', value ? 'true' : 'false');
      },

      setHasSelectedRole: (value: boolean) => {
        set({ hasSelectedRole: value });
      },

      setHasSelectedLanguage: (value: boolean) => {
        set({ hasSelectedLanguage: value });
      },

      setHasSetupProfile: (value: boolean) => {
        set({ hasSetupProfile: value });
      },

      selectRole: (role: 'worker' | 'employer') => {
        const { user } = get();
        set({ 
          hasSelectedRole: true,
          user: user ? { ...user, role } : null,
        });
      },

      selectLanguage: (language: string) => {
        const { user } = get();
        set({ 
          hasSelectedLanguage: true,
          user: user ? { ...user, language } : null,
        });
      },

      updateProfile: (profile: Partial<AuthState['user']>) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { ...user, ...profile },
            hasSetupProfile: true,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        hasSelectedRole: state.hasSelectedRole,
        hasSelectedLanguage: state.hasSelectedLanguage,
        hasSetupProfile: state.hasSetupProfile,
      }),
    }
  )
);