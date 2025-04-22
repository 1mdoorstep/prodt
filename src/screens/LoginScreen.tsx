import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Input } from '@/components';
import { useThemeColors } from '@/utils';
import { useAuthStore } from '@/store/auth-store';
import { RootStackParamList } from '@/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const colors = useThemeColors();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      Alert.alert('Error', 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.form}>
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
        
        <Button
          title="Login"
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.submitButton}
        />
        
        <Button
          title="Don't have an account? Register"
          onPress={() => navigation.navigate('Register')}
          variant="text"
          style={styles.registerButton}
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
  registerButton: {
    marginTop: 16,
  },
}); 