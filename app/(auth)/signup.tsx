import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  Animated,
  Platform,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Phone, Gift, ArrowLeft, ArrowRight, Globe } from 'lucide-react-native';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';

export default function SignupScreen() {
  const router = useRouter();
  const { signup, verifyOtp, error, clearError, isLoading, isAuthenticated } = useAuthStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    referralCode: '',
  });
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Set navigation ready after first render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNavigationReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  // Start animations when component mounts
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, []);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated && isNavigationReady) {
      // Use a timeout to ensure navigation happens after render cycle
      const timer = setTimeout(() => {
        router.replace('/(tabs)');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isNavigationReady, router]);

  const validate = () => {
    const newErrors = {
      name: '',
      phone: '',
      referralCode: '',
    };
    let isValid = true;
    
    if (!name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!phone) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }
    
    if (!referralCode) {
      newErrors.referralCode = 'Referral code is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async () => {
    if (!validate() || !isNavigationReady) return;
    
    try {
      // For demo purposes, we'll simulate signup and go directly to OTP verification
      // In a real app, this would call an API to register the user
      
      // Navigate to OTP screen with phone number
      router.push({
        pathname: '/otp',
        params: { 
          phone,
          name,
          isSignup: 'true'
        }
      });
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to sign up. Please try again.');
    }
  };

  const handleLogin = () => {
    if (isNavigationReady) {
      router.push('/login');
    }
  };

  const handleGoBack = () => {
    if (isNavigationReady) {
      router.back();
    }
  };

  const handleLanguageSelect = () => {
    if (isNavigationReady) {
      router.push('/language-selection');
    }
  };

  // Clear any store errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Show error alert if there's an error from the store
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error, clearError]);

  if (isAuthenticated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Redirecting to home...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <Animated.View 
        style={[
          styles.content,
          { 
            opacity: fadeAnim,
            transform: Platform.OS !== 'web' ? [{ translateY: slideAnim }] : undefined
          }
        ]}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Sign up to find professionals or get hired for jobs
            </Text>
          </View>
          
          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              error={errors.name}
              autoCapitalize="words"
              leftIcon={<User size={20} color={colors.textLight} />}
            />
            
            <Input
              label="Phone Number"
              placeholder="Enter your 10-digit phone number"
              value={phone}
              onChangeText={(text) => {
                // Only allow digits and limit to 10 characters
                const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
                setPhone(cleaned);
              }}
              error={errors.phone}
              keyboardType="phone-pad"
              leftIcon={<Phone size={20} color={colors.textLight} />}
            />
            
            <Input
              label="Referral Code"
              placeholder="Enter referral code (any code works)"
              value={referralCode}
              onChangeText={setReferralCode}
              error={errors.referralCode}
              autoCapitalize="characters"
              leftIcon={<Gift size={20} color={colors.textLight} />}
            />
            
            <TouchableOpacity 
              style={styles.languageSelector}
              onPress={handleLanguageSelect}
            >
              <Globe size={18} color={colors.primary} />
              <Text style={styles.languageSelectorText}>
                Change Language
              </Text>
            </TouchableOpacity>
            
            <Button
              title="Sign Up"
              onPress={handleSignup}
              type="primary"
              size="large"
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
              icon={<ArrowRight size={20} color={colors.card} />}
              iconPosition="right"
            />
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.footerLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 24,
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    lineHeight: 24,
  },
  form: {
    marginBottom: 24,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: `${colors.primary}10`,
  },
  languageSelectorText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 6,
  },
  button: {
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 14,
    color: colors.textLight,
    marginRight: 4,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});