import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Star, MapPin, Phone, Clock, Shield, Check, Award } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Worker } from '@/types/worker';
import { LinearGradient } from 'expo-linear-gradient';

interface WorkerCardProps {
  worker: Worker;
  onPress: () => void;
  featured?: boolean;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ 
  worker, 
  onPress,
  featured = false
}) => {
  // Determine if worker is available based on status
  const isAvailable = worker.status === 'available';
  
  // Determine if worker accepts calls (simplified logic for demo)
  const allowCalls = worker.phone && worker.phone.length > 0;
  
  // Check if worker is top rated
  const isTopRated = worker.rating.overall >= 4.5;
  
  return (
    <TouchableOpacity 
      style={[styles.container, featured && styles.featuredContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {featured && (
        <LinearGradient
          colors={['rgba(0,122,255,0.1)', 'rgba(0,122,255,0)']}
          style={styles.featuredGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}
      
      {isTopRated && (
        <View style={styles.topRatedBadge}>
          <Award size={12} color="#FFFFFF" />
          <Text style={styles.topRatedText}>Top Rated</Text>
        </View>
      )}
      
      <View style={styles.imageContainer}>
        <Image 
          source={{ 
            uri: worker.profilePicture || 
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' 
          }} 
          style={styles.image} 
        />
        {isAvailable && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{worker.name}</Text>
          {worker.isVerified && (
            <View style={styles.verifiedBadge}>
              <Check size={12} color="#FFFFFF" />
            </View>
          )}
        </View>
        
        <View style={styles.ratingContainer}>
          <Star size={16} color={colors.warning} fill={colors.warning} />
          <Text style={styles.rating}>{worker.rating.overall.toFixed(1)}</Text>
          <Text style={styles.jobs}>({worker.completedJobs} jobs)</Text>
        </View>
        
        <View style={styles.locationContainer}>
          <MapPin size={14} color={colors.textLight} />
          <Text style={styles.location}>{worker.radius?.toFixed(1) || '?'} km away</Text>
        </View>
        
        {worker.categories && worker.categories.length > 0 && (
          <View style={styles.categoriesContainer}>
            {worker.categories.slice(0, 2).map((category, index) => (
              <View key={index} style={styles.categoryChip}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
            {worker.categories.length > 2 && (
              <Text style={styles.moreCategories}>+{worker.categories.length - 2} more</Text>
            )}
          </View>
        )}
        
        <View style={styles.statusContainer}>
          {isAvailable ? (
            <View style={styles.availableContainer}>
              <Clock size={14} color={colors.success} />
              <Text style={styles.availableText}>Available now</Text>
            </View>
          ) : (
            <View style={styles.unavailableContainer}>
              <Clock size={14} color={colors.textLight} />
              <Text style={styles.unavailableText}>Not available</Text>
            </View>
          )}
          
          {allowCalls ? (
            <View style={styles.callsContainer}>
              <Phone size={14} color={colors.primary} />
              <Text style={styles.callsText}>Accepts calls</Text>
            </View>
          ) : (
            <View style={styles.noCallsContainer}>
              <Phone size={14} color={colors.textLight} />
              <Text style={styles.noCallsText}>No calls</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
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
  featuredContainer: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  featuredGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topRatedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  topRatedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.card,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 6,
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 4,
    marginRight: 2,
  },
  jobs: {
    fontSize: 12,
    color: colors.textLight,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  location: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  categoryChip: {
    backgroundColor: colors.highlight,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 10,
    color: colors.text,
  },
  moreCategories: {
    fontSize: 10,
    color: colors.textLight,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  availableText: {
    fontSize: 10,
    color: colors.success,
    marginLeft: 4,
    fontWeight: '500',
  },
  unavailableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  unavailableText: {
    fontSize: 10,
    color: colors.textLight,
    marginLeft: 4,
  },
  callsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  callsText: {
    fontSize: 10,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  noCallsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  noCallsText: {
    fontSize: 10,
    color: colors.textLight,
    marginLeft: 4,
  },
});