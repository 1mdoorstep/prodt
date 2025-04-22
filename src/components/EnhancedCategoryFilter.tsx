import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Platform 
} from 'react-native';
import { X, Check, Filter } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { WorkerCategory } from '@/types/worker';

interface EnhancedCategoryFilterProps {
  categories: WorkerCategory[];
  selectedCategories: WorkerCategory[];
  onToggleCategory: (category: WorkerCategory) => void;
  onClearAll: () => void;
}

export const EnhancedCategoryFilter: React.FC<EnhancedCategoryFilterProps> = ({
  categories,
  selectedCategories,
  onToggleCategory,
  onClearAll
}) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  
  const toggleShowAll = () => {
    const newValue = !showAllCategories;
    setShowAllCategories(newValue);
    
    Animated.timing(animatedHeight, {
      toValue: newValue ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  
  const displayedCategories = showAllCategories 
    ? categories 
    : categories.slice(0, 8);
  
  const maxHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [120, 240],
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {selectedCategories.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={onClearAll}
          >
            <X size={16} color={colors.textLight} />
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Animated.View style={[styles.categoriesContainer, { maxHeight }]}>
        <ScrollView 
          horizontal={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          <View style={styles.categoriesGrid}>
            {displayedCategories.map((category) => {
              const isSelected = selectedCategories.includes(category);
              
              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryItem,
                    isSelected && styles.selectedCategoryItem
                  ]}
                  onPress={() => onToggleCategory(category)}
                  activeOpacity={0.7}
                >
                  {isSelected && (
                    <View style={styles.checkIconContainer}>
                      <Check size={12} color="#FFFFFF" />
                    </View>
                  )}
                  <Text style={[
                    styles.categoryText,
                    isSelected && styles.selectedCategoryText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </Animated.View>
      
      {categories.length > 8 && (
        <TouchableOpacity 
          style={styles.showMoreButton}
          onPress={toggleShowAll}
        >
          <Text style={styles.showMoreText}>
            {showAllCategories ? 'Show Less' : 'Show More'}
          </Text>
          <Filter size={14} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: colors.highlight,
  },
  clearText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  categoriesContainer: {
    overflow: 'hidden',
  },
  categoriesContent: {
    paddingBottom: 8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  selectedCategoryItem: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkIconContainer: {
    marginRight: 4,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedCategoryText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  showMoreText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginRight: 4,
  },
});