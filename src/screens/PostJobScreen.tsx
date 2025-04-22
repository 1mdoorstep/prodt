import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useJobStore } from '@/store/job-store';
import { useLocationStore } from '@/store/location-store';
import { Button, Input, Select, TextArea, DatePicker } from '@/components';
import { useThemeColors } from '@/utils';
import { JobCategory, JobType, VehicleType } from '@/types';
import { SKILL_CATEGORIES, VEHICLE_TYPES } from '@/constants';

export const PostJobScreen = () => {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const { createJob } = useJobStore();
  const { currentLocation } = useLocationStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as JobCategory,
    jobType: 'Personal' as JobType,
    fare: '',
    duration: '',
    vehicleRequired: '' as VehicleType,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    if (!currentLocation) {
      Alert.alert('Error', 'Please enable location services');
      return;
    }
    
    setIsLoading(true);
    try {
      await createJob({
        ...formData,
        fare: parseInt(formData.fare),
        location: currentLocation,
        expiresAt: formData.expiresAt.toISOString(),
      });
      
      Alert.alert('Success', 'Job posted successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to post job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.form}>
        <Input
          label="Job Title"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
          placeholder="Enter job title"
          required
        />
        
        <TextArea
          label="Description"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Describe the job requirements and responsibilities"
          required
        />
        
        <Select
          label="Category"
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value as JobCategory })}
          items={Object.entries(SKILL_CATEGORIES).map(([value, label]) => ({
            label,
            value,
          }))}
          required
        />
        
        <Select
          label="Job Type"
          value={formData.jobType}
          onValueChange={(value) => setFormData({ ...formData, jobType: value as JobType })}
          items={[
            { label: 'Personal', value: 'Personal' },
            { label: 'Commercial', value: 'Commercial' },
            { label: 'Government', value: 'Government' },
          ]}
        />
        
        <Input
          label="Fare (₹)"
          value={formData.fare}
          onChangeText={(text) => setFormData({ ...formData, fare: text })}
          placeholder="Enter fare amount"
          keyboardType="numeric"
          required
        />
        
        <Input
          label="Duration"
          value={formData.duration}
          onChangeText={(text) => setFormData({ ...formData, duration: text })}
          placeholder="e.g., 2 hours, 1 day, etc."
          required
        />
        
        <Select
          label="Vehicle Required"
          value={formData.vehicleRequired}
          onValueChange={(value) => setFormData({ ...formData, vehicleRequired: value as VehicleType })}
          items={Object.entries(VEHICLE_TYPES).map(([value, label]) => ({
            label,
            value,
          }))}
        />
        
        <DatePicker
          label="Expiry Date"
          value={formData.expiresAt}
          onChange={(date) => setFormData({ ...formData, expiresAt: date })}
          minimumDate={new Date()}
        />
        
        <Button
          title="Post Job"
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
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
}); 