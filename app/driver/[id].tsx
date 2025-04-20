import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Star,
  MapPin,
  Phone,
  MessageSquare,
  ChevronLeft,
  Shield,
  Clock,
  Calendar,
  Award,
  Check,
  X,
  Car,
  Truck,
  Bus,
  Briefcase
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';
import { useDriverStore } from '@/store/driver-store';
import { Driver, VehicleCategory } from '@/types/driver';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width >= 768;

export default function DriverProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { drivers, isLoading, toggleCallPermission } = useDriverStore();
  
  const [driver, setDriver] = useState<Driver | null>(null);
  const [similarDrivers, setSimilarDrivers] = useState<Driver[]>([]);
  
  // Find the driver based on the ID
  useEffect(() => {
    if (id && drivers.length > 0) {
      const foundDriver = drivers.find(d => d.id === id);
      if (foundDriver) {
        setDriver(foundDriver);
        
        // Find similar drivers (same profession or vehicle types)
        if (foundDriver.vehicleCategories && foundDriver.vehicleCategories.length > 0) {
          const similar = drivers.filter(d => 
            d.id !== foundDriver.id && 
            d.profession === foundDriver.profession &&
            d.vehicleCategories?.some(type => 
              foundDriver.vehicleCategories?.includes(type)
            )
          ).slice(0, 3);
          
          setSimilarDrivers(similar);
        }
      }
    }
  }, [id, drivers]);
  
  const handleCallPress = () => {
    if (!driver) return;
    
    if (!driver.allowCalls) {
      Alert.alert(
        "Calls Disabled",
        "This professional has disabled calls. Please use chat instead."
      );
      return;
    }
    
    Alert.alert("Call", `Calling ${driver.name}...`);
  };
  
  const handleChatPress = () => {
    if (!driver) return;
    router.push(`/chat/${driver.id}`);
  };
  
  const handleToggleCallPermission = async () => {
    if (!driver) return;
    
    try {
      await toggleCallPermission(driver.id);
      Alert.alert(
        "Call Permission Updated",
        driver.allowCalls ? 
          "You will no longer receive calls from clients." : 
          "Clients can now call you directly."
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update call permission");
    }
  };
  
  if (isLoading || !driver) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with profile image */}
        <View style={styles.header}>
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent']}
            style={styles.headerGradient}
          >
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </LinearGradient>
          
          <Image 
            source={{ 
              uri: driver.profilePicture || 
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' 
            }} 
            style={styles.profileImage} 
          />
        </View>
        
        {/* Profile info */}
        <View style={styles.profileInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{driver.name}</Text>
            {driver.governmentIdVerified && (
              <View style={styles.verifiedBadge}>
                <Check size={12} color="#FFFFFF" />
              </View>
            )}
          </View>
          
          <View style={styles.ratingContainer}>
            <Star size={18} color={colors.warning} fill={colors.warning} />
            <Text style={styles.rating}>{driver.rating.toFixed(1)}</Text>
            <Text style={styles.rides}>({driver.totalRides} rides)</Text>
          </View>
          
          <View style={styles.locationContainer}>
            <MapPin size={16} color={colors.textLight} />
            <Text style={styles.location}>{driver.distance?.toFixed(1) || '?'} km away</Text>
          </View>
          
          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[
                styles.actionButton,
                !driver.allowCalls && styles.disabledActionButton
              ]}
              onPress={handleCallPress}
              disabled={!driver.allowCalls}
            >
              <Phone size={20} color={driver.allowCalls ? colors.card : colors.disabled} />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleChatPress}
            >
              <MessageSquare size={20} color={colors.card} />
              <Text style={styles.actionButtonText}>Chat</Text>
            </TouchableOpacity>
          </View>
          
          {/* Availability status */}
          {driver.currentAvailability && driver.currentAvailability.isActive ? (
            <View style={styles.availabilityContainer}>
              <View style={styles.availabilityHeader}>
                <Clock size={18} color={colors.success} />
                <Text style={styles.availabilityTitle}>Available Now</Text>
              </View>
              
              <View style={styles.availabilityDetails}>
                <Text style={styles.availabilityText}>
                  Until {new Date(driver.currentAvailability.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={styles.availabilityLocation}>
                  at {driver.currentAvailability.location.address}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.unavailabilityContainer}>
              <View style={styles.unavailabilityHeader}>
                <Clock size={18} color={colors.textLight} />
                <Text style={styles.unavailabilityTitle}>Not Available</Text>
              </View>
              
              <Text style={styles.unavailabilityText}>
                This professional is currently not available for hire
              </Text>
            </View>
          )}
          
          {/* Professional info */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Professional Info</Text>
            
            <View style={styles.infoItem}>
              <Briefcase size={18} color={colors.primary} />
              <Text style={styles.infoText}>
                {driver.profession || "Professional Driver"}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Calendar size={18} color={colors.primary} />
              <Text style={styles.infoText}>
                {driver.recentHires} recent hires
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Award size={18} color={colors.primary} />
              <Text style={styles.infoText}>
                {driver.totalRides} total rides completed
              </Text>
            </View>
            
            {driver.isIndianGovernment && (
              <View style={styles.infoItem}>
                <Shield size={18} color={colors.primary} />
                <Text style={styles.infoText}>
                  Government Employee
                </Text>
              </View>
            )}
          </View>
          
          {/* Vehicle types */}
          {driver.vehicleCategories && driver.vehicleCategories.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Vehicle Types</Text>
              
              <View style={styles.vehiclesContainer}>
                {driver.vehicleCategories.map((category, index) => (
                  <View key={index} style={styles.vehicleItem}>
                    {category === 'Car' && <Car size={18} color={colors.text} />}
                    {category === 'Truck' && <Truck size={18} color={colors.text} />}
                    {category === 'Bus' && <Bus size={18} color={colors.text} />}
                    {category === 'Van' && <Car size={18} color={colors.text} />}
                    <Text style={styles.vehicleText}>{category}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {/* Skills */}
          {driver.skills && driver.skills.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Skills</Text>
              
              <View style={styles.skillsContainer}>
                {driver.skills.map((skill, index) => (
                  <View key={index} style={styles.skillItem}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {/* Similar professionals */}
          {similarDrivers.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Similar Professionals</Text>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.similarDriversContainer}
              >
                {similarDrivers.map(similarDriver => (
                  <TouchableOpacity 
                    key={similarDriver.id}
                    style={styles.similarDriverCard}
                    onPress={() => router.push(`/driver/${similarDriver.id}`)}
                  >
                    <Image 
                      source={{ uri: similarDriver.profilePicture || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' }} 
                      style={styles.similarDriverImage} 
                    />
                    <Text style={styles.similarDriverName} numberOfLines={1}>
                      {similarDriver.name}
                    </Text>
                    <View style={styles.similarDriverRating}>
                      <Star size={12} color={colors.warning} fill={colors.warning} />
                      <Text style={styles.similarDriverRatingText}>
                        {similarDriver.rating.toFixed(1)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
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
  },
  header: {
    height: 250,
    position: 'relative',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : 40,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    padding: 16,
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: colors.success,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  rides: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  disabledActionButton: {
    backgroundColor: colors.disabled,
  },
  actionButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  availabilityContainer: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  availabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  availabilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.success,
    marginLeft: 8,
  },
  availabilityDetails: {
    marginLeft: 26,
  },
  availabilityText: {
    fontSize: 14,
    color: colors.text,
  },
  availabilityLocation: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  unavailabilityContainer: {
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.textLight,
  },
  unavailabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  unavailabilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
    marginLeft: 8,
  },
  unavailabilityText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 26,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  vehiclesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vehicleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  vehicleText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    backgroundColor: colors.highlight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 14,
    color: colors.text,
  },
  similarDriversContainer: {
    paddingBottom: 8,
  },
  similarDriverCard: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
  },
  similarDriverImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  similarDriverName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  similarDriverRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  similarDriverRatingText: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 4,
  },
});