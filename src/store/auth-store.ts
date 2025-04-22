import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState, SignupData } from '@/types/auth';
import { apiClient } from '@/utils/api';

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

const MOCK_OTP = '1234'; // For development testing

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      token: null,
      hasCompletedOnboarding: false,
      hasSelectedRole: false,
      hasSelectedLanguage: false,
      hasSetupProfile: false,

      signup: async (data: SignupData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post<AuthResponse>('/auth/signup', data);
          set({ 
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to sign up',
            isLoading: false 
          });
          throw error;
        }
      },

      login: async (phone: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post<{ success: boolean }>('/auth/login', { phone });
          if (!response.data.success) {
            throw new Error('Failed to send OTP');
          }
          set({ isLoading: false });
          
          if (__DEV__) {
            console.log('Development OTP:', MOCK_OTP);
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to send OTP',
            isLoading: false 
          });
        }
      },

      register: async (name: string, phone: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post<AuthResponse>('/auth/register', { name, phone });
          set({ 
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to register', isLoading: false });
          throw error;
        }
      },

      verifyOtp: async (otp: string, phone: string) => {
        set({ isLoading: true, error: null });
        try {
          if (__DEV__ && otp === MOCK_OTP) {
            // Development mode - mock successful auth
            set({
              isAuthenticated: true,
              user: {
                id: 'dev-user',
                name: 'Dev User',
                phone,
                role: undefined,
                language: undefined
              },
              token: 'dev-token',
              isLoading: false,
            });
            return;
          }

          const response = await apiClient.post<AuthResponse>('/auth/verify', { otp, phone });
          set({
            isAuthenticated: true,
            user: response.data.user,
            token: response.data.token,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to verify OTP',
            isLoading: false,
          });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await apiClient.post('/auth/logout', {});
          await AsyncStorage.removeItem('auth_token');
          
          set({
            user: null,
            isAuthenticated: false,
            token: null,
            isLoading: false,
            error: null,
            hasCompletedOnboarding: false,
            hasSelectedRole: false,
            hasSelectedLanguage: false,
            hasSetupProfile: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to logout',
            isLoading: false,
          });
        }
      },
      
      clearError: () => set({ error: null }),

      setHasCompletedOnboarding: (completed) => {
        set({ hasCompletedOnboarding: completed });
      },

      selectRole: (role) => {
        set((state) => ({
          user: state.user ? { ...state.user, role } : null,
          hasSelectedRole: true
        }));
      },

      setHasSelectedRole: (selected) => {
        set({ hasSelectedRole: selected });
      },

      selectLanguage: (language) => {
        set((state) => ({
          user: state.user ? { ...state.user, language } : null,
          hasSelectedLanguage: true
        }));
      },

      setHasSelectedLanguage: (selected) => {
        set({ hasSelectedLanguage: selected });
      },

      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.put<{ user: User }>('/auth/profile', data);
          const currentUser = get().user;
          const updatedUser = { ...currentUser, ...response.data.user } as User;
          
          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update profile',
            isLoading: false,
          });
        }
      },
      
      setHasSetupProfile: (setup) => {
        set({ hasSetupProfile: setup });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 