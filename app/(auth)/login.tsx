import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Animated, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';

export default function LoginScreen() {
  const router = useRouter();
  const { login, error, clearError, isLoading, isAuthenticated } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  
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
    if (!phone) {
      setPhoneError('Phone number is required');
      return false;
    } else if (!/^\d{10}$/.test(phone)) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return false;
    }
    
    setPhoneError('');
    return true;
  };

  const handleLogin = async () => {
    if (!validate() || !isNavigationReady) return;
    
    try {
      // For demo purposes, we'll skip the actual login API call
      // and go directly to OTP verification
      router.push({
        pathname: '/otp',
        params: { phone }
      });
    } catch (err) {
      // Error is handled in the store
      console.error(err);
    }
  };

  const handleSignup = () => {
    if (isNavigationReady) {
      router.push('/signup');
    }
  };

  const handleGoBack = () => {
    if (isNavigationReady) {
      router.back();
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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Log in with your phone number to continue
          </Text>
        </View>
        
        <View style={styles.form}>
          <Input
            label="Phone Number"
            placeholder="Enter your 10-digit phone number"
            value={phone}
            onChangeText={(text) => {
              // Only allow digits and limit to 10 characters
              const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
              setPhone(cleaned);
              if (phoneError) setPhoneError('');
            }}
            error={phoneError}
            keyboardType="phone-pad"
            leftIcon={<Phone size={20} color={colors.textLight} />}
          />
          
          <Button
            title="Continue"
            onPress={handleLogin}
            type="primary"
            size="large"
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
            icon={<ArrowRight size={20} color="#FFFFFF" />}
            iconPosition="right"
          />
          
          <Text style={styles.helpText}>
            You will receive a one-time password (OTP) on this number
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
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
    padding: 24,
  },
  titleContainer: {
    marginBottom: 40,
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
    marginBottom: 40,
  },
  button: {
    marginTop: 24,
    marginBottom: 16,
  },
  helpText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: 16,
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