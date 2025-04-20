import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Briefcase,
  Building,
  ChevronDown,
  CheckCircle,
  ArrowLeft
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useJobStore } from '@/store/job-store';
import { useAuthStore } from '@/store/auth-store';
import { JobType, JobCategory } from '@/types/job';
import { VehicleCategory } from '@/types/worker';
import { LinearGradient } from 'expo-linear-gradient';

// Custom DatePicker component to replace @react-native-community/datetimepicker
const CustomDatePicker = ({ 
  value, 
  onChange, 
  visible, 
  onClose 
}: { 
  value: Date, 
  onChange: (date: Date) => void, 
  visible: boolean, 
  onClose: () => void 
}) => {
  const [selectedDate, setSelectedDate] = useState(value);
  
  // Generate next 30 days for selection
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };
  
  const dates = generateDates();
  
  const handleSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleConfirm = () => {
    onChange(selectedDate);
    onClose();
  };
  
  if (!visible) return null;
  
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        style={styles.modalOverlay} 
        onPress={onClose}
      >
        <Pressable style={styles.datePickerContainer} onPress={e => e.stopPropagation()}>
          <View style={styles.datePickerHeader}>
            <Text style={styles.datePickerTitle}>Select Expiry Date</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.dateList}>
            {dates.map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateItem,
                  isSameDay(selectedDate, date) && styles.selectedDateItem
                ]}
                onPress={() => handleSelect(date)}
              >
                <Text 
                  style={[
                    styles.dateText,
                    isSameDay(selectedDate, date) && styles.selectedDateText
                  ]}
                >
                  {formatDate(date)}
                </Text>
                {isSameDay(selectedDate, date) && (
                  <CheckCircle size={20} color={colors.card} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.datePickerActions}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// Helper function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

// Helper function to format date
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function PostJobScreen() {
  const router = useRouter();
  const { createJob } = useJobStore();
  const { user } = useAuthStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jobType, setJobType] = useState<JobType>('Personal');
  const [category, setCategory] = useState<JobCategory>('Personal');
  const [vehicleRequired, setVehicleRequired] = useState<VehicleCategory>('Car');
  const [location, setLocation] = useState({
    address: 'Mumbai, Maharashtra',
    latitude: 19.0760,
    longitude: 72.8777,
  });
  const [fare, setFare] = useState('');
  const [duration, setDuration] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 7 days from now
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isCommercial, setIsCommercial] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Dropdown states
  const [showJobTypeDropdown, setShowJobTypeDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  
  const handleClose = () => {
    router.back();
  };
  
  const handleDateChange = (selectedDate: Date) => {
    setExpiryDate(selectedDate);
  };
  
  const validateStep1 = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a job title');
      return false;
    }
    
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a job description');
      return false;
    }
    
    return true;
  };
  
  const validateStep2 = () => {
    if (isCommercial && !companyName.trim()) {
      Alert.alert('Error', 'Please enter a company name');
      return false;
    }
    
    return true;
  };
  
  const validateStep3 = () => {
    if (!fare.trim()) {
      Alert.alert('Error', 'Please enter a job fare');
      return false;
    }
    
    if (isNaN(Number(fare))) {
      Alert.alert('Error', 'Fare must be a number');
      return false;
    }
    
    return true;
  };
  
  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = async () => {
    if (!validateStep3()) return;
    
    setIsLoading(true);
    
    try {
      const newJob = await createJob({
        userId: user?.id || 'guest',
        title,
        description,
        vehicleRequired,
        jobType,
        category,
        companyName: isCommercial ? companyName : undefined,
        location,
        fare: Number(fare),
        duration,
        expiresAt: expiryDate.toISOString(),
        status: 'open',
        postedAt: new Date().toISOString(), // Add postedAt field
        createdAt: new Date().toISOString(),
      });
      
      setIsLoading(false);
      
      Alert.alert(
        'Success',
        'Your job has been posted successfully!',
        [
          {
            text: 'View Job',
            onPress: () => router.push(`/job/${newJob.id}`),
          },
          {
            text: 'Go to Home',
            onPress: () => router.push('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to post job. Please try again.');
    }
  };
  
  const jobTypes: JobType[] = ['Personal', 'Commercial', 'Government'];
  
  const jobCategories: JobCategory[] = [
    'Delivery',
    'Electrician',
    'Plumbing',
    'Carpentry',
    'Painting',
    'Personal',
    'Commercial',
    'Logistics',
    'Security',
    'Food',
    'Construction',
    'IT',
    'Networking',
    'Gardening',
    'Healthcare',
    'Caregiving',
    'Rideshare',
    'Shopping',
  ];
  
  const vehicleTypes: VehicleCategory[] = ['Car', 'Truck', 'Bus', 'Van', 'Bike', 'Scooter'];
  
  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.stepLine}>
        <View style={[styles.stepLineInner, { width: `${(currentStep - 1) * 50}%` }]} />
      </View>
      <View style={styles.stepsContainer}>
        <View style={[styles.step, currentStep >= 1 && styles.activeStep]}>
          <Text style={[styles.stepText, currentStep >= 1 && styles.activeStepText]}>1</Text>
        </View>
        <View style={[styles.step, currentStep >= 2 && styles.activeStep]}>
          <Text style={[styles.stepText, currentStep >= 2 && styles.activeStepText]}>2</Text>
        </View>
        <View style={[styles.step, currentStep >= 3 && styles.activeStep]}>
          <Text style={[styles.stepText, currentStep >= 3 && styles.activeStepText]}>3</Text>
        </View>
      </View>
    </View>
  );
  
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Basic Information</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Job Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter job title"
          placeholderTextColor={colors.textLight}
          value={title}
          onChangeText={setTitle}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe the job in detail"
          placeholderTextColor={colors.textLight}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
      
      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleNextStep}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Job Details</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Job Type</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => {
            setShowJobTypeDropdown(!showJobTypeDropdown);
            setShowCategoryDropdown(false);
            setShowVehicleDropdown(false);
          }}
        >
          <Text style={styles.dropdownText}>{jobType}</Text>
          <ChevronDown size={20} color={colors.text} />
        </TouchableOpacity>
        
        {showJobTypeDropdown && (
          <View style={styles.dropdownMenu}>
            {jobTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.dropdownItem}
                onPress={() => {
                  setJobType(type);
                  setShowJobTypeDropdown(false);
                  setIsCommercial(type === 'Commercial');
                }}
              >
                <Text style={styles.dropdownItemText}>{type}</Text>
                {jobType === type && (
                  <CheckCircle size={16} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
      {isCommercial && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Company Name</Text>
          <View style={styles.inputWithIcon}>
            <Building size={20} color={colors.textLight} />
            <TextInput
              style={styles.inputWithIconText}
              placeholder="Enter company name"
              placeholderTextColor={colors.textLight}
              value={companyName}
              onChangeText={setCompanyName}
            />
          </View>
        </View>
      )}
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Category</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => {
            setShowCategoryDropdown(!showCategoryDropdown);
            setShowJobTypeDropdown(false);
            setShowVehicleDropdown(false);
          }}
        >
          <Text style={styles.dropdownText}>{category}</Text>
          <ChevronDown size={20} color={colors.text} />
        </TouchableOpacity>
        
        {showCategoryDropdown && (
          <View style={[styles.dropdownMenu, styles.categoryDropdown]}>
            {jobCategories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={styles.dropdownItem}
                onPress={() => {
                  setCategory(cat);
                  setShowCategoryDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{cat}</Text>
                {category === cat && (
                  <CheckCircle size={16} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Vehicle Required</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => {
            setShowVehicleDropdown(!showVehicleDropdown);
            setShowJobTypeDropdown(false);
            setShowCategoryDropdown(false);
          }}
        >
          <Text style={styles.dropdownText}>{vehicleRequired}</Text>
          <ChevronDown size={20} color={colors.text} />
        </TouchableOpacity>
        
        {showVehicleDropdown && (
          <View style={styles.dropdownMenu}>
            {vehicleTypes.map((vehicle) => (
              <TouchableOpacity
                key={vehicle}
                style={styles.dropdownItem}
                onPress={() => {
                  setVehicleRequired(vehicle);
                  setShowVehicleDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{vehicle}</Text>
                {vehicleRequired === vehicle && (
                  <CheckCircle size={16} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handlePrevStep}
        >
          <ArrowLeft size={20} color={colors.text} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextStep}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Location & Budget</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Location</Text>
        <View style={styles.inputWithIcon}>
          <MapPin size={20} color={colors.textLight} />
          <TextInput
            style={styles.inputWithIconText}
            placeholder="Enter job location"
            placeholderTextColor={colors.textLight}
            value={location.address}
            onChangeText={(text) => setLocation({ ...location, address: text })}
          />
        </View>
      </View>
      
      <View style={styles.formRow}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Budget (₹)</Text>
          <View style={styles.inputWithIcon}>
            <DollarSign size={20} color={colors.textLight} />
            <TextInput
              style={styles.inputWithIconText}
              placeholder="Enter amount"
              placeholderTextColor={colors.textLight}
              value={fare}
              onChangeText={setFare}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        <View style={[styles.formGroup, { flex: 1 }]}>
          <Text style={styles.label}>Duration</Text>
          <View style={styles.inputWithIcon}>
            <Clock size={20} color={colors.textLight} />
            <TextInput
              style={styles.inputWithIconText}
              placeholder="e.g. 2 days"
              placeholderTextColor={colors.textLight}
              value={duration}
              onChangeText={setDuration}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Expiry Date</Text>
        <TouchableOpacity
          style={styles.inputWithIcon}
          onPress={() => setShowDatePicker(true)}
        >
          <Calendar size={20} color={colors.textLight} />
          <Text style={styles.dateText}>{formatDate(expiryDate)}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handlePrevStep}
        >
          <ArrowLeft size={20} color={colors.text} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.disabledButton
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Post Job</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <LinearGradient
          colors={[colors.card, colors.background]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
          >
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post a Job</Text>
          <View style={styles.placeholder} />
        </LinearGradient>
        
        {renderStepIndicator()}
        
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </ScrollView>
      </KeyboardAvoidingView>
      
      <CustomDatePicker
        value={expiryDate}
        onChange={handleDateChange}
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  stepIndicator: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.card,
  },
  stepLine: {
    position: 'absolute',
    top: 32,
    left: 40,
    right: 40,
    height: 2,
    backgroundColor: colors.border,
    zIndex: 1,
  },
  stepLineInner: {
    height: 2,
    backgroundColor: colors.primary,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  activeStep: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  activeStepText: {
    color: colors.card,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  stepContainer: {
    padding: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 120,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputWithIconText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.text,
  },
  dropdownMenu: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginTop: 4,
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
  categoryDropdown: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemText: {
    fontSize: 16,
    color: colors.text,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.highlight,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    width: '90%',
    backgroundColor: colors.card,
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
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  dateList: {
    maxHeight: 300,
  },
  dateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedDateItem: {
    backgroundColor: colors.primary,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedDateText: {
    color: colors.card,
    fontWeight: '500',
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  confirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});