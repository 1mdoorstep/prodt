import React, { useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  Platform,
  Text
} from 'react-native';
import { colors } from '@/constants/colors';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  cellCount?: number;
  autoFocus?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  cellCount = 4,
  autoFocus = false,
}) => {
  const inputRef = useRef<TextInput>(null);
  
  // Focus input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);
  
  const handleChange = (text: string) => {
    // Only allow digits
    const cleaned = text.replace(/[^0-9]/g, '');
    
    // Limit to cellCount
    const limited = cleaned.slice(0, cellCount);
    
    onChange(limited);
  };
  
  const renderCells = () => {
    const cells = [];
    const valueArray = value.split('');
    
    for (let i = 0; i < cellCount; i++) {
      cells.push(
        <View key={i} style={styles.cell}>
          <Text style={styles.cellText}>
            {valueArray[i] || ''}
          </Text>
        </View>
      );
    }
    
    return cells;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.cellsContainer}>
        {renderCells()}
      </View>
      
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        style={styles.hiddenInput}
        keyboardType="number-pad"
        maxLength={cellCount}
        caretHidden
        autoComplete="sms-otp" // For Android
        textContentType="oneTimeCode" // For iOS
        autoFocus={autoFocus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  cellsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    backgroundColor: colors.card,
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
  cellText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});