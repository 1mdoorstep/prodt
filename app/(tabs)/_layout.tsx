import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet, Modal, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Home, Briefcase, Users, MessageSquare, Settings } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { DemoButton } from '@/components/DemoButton';
import { useDemoStore, useAuthStore } from '../../store';
import { useRouter } from 'expo-router';
import { RoleSelectionPopup } from '@/components/RoleSelectionPopup';

export default function TabsLayout() {
  const { isDemoMode } = useDemoStore();
  const { 
    isAuthenticated, 
    hasSelectedRole, 
    hasSelectedLanguage, 
    hasSetupProfile, 
    selectRole,
    setHasSelectedRole
  } = useAuthStore();
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // Check authentication and onboarding status
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        // If not authenticated, go to auth screen
        router.replace('/(auth)');
        return;
      }
      
      // If authenticated but role not selected, show role popup
      if (!hasSelectedRole) {
        setShowRolePopup(true);
        setIsLoading(false);
        return;
      }
      
      // If role selected but language not selected, go to language selection
      if (!hasSelectedLanguage) {
        router.replace('/(auth)/language-selection');
        return;
      }
      
      // If language selected but profile not set up, go to profile setup
      if (!hasSetupProfile) {
        router.replace('/(auth)/profile-setup');
        return;
      }
      
      // If all steps are completed, show the tabs
      setIsLoading(false);
    };
    
    // Add a small delay to ensure navigation is ready
    const timer = setTimeout(() => {
      checkAuth();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, hasSelectedRole, hasSelectedLanguage, hasSetupProfile]);
  
  // Handle role selection
  const handleRoleSelect = (role: 'worker' | 'employer') => {
    selectRole(role);
    setHasSelectedRole(true);
    setShowRolePopup(false);
    
    // Navigate to language selection after role selection
    setTimeout(() => {
      router.replace('/(auth)/language-selection');
    }, 300);
  };
  
  if (isLoading && !showRolePopup) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textLight,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            height: Platform.OS === 'ios' ? 90 : 60,
            paddingBottom: Platform.OS === 'ios' ? 30 : 10,
            paddingTop: 10,
            ...Platform.select({
              ios: {
                shadowColor: colors.cardShadow,
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              },
              android: {
                elevation: 8,
              },
              web: {
                boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.1)',
              }
            }),
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          tabBarBackground: () => (
            <View style={StyleSheet.absoluteFill}>
              <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.card }]} />
            </View>
          ),
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="jobs"
          options={{
            title: 'Jobs',
            tabBarIcon: ({ color, size }) => <Briefcase size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="workers"
          options={{
            title: 'Workers',
            tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="chats"
          options={{
            title: 'Chats',
            tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
            tabBarBadge: '3',
            tabBarBadgeStyle: {
              backgroundColor: colors.primary,
              color: '#FFFFFF',
              fontSize: 10,
            },
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          }}
        />
      </Tabs>
      
      {/* Role Selection Popup */}
      {showRolePopup && (
        <RoleSelectionPopup
          visible={showRolePopup}
          onSelectRole={handleRoleSelect}
        />
      )}
      
      {/* Demo Button */}
      {isDemoMode && <DemoButton />}
    </>
  );
}

const styles = StyleSheet.create({
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
});