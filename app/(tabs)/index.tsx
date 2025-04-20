import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  RefreshControl,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Bell,
  Plus,
  Briefcase,
  ArrowRight,
  Zap,
  Award,
  TrendingUp
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useJobStore } from '@/store/job-store';
import { useWorkerStore } from '@/store/worker-store';
import { useAuthStore } from '@/store/auth-store';
import { JobCard } from '@/components/JobCard';
import { WorkerCard } from '@/components/WorkerCard';
import { EnhancedCategoryFilter } from '@/components/EnhancedCategoryFilter';
import { AdCard } from '@/components/AdCard';
import { WorkerCategory } from '@/types/worker';
import { ModeSwitch } from '@/components/ModeSwitch';
import { useDemoStore } from '@/store/demo-store';
import { RoleSelectionPopup } from '@/components/RoleSelectionPopup';

export default function HomeScreen() {
  const router = useRouter();
  const { jobs } = useJobStore();
  const { workers, getTopRatedWorkers } = useWorkerStore();
  const { 
    user, 
    userMode, 
    setUserMode, 
    hasSelectedRole, 
    setHasSelectedRole,
    showRoleSelectionPopup,
    setShowRoleSelectionPopup
  } = useAuthStore();
  const { isDemoMode, currentStep } = useDemoStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [topRatedWorkers, setTopRatedWorkers] = useState(getTopRatedWorkers(5));
  const [recentJobs, setRecentJobs] = useState(jobs.slice(0, 5));
  const [selectedCategory, setSelectedCategory] = useState<WorkerCategory | null>(null);
  
  const scrollY = new Animated.Value(0);
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });
  
  const categories: WorkerCategory[] = [
    'Electrician',
    'Plumbing',
    'Delivery',
    'Shopping',
    'Personal',
    'Commercial',
    'Logistics',
    'Security',
    'Food',
    'Construction',
    'Carpentry',
    'Painting',
    'IT',
    'Networking',
    'Gardening',
    'Healthcare',
    'Caregiving',
    'Rideshare'
  ];
  
  useEffect(() => {
    // Filter jobs by selected category
    if (selectedCategory) {
      const filtered = jobs.filter(job => job.category === selectedCategory);
      setRecentJobs(filtered.length > 0 ? filtered : jobs.slice(0, 5));
    } else {
      // Sort by posted date, most recent first
      const sorted = [...jobs].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      setRecentJobs(sorted.slice(0, 5));
    }
  }, [selectedCategory, jobs]);
  
  const onRefresh = async () => {
    setRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      setTopRatedWorkers(getTopRatedWorkers(5));
      
      // Sort by posted date, most recent first
      const sorted = [...jobs].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      setRecentJobs(sorted.slice(0, 5));
      
      setRefreshing(false);
    }, 1500);
  };
  
  const handleCategoryPress = (category: WorkerCategory) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };
  
  const handlePostJob = () => {
    router.push('/post-job');
  };
  
  const handleViewAllJobs = () => {
    router.push('/(tabs)/jobs');
  };
  
  const handleViewAllWorkers = () => {
    router.push('/(tabs)/workers');
  };
  
  const handleJobPress = (jobId: string) => {
    router.push(`/job/${jobId}`);
  };
  
  const handleWorkerPress = (workerId: string) => {
    router.push(`/worker/${workerId}`);
  };
  
  const renderJobItems = () => {
    return recentJobs.map(item => (
      <JobCard key={item.id} job={item} onPress={() => handleJobPress(item.id)} />
    ));
  };
  
  const renderWorkerItems = () => {
    return topRatedWorkers.map(item => (
      <WorkerCard key={item.id} worker={item} onPress={() => handleWorkerPress(item.id)} />
    ));
  };

  const handleModeChange = (mode: 'hire' | 'work') => {
    setUserMode(mode);
  };
  
  const handleRoleSelection = (role: 'hire' | 'work') => {
    setUserMode(role);
    setHasSelectedRole(true);
    setShowRoleSelectionPopup(false);
  };
  
  const handleCloseRolePopup = () => {
    // Default to 'hire' mode if user closes without selecting
    if (!hasSelectedRole) {
      setUserMode('hire');
      setHasSelectedRole(true);
    }
    setShowRoleSelectionPopup(false);
  };
  
  // Determine if a section should be highlighted in demo mode
  const isDemoHighlighted = (section: string) => {
    if (!isDemoMode) return false;
    
    switch (currentStep) {
      case 'categories':
        return section === 'categories';
      case 'workers':
        return section === 'workers';
      case 'jobs':
        return section === 'jobs';
      case 'post-job':
        return section === 'post-job';
      default:
        return false;
    }
  };
  
  // Convert selectedCategory to an array for EnhancedCategoryFilter
  const selectedCategories = selectedCategory ? [selectedCategory] : [];
  
  // Handler to toggle categories for EnhancedCategoryFilter
  const handleToggleCategory = (category: WorkerCategory) => {
    handleCategoryPress(category);
  };
  
  // Handler to clear all selected categories
  const handleClearAllCategories = () => {
    setSelectedCategory(null);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.header,
          { opacity: headerOpacity }
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.locationContainer}>
            <MapPin size={18} color={colors.primary} />
            <Text style={styles.locationText}>New York, NY</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
            <Bell size={24} color={colors.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
        
        <ModeSwitch 
          currentMode={userMode} 
          onModeChange={handleModeChange}
          style={styles.modeSwitch}
        />
      </Animated.View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Hello, <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
          </Text>
          <Text style={styles.welcomeSubtext}>
            {userMode === 'hire' 
              ? "Find skilled professionals for your tasks" 
              : "Discover jobs that match your skills"}
          </Text>
        </View>
        
        {/* Categories Section */}
        <View 
          style={[
            styles.sectionContainer,
            isDemoHighlighted('categories') && styles.highlightedSection
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>
          
          <EnhancedCategoryFilter
            categories={categories}
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            onClearAll={handleClearAllCategories}
          />
        </View>
        
        {/* Featured Ad */}
        <View style={styles.adContainer}>
          <AdCard
            title="Become a Verified Pro"
            description="Get more jobs and earn up to 30% more by becoming a verified professional."
            actionText="Learn More"
            onPress={() => console.log('Ad pressed')}
            backgroundColor={colors.primary}
            icon={<Award size={40} color="#FFFFFF" />}
          />
        </View>
        
        {/* Top Workers Section */}
        {userMode === 'hire' && (
          <View 
            style={[
              styles.sectionContainer,
              isDemoHighlighted('workers') && styles.highlightedSection
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Professionals</Text>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={handleViewAllWorkers}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <ArrowRight size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.workersList}>
              {renderWorkerItems()}
            </View>
          </View>
        )}
        
        {/* Recent Jobs Section */}
        <View 
          style={[
            styles.sectionContainer,
            isDemoHighlighted('jobs') && styles.highlightedSection
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {userMode === 'hire' ? 'Your Recent Jobs' : 'Jobs For You'}
            </Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={handleViewAllJobs}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <ArrowRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {recentJobs.length > 0 ? (
            <View style={styles.jobsList}>
              {renderJobItems()}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No jobs found</Text>
              <Text style={styles.emptyStateSubtext}>
                {userMode === 'hire' 
                  ? "You haven't posted any jobs yet" 
                  : "No jobs match your skills yet"}
              </Text>
            </View>
          )}
        </View>
        
        {/* Post Job Button (only in hire mode) */}
        {userMode === 'hire' && (
          <View 
            style={[
              styles.postJobContainer,
              isDemoHighlighted('post-job') && styles.highlightedSection
            ]}
          >
            <TouchableOpacity 
              style={styles.postJobButton}
              onPress={handlePostJob}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.postJobText}>Post a Job</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Trending Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Services</Text>
          </View>
          
          <View style={styles.trendingContainer}>
            <TouchableOpacity style={styles.trendingItem}>
              <View style={styles.trendingIconContainer}>
                <TrendingUp size={20} color={colors.primary} />
              </View>
              <Text style={styles.trendingText}>Home Cleaning</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.trendingItem}>
              <View style={styles.trendingIconContainer}>
                <TrendingUp size={20} color={colors.primary} />
              </View>
              <Text style={styles.trendingText}>Furniture Assembly</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.trendingItem}>
              <View style={styles.trendingIconContainer}>
                <TrendingUp size={20} color={colors.primary} />
              </View>
              <Text style={styles.trendingText}>Electrical Repairs</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {/* Role Selection Popup */}
      <RoleSelectionPopup
        visible={showRoleSelectionPopup}
        onClose={handleCloseRolePopup}
        onSelectRole={handleRoleSelection}
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
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
  },
  notificationButton: {
    position: 'relative',
    padding: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error,
    borderWidth: 1,
    borderColor: colors.card,
  },
  modeSwitch: {
    marginTop: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  welcomeSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userName: {
    color: colors.primary,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: colors.textLight,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  highlightedSection: {
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 4,
  },
  adContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  workersList: {
    paddingTop: 8,
    gap: 12,
  },
  jobsList: {
    paddingTop: 8,
    gap: 12,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    backgroundColor: colors.highlight,
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  postJobContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  postJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
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
  postJobText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  trendingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trendingIconContainer: {
    marginRight: 6,
  },
  trendingText: {
    fontSize: 14,
    color: colors.text,
  },
  bottomPadding: {
    height: 100,
  },
});