import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Platform,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { OnboardingCarousel } from '@/components/OnboardingCarousel';

export default function WelcomeScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  const handleGetStarted = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.replace('/(auth)');
    }, 500);
  };
  
  const handleSkip = () => {
    setShowOnboarding(false);
  };
  
  const handleComplete = () => {
    setShowOnboarding(false);
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  if (showOnboarding) {
    return (
      <OnboardingCarousel 
        onComplete={handleComplete}
        onSkip={handleSkip}
      />
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/splash-icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Fyke</Text>
          <Text style={styles.tagline}>Connect with skilled professionals instantly</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleGetStarted}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 18,
    color: colors.textLight,
    textAlign: 'center',
    maxWidth: 300,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    maxWidth: 300,
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
      }
    }),
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
});