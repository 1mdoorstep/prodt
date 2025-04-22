import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Star, MapPin, Phone, Clock, Shield, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Driver } from '@/types/driver';

interface DriverCardProps {
  driver: Driver;
  onPress: () => void;
}

export const DriverCard: React.FC<DriverCardProps> = ({ driver, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ 
            uri: driver.profilePicture || 
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' 
          }} 
          style={styles.image} 
        />
        {driver.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{driver.name}</Text>
          {driver.governmentIdVerified && (
            <View style={styles.verifiedBadge}>
              <Check size={12} color="#FFFFFF" />
            </View>
          )}
        </View>
        
        <View style={styles.ratingContainer}>
          <Star size={16} color={colors.warning} fill={colors.warning} />
          <Text style={styles.rating}>{driver.rating.toFixed(1)}</Text>
          <Text style={styles.rides}>({driver.totalRides} rides)</Text>
        </View>
        
        <View style={styles.locationContainer}>
          <MapPin size={14} color={colors.textLight} />
          <Text style={styles.location}>{driver.distance?.toFixed(1) || '?'} km away</Text>
        </View>
        
        {driver.profession && <View style={styles.professionContainer}>
            <Text style={styles.profession}>{driver.profession}</Text>
          </View>
        }
        
        <View style={styles.statusContainer}>
          {driver.isAvailable ? (
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
          
          {driver.allowCalls ? (
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
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: colors.border,
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
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 4,
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: colors.success,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 4,
  },
  rides: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  professionContainer: {
    marginTop: 4,
  },
  profession: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  availableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  availableText: {
    fontSize: 12,
    color: colors.success,
    marginLeft: 4,
    fontWeight: '500',
  },
  unavailableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  unavailableText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  callsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  callsText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  noCallsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  noCallsText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
});