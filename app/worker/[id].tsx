import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Platform,
  Dimensions,
  Linking
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Star,
  MapPin,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  Shield,
  Check,
  ChevronLeft,
  Heart,
  Share2,
  Briefcase,
  Award,
  Languages,
  DollarSign,
  ArrowLeft
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';
import { useWorkerStore } from '@/store/worker-store';
import { CategoryCard } from '@/components/CategoryCard';

export default function WorkerDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getWorkerById } = useWorkerStore();
  
  const worker = getWorkerById(id as string);
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 280;
  const screenWidth = Dimensions.get('window').width;
  
  if (!worker) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Worker not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });
  
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, headerHeight / 2, headerHeight],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  
  const imageScale = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [1, 1.2],
    extrapolate: 'clamp',
  });
  
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [headerHeight - 100, headerHeight - 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const handleCall = () => {
    if (worker.phone) {
      Linking.openURL(`tel:${worker.phone}`);
    }
  };
  
  const handleMessage = () => {
    router.push(`/chat/${worker.id}`);
  };
  
  const handleShare = () => {
    // Share functionality would go here
  };
  
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };
  
  const handleBack = () => {
    router.back();
  };
  
  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            color={colors.warning}
            fill={star <= Math.round(rating) ? colors.warning : 'transparent'}
          />
        ))}
      </View>
    );
  };
  
  const renderAboutTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Bio</Text>
        <Text style={styles.bioText}>
          {worker.bio || "No bio provided. This worker hasn't added a description yet."}
        </Text>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {worker.categories.map((category) => (
            <CategoryCard
              key={category}
              category={category}
              isSelected={false}
              onPress={() => {}}
              size="small"
            />
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.skillsContainer}>
          {worker.skills.map((skill, index) => (
            <View key={index} style={styles.skillItem}>
              <Text style={styles.skillName}>{skill.name}</Text>
              <View style={styles.skillLevelContainer}>
                <Text style={styles.skillLevel}>{skill.level}</Text>
                {skill.yearsOfExperience && (
                  <Text style={styles.skillExperience}>
                    {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
      
      {worker.certifications && worker.certifications.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          <View style={styles.certificationsContainer}>
            {worker.certifications.map((cert, index) => (
              <View key={index} style={styles.certificationItem}>
                <Award size={20} color={colors.primary} />
                <View style={styles.certificationDetails}>
                  <Text style={styles.certificationName}>{cert.name}</Text>
                  <Text style={styles.certificationIssuer}>
                    Issued by {cert.issuedBy} on {new Date(cert.issuedDate).toLocaleDateString()}
                  </Text>
                  {cert.expiryDate && (
                    <Text style={styles.certificationExpiry}>
                      Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {worker.languages && worker.languages.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.languagesContainer}>
            <Languages size={20} color={colors.textLight} />
            <Text style={styles.languagesText}>
              {worker.languages.join(', ')}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
  
  const renderRatingsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.overallRatingContainer}>
        <Text style={styles.overallRatingTitle}>Overall Rating</Text>
        <View style={styles.overallRatingValue}>
          <Text style={styles.ratingNumber}>{worker.rating.overall.toFixed(1)}</Text>
          {renderStars(worker.rating.overall)}
          <Text style={styles.reviewCount}>
            ({worker.rating.reviewCount} {worker.rating.reviewCount === 1 ? 'review' : 'reviews'})
          </Text>
        </View>
      </View>
      
      <View style={styles.ratingBreakdownContainer}>
        <Text style={styles.ratingBreakdownTitle}>Rating Breakdown</Text>
        
        <View style={styles.ratingItem}>
          <Text style={styles.ratingLabel}>Communication</Text>
          <View style={styles.ratingBarContainer}>
            <View 
              style={[
                styles.ratingBar, 
                { width: `${(worker.rating.communication / 5) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.ratingValue}>{worker.rating.communication.toFixed(1)}</Text>
        </View>
        
        <View style={styles.ratingItem}>
          <Text style={styles.ratingLabel}>Professionalism</Text>
          <View style={styles.ratingBarContainer}>
            <View 
              style={[
                styles.ratingBar, 
                { width: `${(worker.rating.professionalism / 5) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.ratingValue}>{worker.rating.professionalism.toFixed(1)}</Text>
        </View>
        
        <View style={styles.ratingItem}>
          <Text style={styles.ratingLabel}>Quality</Text>
          <View style={styles.ratingBarContainer}>
            <View 
              style={[
                styles.ratingBar, 
                { width: `${(worker.rating.quality / 5) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.ratingValue}>{worker.rating.quality.toFixed(1)}</Text>
        </View>
        
        <View style={styles.ratingItem}>
          <Text style={styles.ratingLabel}>Timeliness</Text>
          <View style={styles.ratingBarContainer}>
            <View 
              style={[
                styles.ratingBar, 
                { width: `${(worker.rating.timeliness / 5) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.ratingValue}>{worker.rating.timeliness.toFixed(1)}</Text>
        </View>
      </View>
      
      <View style={styles.reviewsContainer}>
        <Text style={styles.reviewsTitle}>Reviews</Text>
        <Text style={styles.noReviewsText}>No reviews available yet.</Text>
      </View>
    </View>
  );
  
  const renderAvailabilityTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Current Status</Text>
        <View style={[
          styles.statusBadge,
          worker.status === 'available' ? styles.availableBadge : 
          worker.status === 'busy' ? styles.busyBadge : styles.offlineBadge
        ]}>
          <Text style={styles.statusText}>
            {worker.status === 'available' ? 'Available' : 
             worker.status === 'busy' ? 'Busy' : 'Offline'}
          </Text>
        </View>
      </View>
      
      {worker.availability && (
        <View style={styles.scheduleContainer}>
          <Text style={styles.scheduleTitle}>Weekly Schedule</Text>
          <View style={styles.daysContainer}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <View 
                key={day} 
                style={[
                  styles.dayItem,
                  worker.availability?.days.includes(day.toLowerCase()) && styles.availableDay
                ]}
              >
                <Text style={[
                  styles.dayText,
                  worker.availability?.days.includes(day.toLowerCase()) && styles.availableDayText
                ]}>
                  {day}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.hoursText}>
            Hours: {worker.availability.hours}
          </Text>
        </View>
      )}
      
      <View style={styles.rateContainer}>
        <Text style={styles.rateTitle}>Hourly Rate</Text>
        <View style={styles.rateValue}>
          <DollarSign size={20} color={colors.text} />
          <Text style={styles.rateAmount}>
            {worker.hourlyRate ? `$${worker.hourlyRate.toFixed(2)}/hr` : 'Not specified'}
          </Text>
        </View>
      </View>
      
      <View style={styles.locationContainer}>
        <Text style={styles.locationTitle}>Service Area</Text>
        <View style={styles.locationDetails}>
          <MapPin size={20} color={colors.textLight} />
          <Text style={styles.locationText}>
            {worker.location.address}
          </Text>
        </View>
        <Text style={styles.radiusText}>
          Travels up to {worker.radius || 10} km
        </Text>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.headerBackground,
            {
              opacity: imageOpacity,
              transform: [{ scale: imageScale }],
            },
          ]}
        >
          <Image
            source={{
              uri: worker.profilePicture ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
            }}
            style={styles.headerImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.headerGradient}
          />
        </Animated.View>
        
        <View style={styles.headerContent}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
            >
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerActionButton}
                onPress={handleFavoriteToggle}
              >
                <Heart
                  size={24}
                  color="#FFFFFF"
                  fill={isFavorite ? '#FFFFFF' : 'transparent'}
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.headerActionButton}
                onPress={handleShare}
              >
                <Share2 size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.workerInfoContainer}>
            <View style={styles.nameContainer}>
              <Text style={styles.workerName}>{worker.name}</Text>
              {worker.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Check size={12} color="#FFFFFF" />
                </View>
              )}
            </View>
            
            <View style={styles.ratingRow}>
              <Star size={16} color={colors.warning} fill={colors.warning} />
              <Text style={styles.ratingText}>
                {worker.rating.overall.toFixed(1)} ({worker.rating.reviewCount})
              </Text>
            </View>
            
            <View style={styles.locationRow}>
              <MapPin size={16} color="#FFFFFF" />
              <Text style={styles.locationText}>{worker.location.address}</Text>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Briefcase size={16} color="#FFFFFF" />
                <Text style={styles.statText}>{worker.completedJobs} jobs</Text>
              </View>
              
              <View style={styles.statItem}>
                <Calendar size={16} color="#FFFFFF" />
                <Text style={styles.statText}>
                  Since {new Date(worker.memberSince).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
      
      <Animated.View
        style={[
          styles.headerTitle,
          {
            opacity: headerTitleOpacity,
          },
        ]}
      >
        <Text style={styles.headerTitleText}>{worker.name}</Text>
      </Animated.View>
      
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.messageButton]}
          onPress={handleMessage}
        >
          <MessageSquare size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.callButton]}
          onPress={handleCall}
        >
          <Phone size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Call</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'about' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('about')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'about' && styles.activeTabButtonText,
            ]}
          >
            About
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'ratings' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('ratings')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'ratings' && styles.activeTabButtonText,
            ]}
          >
            Ratings
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'availability' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('availability')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'availability' && styles.activeTabButtonText,
            ]}
          >
            Availability
          </Text>
        </TouchableOpacity>
      </View>
      
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingTop: headerHeight },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {activeTab === 'about' && renderAboutTab()}
        {activeTab === 'ratings' && renderRatingsTab()}
        {activeTab === 'availability' && renderAvailabilityTab()}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    zIndex: 1,
    overflow: 'hidden',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 160,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  workerInfoContainer: {
    marginBottom: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: colors.success,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  headerTitle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
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
  headerTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    marginTop: 280,
    zIndex: 0,
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
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  messageButton: {
    backgroundColor: colors.primary,
  },
  callButton: {
    backgroundColor: colors.success,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textLight,
  },
  activeTabButtonText: {
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 24,
  },
  tabContent: {
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  skillsContainer: {
    gap: 12,
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  skillLevelContainer: {
    alignItems: 'flex-end',
  },
  skillLevel: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  skillExperience: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  certificationsContainer: {
    gap: 12,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  certificationDetails: {
    marginLeft: 12,
    flex: 1,
  },
  certificationName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  certificationIssuer: {
    fontSize: 14,
    color: colors.textLight,
  },
  certificationExpiry: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  languagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  languagesText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  overallRatingContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  overallRatingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  overallRatingValue: {
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text,
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textLight,
  },
  ratingBreakdownContainer: {
    marginBottom: 24,
  },
  ratingBreakdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingLabel: {
    width: 120,
    fontSize: 14,
    color: colors.text,
  },
  ratingBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.highlight,
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  ratingBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  ratingValue: {
    width: 30,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'right',
  },
  reviewsContainer: {
    marginBottom: 24,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  noReviewsText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    paddingVertical: 24,
  },
  statusContainer: {
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  availableBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  busyBadge: {
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
  },
  offlineBadge: {
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  scheduleContainer: {
    marginBottom: 24,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  availableDay: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textLight,
  },
  availableDayText: {
    color: '#FFFFFF',
  },
  hoursText: {
    fontSize: 16,
    color: colors.text,
  },
  rateContainer: {
    marginBottom: 24,
  },
  rateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  rateValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  locationContainer: {
    marginBottom: 24,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  locationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radiusText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 24,
  },
});