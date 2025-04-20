export interface User {
  id: string;
  name: string;
  phone: string;
  isDriver: boolean;
  referralCode: string;
  referredBy?: string;
  createdAt: string;
  profilePicture?: string;
  location?: string;
  primaryCategory?: string;
  skills?: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasCompletedOnboarding: boolean;
  hasSelectedRole: boolean;
  hasSelectedLanguage: boolean;
  hasSetupProfile: boolean;
  selectedLanguage: string;
}