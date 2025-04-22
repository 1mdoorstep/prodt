export const colors = {
  // Brand Colors
  primary: '#2563EB',
  primaryDark: '#1E40AF',
  primaryLight: '#60A5FA',
  secondary: '#10B981',
  secondaryDark: '#059669',
  secondaryLight: '#34D399',

  // UI Colors
  background: '#FFFFFF',
  card: '#F8FAFC',
  cardShadow: '#1E293B',
  border: '#E2E8F0',
  
  // Text Colors
  text: '#1E293B',
  textLight: '#64748B',
  textDark: '#0F172A',
  textInverse: '#FFFFFF',

  // Status Colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // State Colors
  disabled: '#CBD5E1',
  placeholder: '#94A3B8',
  highlight: '#EFF6FF',

  // Dark Mode Colors (for future use)
  darkBackground: '#0F172A',
  darkCard: '#1E293B',
  darkBorder: '#334155',
  darkText: '#F8FAFC',
  darkTextLight: '#CBD5E1'
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  families: {
    sans: 'System',  // Will be replaced with custom font
  },
};

export const shadows = {
  sm: {
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const layout = {
  screenPadding: spacing.md,
  maxWidth: 500,
};

export const animations = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeInOut: 'easeInOut',
    easeIn: 'easeIn',
    easeOut: 'easeOut',
  },
}; 