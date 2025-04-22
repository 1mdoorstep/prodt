import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

export interface AdCardProps {
  title: string;
  description: string;
  onPress: () => void;
  backgroundColor?: string;
  actionText?: string;
  icon?: React.ReactNode;
}

export const AdCard: React.FC<AdCardProps> = ({
  title,
  description,
  onPress,
  backgroundColor = colors.primary,
  actionText = "Learn More",
  icon
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={[backgroundColor, backgroundColor + '99']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            <View style={styles.actionContainer}>
              <Text style={styles.actionText}>{actionText}</Text>
            </View>
          </View>
          
          {icon && (
            <View style={styles.iconContainer}>
              {icon}
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
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
  gradient: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    padding: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  actionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
});