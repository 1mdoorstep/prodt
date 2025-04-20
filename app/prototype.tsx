import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Platform,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, Check, Smartphone, User, Briefcase, MessageSquare, Settings, Home as HomeIcon } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function PrototypeScreen() {
  const router = useRouter();
  
  const handleBack = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Prototype</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>User Flow Overview</Text>
        <Text style={styles.subtitle}>
          This prototype demonstrates the complete user journey from onboarding to using the app.
        </Text>
        
        {/* Step 1: Onboarding */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Onboarding</Text>
          </View>
          
          <View style={styles.stepContent}>
            <Text style={styles.stepDescription}>
              Users are introduced to the app's key features through an engaging onboarding carousel.
            </Text>
            
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                style={styles.stepImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay}>
                <Text style={styles.imageOverlayText}>Welcome Screen</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Step 2: Authentication */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={styles.stepTitle}>Authentication</Text>
          </View>
          
          <View style={styles.stepContent}>
            <Text style={styles.stepDescription}>
              Users can sign up or log in using their phone number and OTP verification.
            </Text>
            
            <View style={styles.multiImageContainer}>
              <View style={styles.imageWrapper}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                  style={styles.smallStepImage}
                  resizeMode="cover"
                />
                <View style={styles.smallImageOverlay}>
                  <Text style={styles.smallImageOverlayText}>Phone Input</Text>
                </View>
              </View>
              
              <View style={styles.imageWrapper}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1536599424071-0b215a388ba7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                  style={styles.smallStepImage}
                  resizeMode="cover"
                />
                <View style={styles.smallImageOverlay}>
                  <Text style={styles.smallImageOverlayText}>OTP Verification</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        {/* Step 3: Role Selection */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.stepTitle}>Role Selection</Text>
          </View>
          
          <View style={styles.stepContent}>
            <Text style={styles.stepDescription}>
              Users choose their role as either a service provider (worker) or a service seeker (employer).
            </Text>
            
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                style={styles.stepImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay}>
                <Text style={styles.imageOverlayText}>Role Selection Popup</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Step 4: Language Selection */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>4</Text>
            </View>
            <Text style={styles.stepTitle}>Language Selection</Text>
          </View>
          
          <View style={styles.stepContent}>
            <Text style={styles.stepDescription}>
              Users select their preferred language from multiple options to personalize their experience.
            </Text>
            
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                style={styles.stepImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay}>
                <Text style={styles.imageOverlayText}>Language Selection</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Step 5: Profile Setup */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>5</Text>
            </View>
            <Text style={styles.stepTitle}>Profile Setup</Text>
          </View>
          
          <View style={styles.stepContent}>
            <Text style={styles.stepDescription}>
              Users complete their profile with personal details and skills (for workers) or preferences (for employers).
            </Text>
            
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                style={styles.stepImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay}>
                <Text style={styles.imageOverlayText}>Profile Setup</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Step 6: Main App Experience */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>6</Text>
            </View>
            <Text style={styles.stepTitle}>Main App Experience</Text>
          </View>
          
          <View style={styles.stepContent}>
            <Text style={styles.stepDescription}>
              The app features five main tabs for a comprehensive user experience.
            </Text>
            
            <View style={styles.featureGrid}>
              <View style={styles.featureItem}>
                <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(0, 122, 255, 0.1)' }]}>
                  <HomeIcon size={24} color={colors.primary} />
                </View>
                <Text style={styles.featureName}>Home</Text>
                <Text style={styles.featureDescription}>Personalized dashboard with recommendations</Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(255, 149, 0, 0.1)' }]}>
                  <Briefcase size={24} color="#FF9500" />
                </View>
                <Text style={styles.featureName}>Jobs</Text>
                <Text style={styles.featureDescription}>Browse or post job opportunities</Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
                  <User size={24} color="#34C759" />
                </View>
                <Text style={styles.featureName}>Workers</Text>
                <Text style={styles.featureDescription}>Find skilled professionals</Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(255, 45, 85, 0.1)' }]}>
                  <MessageSquare size={24} color="#FF2D55" />
                </View>
                <Text style={styles.featureName}>Chats</Text>
                <Text style={styles.featureDescription}>Communicate with workers or employers</Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(88, 86, 214, 0.1)' }]}>
                  <Settings size={24} color="#5856D6" />
                </View>
                <Text style={styles.featureName}>Settings</Text>
                <Text style={styles.featureDescription}>Manage your account and preferences</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Conclusion */}
        <View style={styles.conclusionContainer}>
          <Text style={styles.conclusionTitle}>Ready to Experience the App?</Text>
          <Text style={styles.conclusionText}>
            This prototype demonstrates the complete user flow from onboarding to using the main features of the app.
            The actual app provides a seamless experience for connecting workers with employers.
          </Text>
          
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => router.replace('/(auth)')}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Start Using the App</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
    lineHeight: 22,
  },
  stepContainer: {
    marginBottom: 32,
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  stepContent: {
    padding: 16,
  },
  stepDescription: {
    fontSize: 15,
    color: colors.textLight,
    marginBottom: 16,
    lineHeight: 22,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  stepImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
  },
  imageOverlayText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  multiImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  imageWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  smallStepImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
  smallImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
  },
  smallImageOverlayText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureItem: {
    width: (width - 72) / 2,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 18,
  },
  conclusionContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  conclusionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  conclusionText: {
    fontSize: 15,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
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
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});