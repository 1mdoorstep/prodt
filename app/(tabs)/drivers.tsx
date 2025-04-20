import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Filter,
  MapPin,
  Star,
  ChevronDown,
  X,
  Check,
  Car,
  Truck,
  Bus,
  Briefcase,
  Zap,
  Wrench
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useDriverStore } from '@/store/driver-store';
import { DriverCard } from '@/components/DriverCard';
import { DistanceSlider } from '@/components/DistanceSlider';
import { Driver, VehicleCategory } from '@/types/driver';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width >= 768;

export default function DriversScreen() {
  const router = useRouter();
  const { drivers, isLoading } = useDriverStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [maxDistance, setMaxDistance] = useState(50);
  const [minRating, setMinRating] = useState(0);
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<VehicleCategory[]>([]);
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  
  // Filter drivers based on search query, category, and filters
  const filteredDrivers = drivers.filter(driver => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (driver.profession && driver.profession.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Category filter
    const matchesCategory = selectedCategory === 'All' || 
      (driver.profession && driver.profession === selectedCategory) ||
      (driver.vehicleCategories && driver.vehicleCategories.includes(selectedCategory as VehicleCategory));
    
    // Distance filter - Add null check for distance
    const matchesDistance = (driver.distance ?? 0) <= maxDistance;
    
    // Rating filter
    const matchesRating = driver.rating >= minRating;
    
    // Vehicle type filter
    const matchesVehicleType = selectedVehicleTypes.length === 0 || 
      (driver.vehicleCategories && driver.vehicleCategories.some(type => selectedVehicleTypes.includes(type)));
    
    // Profession filter
    const matchesProfession = selectedProfessions.length === 0 || 
      (driver.profession && selectedProfessions.includes(driver.profession));
    
    return matchesSearch && matchesCategory && matchesDistance && matchesRating && matchesVehicleType && matchesProfession;
  });
  
  // Handle driver card press
  const handleDriverPress = (driver: Driver) => {
    router.push(`/driver/${driver.id}`);
  };
  
  // Render category button
  const renderCategoryButton = (label: string, value: string) => {
    const isSelected = selectedCategory === value;
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          isSelected && styles.selectedCategoryButton
        ]}
        onPress={() => setSelectedCategory(value)}
      >
        <Text style={[
          styles.categoryButtonText,
          isSelected && styles.selectedCategoryButtonText
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };
  
  // Toggle vehicle type selection
  const toggleVehicleType = (type: VehicleCategory) => {
    if (selectedVehicleTypes.includes(type)) {
      setSelectedVehicleTypes(selectedVehicleTypes.filter(t => t !== type));
    } else {
      setSelectedVehicleTypes([...selectedVehicleTypes, type]);
    }
  };
  
  // Toggle profession selection
  const toggleProfession = (profession: string) => {
    if (selectedProfessions.includes(profession)) {
      setSelectedProfessions(selectedProfessions.filter(p => p !== profession));
    } else {
      setSelectedProfessions([...selectedProfessions, profession]);
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setMaxDistance(50);
    setMinRating(0);
    setSelectedVehicleTypes([]);
    setSelectedProfessions([]);
  };
  
  // Apply filters and close filter panel
  const applyFilters = () => {
    setShowFilters(false);
  };
  
  // Render filter panel
  const renderFilterPanel = () => {
    return (
      <View style={styles.filterPanel}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filters</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.filterContent}>
          <Text style={styles.filterSectionTitle}>Maximum Distance</Text>
          <DistanceSlider
            value={maxDistance}
            onValueChange={setMaxDistance}
            minimumValue={1}
            maximumValue={100}
            step={1}
          />
          
          <Text style={styles.filterSectionTitle}>Minimum Rating</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map(rating => (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.ratingButton,
                  minRating >= rating && styles.selectedRatingButton
                ]}
                onPress={() => setMinRating(rating)}
              >
                <Star 
                  size={20} 
                  color={minRating >= rating ? colors.card : colors.textLight} 
                  fill={minRating >= rating ? colors.warning : 'none'} 
                />
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.filterSectionTitle}>Vehicle Types</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedVehicleTypes.includes('Car') && styles.selectedOptionButton
              ]}
              onPress={() => toggleVehicleType('Car')}
            >
              <Car size={20} color={selectedVehicleTypes.includes('Car') ? colors.card : colors.text} />
              <Text style={[
                styles.optionText,
                selectedVehicleTypes.includes('Car') && styles.selectedOptionText
              ]}>
                Car
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedVehicleTypes.includes('Truck') && styles.selectedOptionButton
              ]}
              onPress={() => toggleVehicleType('Truck')}
            >
              <Truck size={20} color={selectedVehicleTypes.includes('Truck') ? colors.card : colors.text} />
              <Text style={[
                styles.optionText,
                selectedVehicleTypes.includes('Truck') && styles.selectedOptionText
              ]}>
                Truck
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedVehicleTypes.includes('Bus') && styles.selectedOptionButton
              ]}
              onPress={() => toggleVehicleType('Bus')}
            >
              <Bus size={20} color={selectedVehicleTypes.includes('Bus') ? colors.card : colors.text} />
              <Text style={[
                styles.optionText,
                selectedVehicleTypes.includes('Bus') && styles.selectedOptionText
              ]}>
                Bus
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedVehicleTypes.includes('Van') && styles.selectedOptionButton
              ]}
              onPress={() => toggleVehicleType('Van')}
            >
              <Car size={20} color={selectedVehicleTypes.includes('Van') ? colors.card : colors.text} />
              <Text style={[
                styles.optionText,
                selectedVehicleTypes.includes('Van') && styles.selectedOptionText
              ]}>
                Van
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.filterSectionTitle}>Professions</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedProfessions.includes('Driver') && styles.selectedOptionButton
              ]}
              onPress={() => toggleProfession('Driver')}
            >
              <Car size={20} color={selectedProfessions.includes('Driver') ? colors.card : colors.text} />
              <Text style={[
                styles.optionText,
                selectedProfessions.includes('Driver') && styles.selectedOptionText
              ]}>
                Driver
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedProfessions.includes('Electrician') && styles.selectedOptionButton
              ]}
              onPress={() => toggleProfession('Electrician')}
            >
              <Zap size={20} color={selectedProfessions.includes('Electrician') ? colors.card : colors.text} />
              <Text style={[
                styles.optionText,
                selectedProfessions.includes('Electrician') && styles.selectedOptionText
              ]}>
                Electrician
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedProfessions.includes('Plumber') && styles.selectedOptionButton
              ]}
              onPress={() => toggleProfession('Plumber')}
            >
              <Wrench size={20} color={selectedProfessions.includes('Plumber') ? colors.card : colors.text} />
              <Text style={[
                styles.optionText,
                selectedProfessions.includes('Plumber') && styles.selectedOptionText
              ]}>
                Plumber
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedProfessions.includes('Manager') && styles.selectedOptionButton
              ]}
              onPress={() => toggleProfession('Manager')}
            >
              <Briefcase size={20} color={selectedProfessions.includes('Manager') ? colors.card : colors.text} />
              <Text style={[
                styles.optionText,
                selectedProfessions.includes('Manager') && styles.selectedOptionText
              ]}>
                Manager
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
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
      </View>
    );
  };
  
  // Render empty state when no drivers match filters
  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No professionals found</Text>
        <Text style={styles.emptyText}>
          Try adjusting your filters or search for something else
        </Text>
        <TouchableOpacity
          style={styles.resetFiltersButton}
          onPress={() => {
            setSearchQuery('');
            setSelectedCategory('All');
            resetFilters();
          }}
        >
          <Text style={styles.resetFiltersText}>Reset All Filters</Text>
        </TouchableOpacity>
      </View>
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
        <Text style={styles.headerTitle}>Find Professionals</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or profession"
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
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {renderCategoryButton("All", "All")}
        {renderCategoryButton("Drivers", "Driver")}
        {renderCategoryButton("Plumbers", "Plumber")}
        {renderCategoryButton("Electricians", "Electrician")}
        {renderCategoryButton("Managers", "Manager")}
      </ScrollView>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View style={styles.driversListContainer}>
          <FlatList
            data={filteredDrivers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <DriverCard
                driver={item}
                onPress={() => handleDriverPress(item)}
              />
            )}
            contentContainerStyle={styles.driversContainer}
            ListEmptyComponent={renderEmptyState}
          />
        </View>
      )}
      
      {showFilters && renderFilterPanel()}
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
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
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
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
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectedCategoryButtonText: {
    color: colors.card,
  },
  driversListContainer: {
    flex: 1,
  },
  driversContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  resetFiltersButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  resetFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },
  filterPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: isTablet ? '50%' : '80%',
    backgroundColor: colors.card,
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
    padding: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  ratingButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.highlight,
  },
  selectedRatingButton: {
    backgroundColor: colors.warning,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.highlight,
    marginBottom: 8,
  },
  selectedOptionButton: {
    backgroundColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  selectedOptionText: {
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
    borderRadius: 8,
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
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },
});