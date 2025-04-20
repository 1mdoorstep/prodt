import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  Animated,
  ActivityIndicator
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Filter,
  Plus,
  MapPin,
  Calendar,
  Briefcase,
  X,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Clock
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useJobStore } from '@/store/job-store';
import { JobCard } from '@/components/JobCard';
import { EmptyState } from '@/components/EmptyState';
import { JobCategory, JobType } from '@/types/job';
import { LinearGradient } from 'expo-linear-gradient';
import { EnhancedCategoryFilter } from '@/components/EnhancedCategoryFilter';

export default function JobsScreen() {
  const router = useRouter();
  const { jobs, isLoading, fetchJobs } = useJobStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<JobCategory[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<JobType[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'budget' | 'expiry'>('recent');
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const filterPanelAnim = useRef(new Animated.Value(0)).current;
  
  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);
  
  // Animate filter panel
  useEffect(() => {
    Animated.timing(filterPanelAnim, {
      toValue: showFilters ? 1 : 0,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [showFilters]);
  
  // Filter and sort jobs
  const filteredJobs = jobs.filter(job => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.companyName && job.companyName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Category filter
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(job.category);
    
    // Job type filter
    const matchesJobType = selectedJobTypes.length === 0 || 
      selectedJobTypes.includes(job.jobType);
    
    return matchesSearch && matchesCategory && matchesJobType;
  }).sort((a, b) => {
    if (sortBy === 'recent') {
      const dateA = a.postedAt ? new Date(a.postedAt).getTime() : new Date(a.createdAt).getTime();
      const dateB = b.postedAt ? new Date(b.postedAt).getTime() : new Date(b.createdAt).getTime();
      return dateB - dateA;
    } else if (sortBy === 'budget') {
      return (b.fare || 0) - (a.fare || 0);
    } else {
      return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
    }
  });
  
  // Handle job card press
  const handleJobPress = (jobId: string) => {
    router.push(`/job/${jobId}`);
  };
  
  // Handle post job button press
  const handlePostJob = () => {
    router.push('/post-job');
  };
  
  // Toggle category selection
  const toggleCategory = (category: JobCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // Toggle job type selection
  const toggleJobType = (type: JobType) => {
    if (selectedJobTypes.includes(type)) {
      setSelectedJobTypes(selectedJobTypes.filter(t => t !== type));
    } else {
      setSelectedJobTypes([...selectedJobTypes, type]);
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedJobTypes([]);
    setSortBy('recent');
  };
  
  // Apply filters and close filter panel
  const applyFilters = () => {
    setShowFilters(false);
  };
  
  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };
  
  // Render filter panel
  const renderFilterPanel = () => {
    const translateX = filterPanelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });
    
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
    ];
    
    return (
      <Animated.View 
        style={[
          styles.filterPanel,
          { transform: [{ translateX }] }
        ]}
      >
        <LinearGradient
          colors={[colors.card, colors.background]}
          style={styles.filterPanelGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filters</Text>
            <TouchableOpacity 
              onPress={() => setShowFilters(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10}}
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={[]}
            renderItem={null}
            ListHeaderComponent={() => (
              <>
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Sort By</Text>
                  <View style={styles.sortOptions}>
                    <TouchableOpacity
                      style={[
                        styles.sortOption,
                        sortBy === 'recent' && styles.selectedSortOption
                      ]}
                      onPress={() => setSortBy('recent')}
                    >
                      <Calendar size={16} color={sortBy === 'recent' ? colors.card : colors.text} />
                      <Text style={[
                        styles.sortOptionText,
                        sortBy === 'recent' && styles.selectedSortOptionText
                      ]}>
                        Most Recent
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.sortOption,
                        sortBy === 'budget' && styles.selectedSortOption
                      ]}
                      onPress={() => setSortBy('budget')}
                    >
                      <DollarSign size={16} color={sortBy === 'budget' ? colors.card : colors.text} />
                      <Text style={[
                        styles.sortOptionText,
                        sortBy === 'budget' && styles.selectedSortOptionText
                      ]}>
                        Highest Budget
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.sortOption,
                        sortBy === 'expiry' && styles.selectedSortOption
                      ]}
                      onPress={() => setSortBy('expiry')}
                    >
                      <Clock size={16} color={sortBy === 'expiry' ? colors.card : colors.text} />
                      <Text style={[
                        styles.sortOptionText,
                        sortBy === 'expiry' && styles.selectedSortOptionText
                      ]}>
                        Expiring Soon
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Job Type</Text>
                  <View style={styles.filterOptions}>
                    {jobTypes.map(type => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.filterOption,
                          selectedJobTypes.includes(type) && styles.selectedFilterOption
                        ]}
                        onPress={() => toggleJobType(type)}
                      >
                        <Text style={[
                          styles.filterOptionText,
                          selectedJobTypes.includes(type) && styles.selectedFilterOptionText
                        ]}>
                          {type}
                        </Text>
                        {selectedJobTypes.includes(type) && (
                          <CheckCircle size={16} color={colors.card} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Categories</Text>
                  <EnhancedCategoryFilter
                    categories={jobCategories as WorkerCategory[]}
                    selectedCategories={selectedCategories as WorkerCategory[]}
                    onToggleCategory={(category) => toggleCategory(category as JobCategory)}
                    compact={true}
                    showExpanded={true}
                  />
                </View>
              </>
            )}
            ListFooterComponent={() => (
              <View style={styles.filterActions}>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={resetFilters}
                >
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={applyFilters}
                >
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            )}
            style={styles.filterContent}
            showsVerticalScrollIndicator={false}
          />
        </LinearGradient>
      </Animated.View>
    );
  };
  
  // Render empty state
  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      );
    }
    
    if (searchQuery || selectedCategories.length > 0 || selectedJobTypes.length > 0) {
      return (
        <EmptyState
          title="No matching jobs found"
          message="Try adjusting your filters or search for something else"
          icon="search"
        />
      );
    }
    
    return (
      <EmptyState
        title="No jobs available"
        message="There are no jobs posted yet. Be the first to post a job!"
        icon="briefcase"
      />
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Briefcase size={24} color={colors.primary} />
          <Text style={styles.headerTitle}>Find Jobs</Text>
        </View>
        <TouchableOpacity
          style={styles.postJobButton}
          onPress={handlePostJob}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.postJobButtonText}>Post Job</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs by title or description"
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color={colors.textLight} />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            showFilters && styles.filterButtonActive
          ]}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={20} color={showFilters ? '#FFFFFF' : colors.text} />
        </TouchableOpacity>
      </View>
      
      {selectedCategories.length > 0 && (
        <EnhancedCategoryFilter
          categories={[]}
          selectedCategories={selectedCategories as WorkerCategory[]}
          onToggleCategory={(category) => toggleCategory(category as JobCategory)}
          onClearAll={resetFilters}
        />
      )}
      
      <View style={styles.resultsHeader}>
        <View style={styles.resultsCountContainer}>
          <Text style={styles.resultsCount}>{filteredJobs.length}</Text>
          <Text style={styles.resultsText}>jobs found</Text>
        </View>
        
        <View style={styles.sortByContainer}>
          <TouchableOpacity 
            style={styles.sortByButton}
            onPress={() => setShowFilters(true)}
          >
            <Text style={styles.sortByText}>
              Sort: {sortBy === 'recent' ? 'Recent' : sortBy === 'budget' ? 'Budget' : 'Expiry'}
            </Text>
            <ChevronDown size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => handleJobPress(item.id)}
          />
        )}
        contentContainerStyle={styles.jobsContainer}
        ListEmptyComponent={renderEmptyState}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
      
      {renderFilterPanel()}
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  postJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  postJobButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  filterButton: {
    marginLeft: 12,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultsCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultsCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 4,
  },
  resultsText: {
    fontSize: 16,
    color: colors.text,
  },
  sortByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortByButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sortByText: {
    fontSize: 12,
    color: colors.primary,
    marginRight: 4,
  },
  jobsContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 16,
  },
  filterPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: colors.card,
    zIndex: 100,
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '-2px 0px 8px rgba(0, 0, 0, 0.2)',
      }
    }),
  },
  filterPanelGradient: {
    flex: 1,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  filterContent: {
    flex: 1,
  },
  filterSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  sortOptions: {
    gap: 8,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.highlight,
    marginBottom: 8,
  },
  selectedSortOption: {
    backgroundColor: colors.primary,
  },
  sortOptionText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  selectedSortOptionText: {
    color: colors.card,
    fontWeight: '500',
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.highlight,
    marginBottom: 8,
    marginRight: 8,
  },
  selectedFilterOption: {
    backgroundColor: colors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: colors.text,
    marginRight: 8,
  },
  selectedFilterOptionText: {
    color: colors.card,
    fontWeight: '500',
  },
  filterActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginRight: 8,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  applyButton: {
    flex: 2,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },
});