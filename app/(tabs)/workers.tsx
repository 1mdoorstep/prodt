import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Animated,
  Platform,
  RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  CheckCircle,
  Star,
  Users,
  MapPin
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useWorkerStore } from '@/store/worker-store';
import { WorkerCard } from '@/components/WorkerCard';
import { EnhancedCategoryFilter } from '@/components/EnhancedCategoryFilter';
import { DistanceSlider } from '@/components/DistanceSlider';
import { WorkerCategory, VehicleCategory } from '@/types/worker';
import { EmptyState } from '@/components/EmptyState';
import { LinearGradient } from 'expo-linear-gradient';

export default function WorkersScreen() {
  const router = useRouter();
  const { workers, getWorkersByCategory } = useWorkerStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<WorkerCategory[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState(workers);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [maxDistance, setMaxDistance] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showVehicleFilter, setShowVehicleFilter] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleCategory | null>(null);
  const [showRatingFilter, setShowRatingFilter] = useState(false);
  const [minRating, setMinRating] = useState(0);
  
  const filterHeight = useRef(new Animated.Value(0)).current;
  
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
  
  const vehicleTypes: VehicleCategory[] = ['Car', 'Truck', 'Bus', 'Van', 'Bike', 'Scooter'];
  
  const ratingOptions = [1, 2, 3, 4, 5];
  
  useEffect(() => {
    filterWorkers();
  }, [searchQuery, selectedCategories, maxDistance, selectedVehicle, minRating]);
  
  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
    
    Animated.timing(filterHeight, {
      toValue: isFilterVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  
  const toggleCategorySelection = (category: WorkerCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  const clearFilters = () => {
    setSelectedCategories([]);
    setMaxDistance(10);
    setSelectedVehicle(null);
    setMinRating(0);
  };
  
  const filterWorkers = () => {
    let filtered = workers;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(worker => 
        worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.categories.some(category => 
          category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    
    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(worker => 
        worker.categories.some(category => 
          selectedCategories.includes(category)
        )
      );
    }
    
    // Filter by distance
    filtered = filtered.filter(worker => 
      worker.radius ? worker.radius <= maxDistance : true
    );
    
    // Filter by vehicle type
    if (selectedVehicle) {
      filtered = filtered.filter(worker => 
        worker.vehicleType === selectedVehicle
      );
    }
    
    // Filter by rating
    if (minRating > 0) {
      filtered = filtered.filter(worker => 
        worker.rating.overall >= minRating
      );
    }
    
    setFilteredWorkers(filtered);
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      filterWorkers();
      setIsRefreshing(false);
    }, 1500);
  };
  
  const handleWorkerPress = (workerId: string) => {
    router.push(`/worker/${workerId}`);
  };
  
  const renderFilterSection = () => {
    const filterMaxHeight = filterHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 500], // Adjust this value based on your filter section height
    });
    
    return (
      <Animated.View style={[styles.filterContainer, { maxHeight: filterMaxHeight }]}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filters</Text>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Categories</Text>
          <EnhancedCategoryFilter
            categories={categories}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategorySelection}
            compact={true}
          />
        </View>
        
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Distance</Text>
          <DistanceSlider
            value={maxDistance}
            onValueChange={setMaxDistance}
            minimumValue={1}
            maximumValue={50}
            step={1}
          />
        </View>
        
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Vehicle Type</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => {
              setShowVehicleFilter(!showVehicleFilter);
              setShowRatingFilter(false);
            }}
          >
            <Text style={styles.dropdownText}>
              {selectedVehicle || 'Any Vehicle'}
            </Text>
            <ChevronDown size={20} color={colors.text} />
          </TouchableOpacity>
          
          {showVehicleFilter && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedVehicle(null);
                  setShowVehicleFilter(false);
                }}
              >
                <Text style={styles.dropdownItemText}>Any Vehicle</Text>
                {!selectedVehicle && (
                  <CheckCircle size={16} color={colors.primary} />
                )}
              </TouchableOpacity>
              
              {vehicleTypes.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedVehicle(vehicle);
                    setShowVehicleFilter(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{vehicle}</Text>
                  {selectedVehicle === vehicle && (
                    <CheckCircle size={16} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Minimum Rating</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => {
              setShowRatingFilter(!showRatingFilter);
              setShowVehicleFilter(false);
            }}
          >
            <Text style={styles.dropdownText}>
              {minRating > 0 ? `${minRating} Stars` : 'Any Rating'}
            </Text>
            <ChevronDown size={20} color={colors.text} />
          </TouchableOpacity>
          
          {showRatingFilter && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setMinRating(0);
                  setShowRatingFilter(false);
                }}
              >
                <Text style={styles.dropdownItemText}>Any Rating</Text>
                {minRating === 0 && (
                  <CheckCircle size={16} color={colors.primary} />
                )}
              </TouchableOpacity>
              
              {ratingOptions.map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setMinRating(rating);
                    setShowRatingFilter(false);
                  }}
                >
                  <View style={styles.ratingRow}>
                    <Text style={styles.dropdownItemText}>{rating}</Text>
                    <View style={styles.starsContainer}>
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} size={16} color={colors.warning} fill={colors.warning} />
                      ))}
                    </View>
                  </View>
                  {minRating === rating && (
                    <CheckCircle size={16} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </Animated.View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[colors.card, colors.background]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.titleContainer}>
          <Users size={24} color={colors.primary} />
          <Text style={styles.title}>Find Workers</Text>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={colors.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search workers by name or skill"
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
              isFilterVisible && styles.filterButtonActive
            ]}
            onPress={toggleFilterVisibility}
          >
            <Filter size={20} color={isFilterVisible ? '#FFFFFF' : colors.text} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      {renderFilterSection()}
      
      {selectedCategories.length > 0 && (
        <EnhancedCategoryFilter
          categories={[]}
          selectedCategories={selectedCategories}
          onToggleCategory={toggleCategorySelection}
          onClearAll={clearFilters}
        />
      )}
      
      <View style={styles.resultsHeader}>
        <View style={styles.resultsCountContainer}>
          <Text style={styles.resultsCount}>{filteredWorkers.length}</Text>
          <Text style={styles.resultsText}>workers found</Text>
        </View>
        
        <View style={styles.locationFilterContainer}>
          <MapPin size={16} color={colors.primary} />
          <Text style={styles.locationFilterText}>Within {maxDistance} km</Text>
        </View>
      </View>
      
      <FlatList
        data={filteredWorkers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WorkerCard worker={item} onPress={() => handleWorkerPress(item.id)} />
        )}
        contentContainerStyle={styles.workersList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="briefcase"
            title="No workers found"
            message="Try adjusting your filters or search query"
            actionLabel="Clear Filters"
            onAction={clearFilters}
          />
        }
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
    paddingVertical: 8,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterContainer: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    overflow: 'hidden',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  clearText: {
    fontSize: 14,
    color: colors.primary,
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
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
  locationFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationFilterText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
  },
  workersList: {
    padding: 16,
    paddingBottom: 80,
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
});