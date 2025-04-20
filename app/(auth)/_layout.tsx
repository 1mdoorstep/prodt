import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Welcome',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: 'Create Account',
        }}
      />
      <Stack.Screen
        name="otp"
        options={{
          title: 'Verify OTP',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="language-selection"
        options={{
          title: 'Choose Language',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile-setup"
        options={{
          title: 'Setup Profile',
          headerShown: false,
        }}
      />
    </Stack>
  );
}