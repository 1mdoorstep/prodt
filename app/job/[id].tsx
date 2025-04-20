import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Briefcase,
  Building,
  MessageSquare,
  Phone,
  Share2,
  Heart,
  HeartOff,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useJobStore } from '@/store/job-store';
import { useAuthStore } from '@/store/auth-store';
import { LinearGradient } from 'expo-linear-gradient';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getJobById } = useJobStore();
  const { user } = useAuthStore();
  
  const [job, setJob] = useState(getJobById(id as string));
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  
  useEffect(() => {
    if (!job) {
      // If job not found in store, try to fetch it
      setIsLoading(true);
      setTimeout(() => {
        const fetchedJob = getJobById(id as string);
        setJob(fetchedJob);
        setIsLoading(false);
      }, 1000);
    }
    
    // Check if user has saved or applied to this job
    // This would typically come from an API or local storage
    setIsSaved(false);
    setHasApplied(false);
  }, [id]);
  
  const handleBack = () => {
    router.back();
  };
  
  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    // In a real app, you would save this to the user's profile
  };
  
  const handleApplyJob = () => {
    if (hasApplied) {
      Alert.alert(
        "Already Applied",
        "You have already applied to this job.",
        [{ text: "OK" }]
      );
      return;
    }
    
    // In a real app, you would submit an application to the API
    setIsLoading(true);
    setTimeout(() => {
      setHasApplied(true);
      setIsLoading(false);
      Alert.alert(
        "Application Submitted",
        "Your application has been submitted successfully!",
        [{ text: "OK" }]
      );
    }, 1500);
  };
  
  const handleContactEmployer = () => {
    if (job) {
      router.push(`/chat/${job.userId}`);
    }
  };
  
  const handleCallEmployer = () => {
    Alert.alert(
      "Call Employer",
      "This would initiate a call to the employer.",
      [{ text: "OK" }]
    );
  };
  
  const handleShareJob = () => {
    Alert.alert(
      "Share Job",
      "This would open the share dialog.",
      [{ text: "OK" }]
    );
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading job details...</Text>
      </SafeAreaView>
    );
  }
  
  if (!job) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <AlertCircle size={48} color={colors.error} />
        <Text style={styles.errorTitle}>Job Not Found</Text>
        <Text style={styles.errorText}>The job you're looking for doesn't exist or has been removed.</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.primary, colors.background]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButtonContainer}
              onPress={handleBack}
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.jobTitleContainer}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              {job.companyName && (
                <View style={styles.companyContainer}>
                  <Building size={16} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.companyName}>{job.companyName}</Text>
                </View>
              )}
            </View>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveJob}
            >
              {isSaved ? (
                <Heart size={24} color="#FFFFFF" fill="#FFFFFF" />
              ) : (
                <HeartOff size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
        
        <View style={styles.content}>
          <View style={styles.jobDetailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <MapPin size={20} color={colors.primary} />
                <Text style={styles.detailText}>{job.location.address}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Calendar size={20} color={colors.primary} />
                <Text style={styles.detailText}>{formatDate(job.postedAt)}</Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Clock size={20} color={colors.primary} />
                <Text style={styles.detailText}>{job.duration || 'Not specified'}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <DollarSign size={20} color={colors.primary} />
                <Text style={styles.detailText}>₹{job.fare?.toLocaleString() || 'Negotiable'}</Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Briefcase size={20} color={colors.primary} />
                <Text style={styles.detailText}>{job.jobType}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <User size={20} color={colors.primary} />
                <Text style={styles.detailText}>
                  {job.applicationsCount || 0} {job.applicationsCount === 1 ? 'Applicant' : 'Applicants'}
                </Text>
              </View>
            </View>
            
            {job.isSurging && (
              <View style={styles.surgingBadge}>
                <Text style={styles.surgingText}>High Demand</Text>
              </View>
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{job.description}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            <View style={styles.requirementItem}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={styles.requirementText}>
                Vehicle Required: {job.vehicleRequired}
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={styles.requirementText}>
                Category: {job.category}
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={styles.requirementText}>
                Valid ID and verification required
              </Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Status</Text>
            <View style={[
              styles.statusBadge,
              job.status === 'open' ? styles.statusOpen :
              job.status === 'assigned' ? styles.statusAssigned :
              job.status === 'completed' ? styles.statusCompleted :
              styles.statusCancelled
            ]}>
              <Text style={styles.statusText}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Text>
            </View>
            <Text style={styles.expiryText}>
              Expires on {formatDate(job.expiresAt)}
            </Text>
          </View>
          
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShareJob}
            >
              <Share2 size={20} color={colors.text} />
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleContactEmployer}
            >
              <MessageSquare size={20} color="#FFFFFF" />
              <Text style={styles.contactButtonText}>Message</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.callButton}
              onPress={handleCallEmployer}
            >
              <Phone size={20} color="#FFFFFF" />
              <Text style={styles.callButtonText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.bottomBar}>
        {job.status === 'open' && (
          <TouchableOpacity
            style={[
              styles.applyButton,
              hasApplied && styles.appliedButton,
              isLoading && styles.loadingButton
            ]}
            onPress={handleApplyJob}
            disabled={isLoading || hasApplied}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                {hasApplied ? (
                  <CheckCircle size={20} color="#FFFFFF" />
                ) : null}
                <Text style={styles.applyButtonText}>
                  {hasApplied ? 'Applied' : 'Apply Now'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
        
        {job.status === 'assigned' && (
          <View style={styles.assignedContainer}>
            <Text style={styles.assignedText}>
              This job has been assigned to a worker
            </Text>
          </View>
        )}
        
        {job.status === 'completed' && (
          <View style={styles.completedContainer}>
            <Text style={styles.completedText}>
              This job has been completed
            </Text>
          </View>
        )}
        
        {job.status === 'cancelled' && (
          <View style={styles.cancelledContainer}>
            <Text style={styles.cancelledText}>
              This job has been cancelled
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobTitleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  jobDetailsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  surgingBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  surgingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusOpen: {
    backgroundColor: colors.primary,
  },
  statusAssigned: {
    backgroundColor: colors.warning,
  },
  statusCompleted: {
    backgroundColor: colors.success,
  },
  statusCancelled: {
    backgroundColor: colors.error,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  expiryText: {
    fontSize: 14,
    color: colors.textLight,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.highlight,
    flex: 1,
    marginRight: 8,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
    flex: 1,
    marginRight: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.success,
    flex: 1,
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  bottomBar: {
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  appliedButton: {
    backgroundColor: colors.success,
  },
  loadingButton: {
    opacity: 0.8,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  assignedContainer: {
    padding: 16,
    backgroundColor: colors.highlight,
    borderRadius: 12,
    alignItems: 'center',
  },
  assignedText: {
    fontSize: 14,
    color: colors.text,
  },
  completedContainer: {
    padding: 16,
    backgroundColor: 'rgba(75, 181, 67, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
  },
  completedText: {
    fontSize: 14,
    color: colors.success,
  },
  cancelledContainer: {
    padding: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelledText: {
    fontSize: 14,
    color: colors.error,
  },
});