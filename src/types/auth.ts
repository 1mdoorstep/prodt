export interface User {
  id: string;
  name?: string;
  email?: string;
  phone: string;
  profilePicture?: string;
  avatar?: string;
  location?: string;
  skills?: string[];
  bio?: string;
  role?: 'worker' | 'employer';
  language?: string;
  profileSetup?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignupData {
  name: string;
  phone: string;
  referralCode: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  hasCompletedOnboarding: boolean;
  hasSelectedRole: boolean;
  hasSelectedLanguage: boolean;
  hasSetupProfile: boolean;
  
  // Actions
  signup: (data: SignupData) => Promise<void>;
  login: (phone: string) => Promise<void>;
  register: (name: string, phone: string) => Promise<void>;
  verifyOtp: (otp: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  selectRole: (role: 'worker' | 'employer') => void;
  setHasSelectedRole: (selected: boolean) => void;
  selectLanguage: (language: string) => void;
  setHasSelectedLanguage: (selected: boolean) => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setHasSetupProfile: (setup: boolean) => void;
}