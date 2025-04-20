import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Platform,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';

const LANGUAGES = [
  { id: 'en', name: 'English', localName: 'English' },
  { id: 'ta', name: 'Tamil', localName: 'தமிழ்' },
  { id: 'hi', name: 'Hindi', localName: 'हिन्दी' },
  { id: 'te', name: 'Telugu', localName: 'తెలుగు' },
  { id: 'kn', name: 'Kannada', localName: 'ಕನ್ನಡ' },
  { id: 'ml', name: 'Malayalam', localName: 'മലയാളം' },
  { id: 'mr', name: 'Marathi', localName: 'मराठी' },
  { id: 'bn', name: 'Bengali', localName: 'বাংলা' },
  { id: 'gu', name: 'Gujarati', localName: 'ગુજરાતી' },
  { id: 'pa', name: 'Punjabi', localName: 'ਪੰਜਾਬੀ' },
];

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const { selectLanguage, setHasSelectedLanguage, user } = useAuthStore();
  const [language, setLanguage] = useState(user?.language || 'en');
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  
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
  
  useEffect(() => {
    // Start entrance animations
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
  
  const handleLanguageSelect = (id: string) => {
    setLanguage(id);
  };
  
  const handleContinue = () => {
    if (!isNavigationReady || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Save language selection
      selectLanguage(language);
      setHasSelectedLanguage(true);
      
      // Navigate to profile setup or home based on whether profile is set up
      setTimeout(() => {
        setIsLoading(false);
        router.replace('/(auth)/profile-setup');
      }, 500);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to save language preference. Please try again.');
    }
  };
  
  const handleGoBack = () => {
    if (isNavigationReady) {
      router.back();
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
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
        <View style={styles.headerContent}>
          <Text style={styles.title}>Choose Your Language</Text>
          <Text style={styles.subtitle}>
            Select your preferred language for the app. You can change this anytime.
          </Text>
        </View>
        
        <ScrollView 
          style={styles.languagesContainer}
          contentContainerStyle={styles.languagesContent}
          showsVerticalScrollIndicator={false}
        >
          {LANGUAGES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.languageItem,
                language === item.id && styles.selectedLanguageItem
              ]}
              onPress={() => handleLanguageSelect(item.id)}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <View style={styles.languageInfo}>
                <Text style={[
                  styles.languageName,
                  language === item.id && styles.selectedLanguageName
                ]}>
                  {item.name}
                </Text>
                <Text style={[
                  styles.languageLocalName,
                  language === item.id && styles.selectedLanguageLocalName
                ]}>
                  {item.localName}
                </Text>
              </View>
              
              {language === item.id && (
                <View style={styles.checkIconContainer}>
                  <Check size={20} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <Button
          title={isLoading ? "Please wait..." : "Continue"}
          onPress={handleContinue}
          type="primary"
          size="large"
          style={styles.button}
          disabled={isLoading}
          icon={isLoading ? 
            <ActivityIndicator size="small" color="#FFFFFF" /> : 
            <ArrowRight size={20} color="#FFFFFF" />
          }
          iconPosition="right"
        />
      </Animated.View>
      
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }}
        style={styles.backgroundImage}
        blurRadius={10}
      />
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundImage: {
    position: 'absolute',
    width,
    height,
    opacity: 0.05,
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
  headerContent: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    maxWidth: '80%',
  },
  languagesContainer: {
    flex: 1,
    marginBottom: 24,
  },
  languagesContent: {
    paddingBottom: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
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
  selectedLanguageItem: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  selectedLanguageName: {
    color: '#FFFFFF',
  },
  languageLocalName: {
    fontSize: 14,
    color: colors.textLight,
  },
  selectedLanguageLocalName: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  checkIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 8,
  },
});