import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Animated, 
  Platform,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { OtpInput } from '@/components/OtpInput';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';

export default function OtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { phone, name, isSignup } = params;
  
  const { verifyOtp, error, clearError, isLoading, isAuthenticated, updateProfile } = useAuthStore();
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isResending, setIsResending] = useState(false);
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

  // Countdown timer
  useEffect(() => {
    if (timeLeft === 0) return;
    
    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timerId);
  }, [timeLeft]);

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

  const handleVerify = async () => {
    if (otp.length !== 4 || !isNavigationReady) return;
    
    try {
      // For demo purposes, we'll accept any 4-digit OTP
      await verifyOtp(otp);
      
      // If this is a signup, update the user profile with the name
      if (isSignup === 'true' && name) {
        updateProfile({ name: String(name) });
      }
      
      // Navigation will happen in the useEffect above
    } catch (err) {
      // Error is handled in the store
      console.error(err);
    }
  };

  const handleResendOtp = () => {
    if (timeLeft > 0) return;
    
    setIsResending(true);
    
    // Simulate OTP resend
    setTimeout(() => {
      setTimeLeft(30);
      setIsResending(false);
      Alert.alert('OTP Sent', `A new OTP has been sent to ${phone}`);
    }, 1500);
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

  // Dismiss keyboard when OTP is complete
  useEffect(() => {
    if (otp.length === 4) {
      Keyboard.dismiss();
    }
  }, [otp]);

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
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            We've sent a verification code to {phone}
          </Text>
        </View>
        
        <View style={styles.otpContainer}>
          <OtpInput
            value={otp}
            onChange={setOtp}
            cellCount={4}
            autoFocus
          />
          
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              {timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : "Didn't receive the OTP?"}
            </Text>
            <TouchableOpacity 
              onPress={handleResendOtp}
              disabled={timeLeft > 0 || isResending}
            >
              <Text 
                style={[
                  styles.resendButton,
                  (timeLeft > 0 || isResending) && styles.resendButtonDisabled
                ]}
              >
                {isResending ? 'Sending...' : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Button
            title="Verify & Continue"
            onPress={handleVerify}
            type="primary"
            size="large"
            loading={isLoading}
            disabled={otp.length !== 4 || isLoading}
            icon={<ArrowRight size={20} color="#FFFFFF" />}
            iconPosition="right"
          />
          
          <Text style={styles.helpText}>
            For demo purposes, enter any 4-digit OTP (e.g., 1234)
          </Text>
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
  otpContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  resendText: {
    fontSize: 14,
    color: colors.textLight,
    marginRight: 4,
  },
  resendButton: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  resendButtonDisabled: {
    color: colors.textLight,
    opacity: 0.6,
  },
  footer: {
    marginTop: 'auto',
  },
  helpText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});