import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInputProps as RNTextInputProps,
  Platform,
  Pressable,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { colors, typography, borderRadius, spacing, shadows } from '@/constants/theme';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedText = Animated.createAnimatedComponent(Text);

export interface InputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  helperStyle?: TextStyle;
  errorStyle?: TextStyle;
  variant?: 'outlined' | 'filled';
  formatPhoneNumber?: boolean;
}

export const Input = React.memo(({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  helperStyle,
  errorStyle,
  variant = 'outlined',
  formatPhoneNumber = false,
  value = '',
  onChangeText,
  onFocus,
  onBlur,
  placeholder,
  ...rest
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [formattedValue, setFormattedValue] = useState('');
  const inputRef = useRef<TextInput>(null);

  // Format phone number on mount and when value changes
  useEffect(() => {
    if (formatPhoneNumber && value) {
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      if (cleaned.length > 0) {
        if (cleaned.length <= 3) {
          formatted = `(${cleaned}`;
        } else if (cleaned.length <= 6) {
          formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
        } else {
          formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
        }
      }
      setFormattedValue(formatted);
    } else {
      setFormattedValue(value);
    }
  }, [value, formatPhoneNumber]);

  const handleChangeText = useCallback((text: string) => {
    if (formatPhoneNumber) {
      // Remove all non-numeric characters
      const cleaned = text.replace(/\D/g, '');
      if (onChangeText) {
        onChangeText(cleaned);
      }
    } else if (onChangeText) {
      onChangeText(text);
    }
  }, [formatPhoneNumber, onChangeText]);

  const handleFocus = useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    onFocus?.(e);
  }, [onFocus]);

  const handleBlur = useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    onBlur?.(e);
  }, [onBlur]);

  const labelAnimation = useAnimatedStyle(() => {
    const hasValue = value.length > 0;
    const shouldRaise = isFocused || hasValue;

    return {
      transform: [
        {
          translateY: withSpring(shouldRaise ? -spacing.xl : 0, {
            damping: 15,
            stiffness: 100,
          }),
        },
        {
          scale: withSpring(shouldRaise ? 0.85 : 1, {
            damping: 15,
            stiffness: 100,
          }),
        },
      ],
      color: withTiming(
        interpolateColor(
          Number(isFocused),
          [0, 1],
          [error ? colors.error : colors.textLight, colors.primary]
        )
      ),
    };
  }, [isFocused, value, error]);

  const inputAnimation = useAnimatedStyle(() => ({
    borderColor: withTiming(
      error
        ? colors.error
        : isFocused
        ? colors.primary
        : colors.border
    ),
  }));

  const containerStyles = [
    styles.container,
    containerStyle,
  ];

  const inputContainerStyles = [
    styles.inputContainer,
    variant === 'filled' && styles.filledInput,
    inputAnimation,
  ];

  const inputStyles = [
    styles.input,
    Boolean(leftIcon) && styles.inputWithLeftIcon,
    Boolean(rightIcon) && styles.inputWithRightIcon,
    inputStyle,
  ];

  const renderHelper = () => {
    if (error) {
      return <Text style={[styles.helper, styles.error, errorStyle]}>{error}</Text>;
    }
    if (helper) {
      return <Text style={[styles.helper, helperStyle]}>{helper}</Text>;
    }
    return null;
  };

  return (
    <View style={containerStyles}>
      <Pressable onPress={() => inputRef.current?.focus()}>
        <View style={inputContainerStyles}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          
          <View style={styles.inputWrapper}>
            {label && (
              <AnimatedText style={[styles.label, labelAnimation, labelStyle]}>
                {label}
              </AnimatedText>
            )}
            
            <AnimatedTextInput
              ref={inputRef}
              style={inputStyles}
              value={formattedValue}
              onChangeText={handleChangeText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={isFocused ? placeholder : ''}
              placeholderTextColor={colors.placeholder}
              selectionColor={colors.primary}
              {...rest}
            />
          </View>

          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      </Pressable>

      {renderHelper()}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    minHeight: 56,
    ...shadows.sm,
  },
  filledInput: {
    backgroundColor: colors.card,
    borderWidth: 0,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: typography.sizes.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: typography.families.sans,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  label: {
    position: 'absolute',
    left: spacing.md,
    fontSize: typography.sizes.md,
    fontFamily: typography.families.sans,
    backgroundColor: colors.background,
    paddingHorizontal: 4,
  },
  leftIcon: {
    paddingLeft: spacing.md,
  },
  rightIcon: {
    paddingRight: spacing.md,
  },
  helper: {
    marginTop: spacing.xs,
    fontSize: typography.sizes.sm,
    color: colors.textLight,
    fontFamily: typography.families.sans,
  },
  error: {
    color: colors.error,
  },
});