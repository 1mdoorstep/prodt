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
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, ArrowLeft, ArrowRight } from 'lucide-react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors, typography, spacing, layout } from '@/constants/theme';
import { useAuthStore } from '../../store';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function LoginScreen() {
  const router = useRouter();
  const { login, error, clearError, isLoading } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validate = useCallback(() => {
    if (!phone) {
      setPhoneError('Phone number is required');
      return false;
    }
    
    // Remove all non-numeric characters for validation
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return false;
    }
    
    setPhoneError('');
    return true;
  }, [phone]);

  const handleLogin = useCallback(async () => {
    if (!validate()) return;
    
    try {
      await login('+1' + phone.replace(/\D/g, ''));
      router.push({
        pathname: '/otp',
        params: { phone: '+1' + phone.replace(/\D/g, '') }
      });
    } catch (err) {
      console.error(err);
    }
  }, [phone, login, router, validate]);

  const handleSignup = useCallback(() => {
    router.push('/signup');
  }, [router]);

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
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Log in with your phone number to continue
              </Text>
            </View>
            
            <View style={styles.form}>
              <Input
                label="Phone Number"
                placeholder="(555) 123-4567"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (phoneError) setPhoneError('');
                }}
                error={phoneError}
                keyboardType="phone-pad"
                leftIcon={<Phone size={20} color={colors.textLight} />}
                formatPhoneNumber
                autoFocus
              />
              
              <Button
                title="Continue"
                onPress={handleLogin}
                variant="primary"
                size="lg"
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
                icon={<ArrowRight size={20} color={colors.card} />}
                iconPosition="right"
                haptic
              />
              
              <Text style={styles.helpText}>
                You will receive a one-time password (OTP) on this number
              </Text>
            </View>
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity 
                onPress={handleSignup}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
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
  form: {
    marginBottom: spacing.xl,
  } as ViewStyle,
  button: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  } as ViewStyle,
  helpText: {
    fontSize: typography.sizes.sm,
    color: colors.textLight,
    textAlign: 'center',
    fontFamily: typography.families.sans,
  } as TextStyle,
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: spacing.md,
  } as ViewStyle,
  footerText: {
    fontSize: typography.sizes.sm,
    color: colors.textLight,
    marginRight: spacing.xs,
    fontFamily: typography.families.sans,
  } as TextStyle,
  footerLink: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    fontFamily: typography.families.sans,
  } as TextStyle,
});