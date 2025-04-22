import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  Platform,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, typography, borderRadius, spacing, shadows } from '@/constants/theme';

const AnimatedView = Animated.createAnimatedComponent(View);

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  cellCount?: number;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const OtpInput = React.memo(({
  value,
  onChange,
  cellCount = 4,
  autoFocus = false,
  style,
}: OtpInputProps) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [shake, setShake] = useState(false);

  // Create refs for each cell's animation
  const cellRefs = useRef<Animated.SharedValue<number>[]>([]);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const handleChange = (text: string) => {
    // Only allow numbers
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= cellCount) {
      onChange(cleaned);

      // Animate the cells that have values
      cellRefs.current.forEach((ref, index) => {
        if (index < cleaned.length) {
          ref.value = withSequence(
            withSpring(0.95),
            withSpring(1)
          );
        }
      });
    }

    // Shake animation if trying to enter more than cellCount digits
    if (text.length > cellCount) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleKeyPress = ({ nativeEvent: { key } }: any) => {
    if (key === 'Backspace' && value.length === 0) {
      // Optional: Handle backspace on empty input
    }
  };

  const renderCells = () => {
    const cells = [];
    const valueArray = value.split('');

    for (let i = 0; i < cellCount; i++) {
      const cellAnimStyle = useAnimatedStyle(() => ({
        transform: [
          { scale: withSpring(1) },
          {
            translateX: shake
              ? withSequence(
                  withTiming(-2, { duration: 50 }),
                  withTiming(2, { duration: 50 }),
                  withTiming(-2, { duration: 50 }),
                  withTiming(2, { duration: 50 }),
                  withTiming(0, { duration: 50 })
                )
              : 0,
          },
        ],
      }));

      const cellStyle = [
        styles.cell,
        isFocused && i === valueArray.length && styles.focusedCell,
        valueArray[i] && styles.filledCell,
        cellAnimStyle,
      ].filter((style): style is ViewStyle => Boolean(style));

      cells.push(
        <AnimatedView
          key={i}
          style={cellStyle}
        >
          <View style={styles.cellInner}>
            {valueArray[i] && (
              <Animated.Text style={styles.cellText}>
                {valueArray[i]}
              </Animated.Text>
            )}
          </View>
        </AnimatedView>
      );
    }

    return cells;
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        onKeyPress={handleKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.hiddenInput}
        keyboardType="number-pad"
        maxLength={cellCount}
        returnKeyType="done"
        autoComplete="off"
        autoCorrect={false}
        autoCapitalize="none"
        textContentType="oneTimeCode"
      />
      <View style={styles.cellsContainer} onTouchStart={handlePress}>
        {renderCells()}
      </View>
    </View>
  );
});

OtpInput.displayName = 'OtpInput';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  } as ViewStyle,
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
  } as TextStyle,
  cellsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  } as ViewStyle,
  cell: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  } as ViewStyle,
  cellInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  focusedCell: {
    borderColor: colors.primary,
    borderWidth: 2,
    ...shadows.md,
  } as ViewStyle,
  filledCell: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  } as ViewStyle,
  cellText: {
    fontSize: typography.sizes.xxl,
    color: colors.text,
    fontFamily: typography.families.sans,
    fontWeight: 'bold',
  } as TextStyle,
});