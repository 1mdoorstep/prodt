import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { 
  Wrench, 
  Truck, 
  ShoppingBag, 
  Briefcase, 
  Home, 
  Utensils, 
  Construction, 
  Cpu, 
  Wifi, 
  Flower, 
  Stethoscope, 
  Heart, 
  Car, 
  Paintbrush,
  Shield,
  Hammer
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { WorkerCategory } from '@/types/worker';
import { LinearGradient } from 'expo-linear-gradient';

interface CategoryCardProps {
  category: WorkerCategory;
  isSelected: boolean;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected,
  onPress,
  size = 'medium'
}) => {
  const getCategoryIcon = () => {
    const iconSize = size === 'small' ? 20 : size === 'medium' ? 24 : 28;
    const iconColor = isSelected ? '#FFFFFF' : colors.primary;
    
    switch (category) {
      case 'Electrician':
        return <Wrench size={iconSize} color={iconColor} />;
      case 'Plumbing':
        return <Wrench size={iconSize} color={iconColor} />;
      case 'Delivery':
        return <Truck size={iconSize} color={iconColor} />;
      case 'Shopping':
        return <ShoppingBag size={iconSize} color={iconColor} />;
      case 'Personal':
        return <Briefcase size={iconSize} color={iconColor} />;
      case 'Commercial':
        return <Home size={iconSize} color={iconColor} />; // Using Home icon instead of Building
      case 'Logistics':
        return <Truck size={iconSize} color={iconColor} />;
      case 'Security':
        return <Shield size={iconSize} color={iconColor} />;
      case 'Food':
        return <Utensils size={iconSize} color={iconColor} />;
      case 'Construction':
        return <Construction size={iconSize} color={iconColor} />;
      case 'Carpentry':
        return <Hammer size={iconSize} color={iconColor} />;
      case 'Painting':
        return <Paintbrush size={iconSize} color={iconColor} />;
      case 'IT':
        return <Cpu size={iconSize} color={iconColor} />;
      case 'Networking':
        return <Wifi size={iconSize} color={iconColor} />;
      case 'Gardening':
        return <Flower size={iconSize} color={iconColor} />;
      case 'Healthcare':
        return <Stethoscope size={iconSize} color={iconColor} />;
      case 'Caregiving':
        return <Heart size={iconSize} color={iconColor} />;
      case 'Rideshare':
        return <Car size={iconSize} color={iconColor} />;
      default:
        return <Briefcase size={iconSize} color={iconColor} />;
    }
  };
  
  const sizeStyles = {
    small: {
      container: styles.smallContainer,
      text: styles.smallText
    },
    medium: {
      container: styles.mediumContainer,
      text: styles.mediumText
    },
    large: {
      container: styles.largeContainer,
      text: styles.largeText
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        sizeStyles[size].container,
        isSelected && styles.selectedContainer
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {isSelected ? (
        <LinearGradient
          colors={[colors.primary, colors.primaryLight || colors.primary]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.content}>
            {getCategoryIcon()}
            <Text style={[sizeStyles[size].text, styles.selectedText]}>
              {category}
            </Text>
          </View>
        </LinearGradient>
      ) : (
        <View style={styles.content}>
          {getCategoryIcon()}
          <Text style={[sizeStyles[size].text, styles.text]}>
            {category}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.card,
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
  selectedContainer: {
    borderColor: colors.primary,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  smallContainer: {
    width: 80,
    height: 80,
  },
  mediumContainer: {
    width: 100,
    height: 100,
  },
  largeContainer: {
    width: 120,
    height: 120,
  },
  text: {
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  selectedText: {
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
});