import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Animated, 
  Dimensions,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { OnboardingCarousel } from '@/components/OnboardingCarousel';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated, hasCompletedOnboarding, setHasCompletedOnboarding } = useAuthStore();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
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
        duration: 800,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, []);
  
  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated && isNavigationReady) {
      setIsLoading(true);
      // Use a timeout to ensure navigation happens after render cycle
      const timer = setTimeout(() => {
        router.replace('/(tabs)');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isNavigationReady, router]);
  
  const handleLogin = () => {
    if (isNavigationReady) {
      router.push('/login');
    }
  };
  
  const handleSignup = () => {
    if (isNavigationReady) {
      router.push('/signup');
    }
  };
  
  const handleSkip = () => {
    if (isNavigationReady) {
      setHasCompletedOnboarding(true);
      router.push('/login');
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Redirecting to home...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {!hasCompletedOnboarding ? (
        <OnboardingCarousel 
          onComplete={() => {
            setHasCompletedOnboarding(true);
          }}
          onSkip={handleSkip}
        />
      ) : (
        <Animated.View 
          style={[
            styles.content,
            { 
              opacity: fadeAnim,
              transform: Platform.OS !== 'web' ? [{ translateY: slideAnim }] : undefined
            }
          ]}
        >
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/images/splash-icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Fyke</Text>
            <Text style={styles.tagline}>Connect with skilled professionals instantly</Text>
          </View>
          
          <View style={styles.illustrationContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }}
              style={styles.illustration}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.footer}>
            <Button
              title="Create an Account"
              onPress={handleSignup}
              type="primary"
              size="large"
              style={styles.signupButton}
              icon={<ArrowRight size={20} color="#FFFFFF" />}
              iconPosition="right"
            />
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.demoButton}
              onPress={() => router.push('/prototype')}
            >
              <Text style={styles.demoButtonText}>View App Prototype</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

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
  content: {
    flex: 1,
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0px 10px 16px rgba(0, 0, 0, 0.2)',
      }
    }),
  },
  illustration: {
    width: width * 0.8,
    height: width * 0.6,
    borderRadius: 16,
  },
  footer: {
    marginTop: 'auto',
  },
  signupButton: {
    marginBottom: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginText: {
    fontSize: 14,
    color: colors.textLight,
    marginRight: 4,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  demoButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  demoButtonText: {
    fontSize: 14,
    color: colors.textLight,
    textDecorationLine: 'underline',
  },
});