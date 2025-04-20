import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ViewStyle,
  Platform
} from 'react-native';
import { colors } from '@/constants/colors';
import { Briefcase, Car } from 'lucide-react-native';

interface ModeSwitchProps {
  currentMode: 'hire' | 'work';
  onModeChange: (mode: 'hire' | 'work') => void;
  style?: ViewStyle;
  compact?: boolean;
  tabStyle?: boolean;
}

export const ModeSwitch: React.FC<ModeSwitchProps> = ({
  currentMode,
  onModeChange,
  style,
  compact = false,
  tabStyle = false
}) => {
  const translateX = React.useRef(new Animated.Value(currentMode === 'hire' ? 0 : 1)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: currentMode === 'hire' ? 0 : 1,
      duration: 200,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [currentMode, translateX]);

  const handleModeChange = (mode: 'hire' | 'work') => {
    if (mode !== currentMode) {
      onModeChange(mode);
    }
  };

  const indicatorPosition = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '50%'],
  });

  if (tabStyle) {
    return (
      <View style={[styles.tabContainer, style]}>
        <TouchableOpacity
          style={[
            styles.tabOption,
            currentMode === 'hire' && styles.activeTabOption
          ]}
          onPress={() => handleModeChange('hire')}
          activeOpacity={0.7}
        >
          <Car
            size={20}
            color={currentMode === 'hire' ? colors.primary : colors.textLight}
          />
          <Text
            style={[
              styles.tabOptionText,
              currentMode === 'hire' && styles.activeTabOptionText
            ]}
          >
            Find Professionals
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabOption,
            currentMode === 'work' && styles.activeTabOption
          ]}
          onPress={() => handleModeChange('work')}
          activeOpacity={0.7}
        >
          <Briefcase
            size={20}
            color={currentMode === 'work' ? colors.primary : colors.textLight}
          />
          <Text
            style={[
              styles.tabOptionText,
              currentMode === 'work' && styles.activeTabOptionText
            ]}
          >
            Find Jobs
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[
      styles.container, 
      compact ? styles.compactContainer : null,
      style
    ]}>
      <Animated.View
        style={[
          styles.indicator,
          compact ? styles.compactIndicator : null,
          Platform.OS !== 'web' ? {
            transform: [
              {
                translateX: translateX.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, compact ? 80 : 100],
                }),
              },
            ],
          } : { left: indicatorPosition },
        ]}
      />
      
      <TouchableOpacity
        style={[
          styles.option,
          compact ? styles.compactOption : null,
          currentMode === 'hire' && styles.activeOption
        ]}
        onPress={() => handleModeChange('hire')}
        activeOpacity={0.7}
      >
        <Car
          size={compact ? 16 : 18}
          color={currentMode === 'hire' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'}
        />
        <Text
          style={[
            styles.optionText,
            compact ? styles.compactText : null,
            currentMode === 'hire' && styles.activeOptionText
          ]}
        >
          Hire Mode
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.option,
          compact ? styles.compactOption : null,
          currentMode === 'work' && styles.activeOption
        ]}
        onPress={() => handleModeChange('work')}
        activeOpacity={0.7}
      >
        <Briefcase
          size={compact ? 16 : 18}
          color={currentMode === 'work' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'}
        />
        <Text
          style={[
            styles.optionText,
            compact ? styles.compactText : null,
            currentMode === 'work' && styles.activeOptionText
          ]}
        >
          Work Mode
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    height: 50,
    position: 'relative',
    overflow: 'hidden',
  },
  compactContainer: {
    height: 40,
  },
  indicator: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 30,
  },
  compactIndicator: {
    width: '50%',
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    gap: 8,
  },
  compactOption: {
    gap: 4,
  },
  activeOption: {
    // Active styling is handled by the indicator
  },
  optionText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  compactText: {
    fontSize: 12,
  },
  activeOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Tab style
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 0,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabOption: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabOption: {
    borderBottomColor: colors.primary,
  },
  tabOptionText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  activeTabOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
});