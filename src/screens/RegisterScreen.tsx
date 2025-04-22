import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Input } from '@/components';
import { useThemeColors } from '@/utils';
import { useAuthStore } from '@/store/auth-store';
import { RootStackParamList } from '@/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const colors = useThemeColors();
  const { register } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
    } catch (error) {
      Alert.alert('Error', 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.form}>
        <Input
          label="Name"
          value={formData.name}
          onChangeText={(text: string) => setFormData({ ...formData, name: text })}
          placeholder="Enter your name"
          required
        />
        
        <Input
          label="Email"
          value={formData.email}
          onChangeText={(text: string) => setFormData({ ...formData, email: text })}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          required
        />
        
        <Input
          label="Password"
          value={formData.password}
          onChangeText={(text: string) => setFormData({ ...formData, password: text })}
          placeholder="Enter your password"
          secureTextEntry
          required
        />
        
        <Input
          label="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(text: string) => setFormData({ ...formData, confirmPassword: text })}
          placeholder="Confirm your password"
          secureTextEntry
          required
        />
        
        <Button
          title="Register"
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.submitButton}
        />
        
        <Button
          title="Already have an account? Login"
          onPress={() => navigation.navigate('Login')}
          variant="text"
          style={styles.loginButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
    gap: 16,
  },
  submitButton: {
    marginTop: 8,
  },
  loginButton: {
    marginTop: 16,
  },
}); 