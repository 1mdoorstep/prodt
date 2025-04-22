import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { OtpInput } from '@/components/OtpInput';
import { Button } from '@/components/Button';
import { colors, typography, spacing, layout } from '@/constants/theme';
import { useAuthStore } from '../../store';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function OtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { phone, name, isSignup } = params;
  
  const { verifyOtp, error, clearError, isLoading, updateProfile } = useAuthStore();
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isResending, setIsResending] = useState(false);

  // Countdown timer
  React.useEffect(() => {
    if (timeLeft === 0) return;
    
    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timerId);
  }, [timeLeft]);

  const handleVerify = useCallback(async () => {
    if (otp.length !== 4) return;
    
    try {
      await verifyOtp(otp, String(phone));
      
      // If this is a signup, update the user profile with the name
      if (isSignup === 'true' && name) {
        await updateProfile({ name: String(name) });
      }
      
      router.replace('/(tabs)');
    } catch (err) {
      console.error(err);
    }
  }, [otp, phone, isSignup, name, verifyOtp, updateProfile, router]);

  const handleResendOtp = useCallback(async () => {
    if (timeLeft > 0) return;
    
    setIsResending(true);
    
    try {
      const { login } = useAuthStore.getState();
      await login(String(phone));
      setTimeLeft(30);
      Alert.alert('OTP Sent', `A new OTP has been sent to ${phone}`);
    } catch (err) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  }, [timeLeft, phone]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  // Clear any store errors when component unmounts
  React.useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Show error alert if there's an error from the store
  React.useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error, clearError]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AnimatedView 
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={styles.header}
          >
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleGoBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          </AnimatedView>
          
          <AnimatedView 
            entering={SlideInRight.duration(400).delay(100)}
            exiting={SlideOutLeft.duration(300)}
            style={styles.content}
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
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
                variant="primary"
                size="lg"
                loading={isLoading}
                disabled={otp.length !== 4 || isLoading}
                icon={<ArrowRight size={20} color={colors.card} />}
                iconPosition="right"
                haptic
              />
            </View>
          </AnimatedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,
  keyboardAvoidingView: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
  } as ViewStyle,
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
  } as ViewStyle,
  content: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
  } as ViewStyle,
  titleContainer: {
    marginBottom: spacing.xl,
  } as ViewStyle,
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
    fontFamily: typography.families.sans,
  } as TextStyle,
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textLight,
    lineHeight: 24,
    fontFamily: typography.families.sans,
  } as TextStyle,
  otpContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  } as ViewStyle,
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  } as ViewStyle,
  resendText: {
    fontSize: typography.sizes.sm,
    color: colors.textLight,
    marginRight: spacing.xs,
    fontFamily: typography.families.sans,
  } as TextStyle,
  resendButton: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    fontFamily: typography.families.sans,
  } as TextStyle,
  resendButtonDisabled: {
    color: colors.textLight,
    opacity: 0.6,
  } as TextStyle,
  footer: {
    marginTop: 'auto',
    paddingTop: spacing.xl,
  } as ViewStyle,
});