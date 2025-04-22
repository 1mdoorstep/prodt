import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Platform,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, Camera, MapPin, Briefcase, Award } from 'lucide-react-native';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { useAuthStore } from '../../store';

// Mock skills for worker role
const SKILLS = [
  'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning',
  'Gardening', 'Moving', 'Delivery', 'Cooking', 'Babysitting',
  'Pet Care', 'Computer Repair', 'Teaching', 'Photography', 'Driving'
];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { user, updateProfile, setHasSetupProfile, isLoading } = useAuthStore();
  
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // Set initial values from user if available
  useEffect(() => {
    if (user) {
      setProfilePicture(user.profilePicture || '');
      setLocation(user.location || '');
      setBio(user.bio || '');
      setSelectedSkills(user.skills || []);
    }
  }, [user]);
  
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
  
  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };
  
  const handleSubmit = () => {
    if (!isNavigationReady || isSubmitting) return;
    
    if (!location) {
      Alert.alert('Missing Information', 'Please enter your location');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update profile in store
      updateProfile({
        profilePicture,
        location,
        bio,
        skills: selectedSkills,
      });
      
      // Mark profile setup as complete
      setHasSetupProfile(true);
      
      // Navigate to home screen
      setTimeout(() => {
        setIsSubmitting(false);
        router.replace('/(tabs)');
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };
  
  const handleGoBack = () => {
    if (isNavigationReady) {
      router.back();
    }
  };
  
  const handleSelectProfilePicture = () => {
    // In a real app, this would open the image picker
    // For demo, we'll just set a random image
    const randomImages = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    ];
    
    const randomImage = randomImages[Math.floor(Math.random() * randomImages.length)];
    setProfilePicture(randomImage);
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
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>
              Add more details to help others find you
            </Text>
          </View>
          
          <View style={styles.profilePictureContainer}>
            <TouchableOpacity 
              style={styles.profilePictureWrapper}
              onPress={handleSelectProfilePicture}
              activeOpacity={0.8}
            >
              {profilePicture ? (
                <Image 
                  source={{ uri: profilePicture }}
                  style={styles.profilePicture}
                />
              ) : (
                <View style={styles.profilePicturePlaceholder}>
                  <Text style={styles.profilePicturePlaceholderText}>
                    {user?.name?.charAt(0) || 'U'}
                  </Text>
                </View>
              )}
              <View style={styles.cameraButton}>
                <Camera size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
          </View>
          
          <View style={styles.form}>
            <Input
              label="Location"
              placeholder="Enter your city or area"
              value={location}
              onChangeText={setLocation}
              leftIcon={<MapPin size={20} color={colors.textLight} />}
            />
            
            <Input
              label="Bio"
              placeholder="Tell us about yourself (optional)"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
              leftIcon={<Briefcase size={20} color={colors.textLight} />}
            />
            
            <View style={styles.skillsContainer}>
              <View style={styles.skillsHeader}>
                <Award size={20} color={colors.textLight} />
                <Text style={styles.skillsLabel}>Select Your Skills</Text>
              </View>
              
              <View style={styles.skillsGrid}>
                {SKILLS.map((skill) => (
                  <TouchableOpacity
                    key={skill}
                    style={[
                      styles.skillItem,
                      selectedSkills.includes(skill) && styles.selectedSkillItem
                    ]}
                    onPress={() => handleSkillToggle(skill)}
                    activeOpacity={0.7}
                  >
                    <Text 
                      style={[
                        styles.skillText,
                        selectedSkills.includes(skill) && styles.selectedSkillText
                      ]}
                    >
                      {skill}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          
          <Button
            title={isSubmitting ? "Saving Profile..." : "Complete Setup"}
            onPress={handleSubmit}
            variant="primary"
            size="lg"
            style={styles.button}
            disabled={isSubmitting || !location}
            icon={isSubmitting ? 
              <ActivityIndicator size="small" color="#FFFFFF" /> : 
              <ArrowRight size={20} color={colors.card} />
            }
            iconPosition="right"
          />
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
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    lineHeight: 24,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profilePictureWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
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
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePicturePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicturePlaceholderText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  form: {
    marginBottom: 24,
  },
  skillsContainer: {
    marginTop: 16,
  },
  skillsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  skillsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  skillItem: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedSkillItem: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  skillText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedSkillText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  button: {
    marginTop: 16,
  },
});