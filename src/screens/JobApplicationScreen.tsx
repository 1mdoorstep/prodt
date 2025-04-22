import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useJobStore } from '@/store/job-store';
import { useLocationStore } from '@/store/location-store';
import { Button, Input, TextArea, Select } from '@/components';
import { useThemeColors } from '@/utils';
import { Job, VehicleType } from '@/types';
import { VEHICLE_TYPES } from '@/constants';

type RouteParams = {
  job: Job;
};

export const JobApplicationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { job } = route.params as RouteParams;
  const colors = useThemeColors();
  const { applyForJob } = useJobStore();
  const { currentLocation } = useLocationStore();
  
  const [formData, setFormData] = useState({
    message: '',
    vehicleType: '' as VehicleType,
    estimatedTime: '',
    fare: job.fare.toString(),
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!formData.message || !formData.estimatedTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    if (!currentLocation) {
      Alert.alert('Error', 'Please enable location services');
      return;
    }
    
    setIsLoading(true);
    try {
      await applyForJob(job.id, {
        message: formData.message,
        vehicleType: formData.vehicleType,
        estimatedTime: formData.estimatedTime,
        fare: parseInt(formData.fare),
        location: currentLocation,
      });
      
      Alert.alert('Success', 'Application submitted successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.form}>
        <TextArea
          label="Message to Employer"
          value={formData.message}
          onChangeText={(text: string) => setFormData({ ...formData, message: text })}
          placeholder="Write a message to the employer about why you're a good fit for this job"
          required
        />
        
        {job.vehicleRequired && (
          <Select
            label="Vehicle Type"
            value={formData.vehicleType}
            onValueChange={(value: string) => setFormData({ ...formData, vehicleType: value as VehicleType })}
            items={Object.entries(VEHICLE_TYPES).map(([value, label]) => ({
              label,
              value,
            }))}
            required
          />
        )}
        
        <Input
          label="Estimated Time"
          value={formData.estimatedTime}
          onChangeText={(text: string) => setFormData({ ...formData, estimatedTime: text })}
          placeholder="e.g., 2 hours, 1 day, etc."
          required
        />
        
        <Input
          label="Your Fare (₹)"
          value={formData.fare}
          onChangeText={(text: string) => setFormData({ ...formData, fare: text })}
          placeholder="Enter your proposed fare"
          keyboardType="numeric"
          required
        />
        
        <Button
          title="Submit Application"
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