import { Platform, TextStyle, ViewStyle } from 'react-native';

export const colors = {
  primary: '#064E3B',
  secondary: '#147D64',
  primaryDark: '#043D2E',
  tint: '#CFE5CF',
  background: '#F0F7F3',
  tintRow: '#E5F0E7',
  surface: '#FFFFFF',
  text: '#111111',
  textMuted: '#6B7280',
  onPrimary: '#FFFFFF',
  border: '#D5E3DA',
  danger: '#C0392B',
  warning: '#B45309',
  disabled: '#9CA3AF',
  disabledBackground: '#E5E7EB',
  warningSoft: '#FDEBD0',
  info: '#1D4ED8',
  transparent: 'transparent',
  overlay: 'rgba(17, 17, 17, 0.50)',
  overlayClear: 'rgba(6, 78, 59, 0)',
  primarySoft: 'rgba(6, 78, 59, 0.12)',
  skyline: 'rgba(4, 61, 46, 0.72)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
  xxxxxl: 48,
} as const;

export const radii = {
  sm: 8,
  card: 16,
  input: 12,
  button: 12,
  lg: 20,
  pill: 999,
} as const;

export const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export const touchTargets = {
  minimum: 44,
  comfortable: 48,
} as const;

export const fontFamilies = {
  regular: 'Inter_400Regular',
  semibold: 'Inter_600SemiBold',
  extraBold: 'Inter_800ExtraBold',
} as const;

export const typography = {
  wordmark: { fontFamily: fontFamilies.extraBold, fontSize: 44, fontWeight: '800', lineHeight: 52, letterSpacing: 1 },
  display: { fontFamily: fontFamilies.extraBold, fontSize: 38, fontWeight: '800', lineHeight: 44 },
  screenTitle: { fontFamily: fontFamilies.semibold, fontSize: 24, fontWeight: '600', lineHeight: 30 },
  sectionHeading: { fontFamily: fontFamilies.semibold, fontSize: 17, fontWeight: '600', lineHeight: 22 },
  body: { fontFamily: fontFamilies.regular, fontSize: 15, fontWeight: '400', lineHeight: 22 },
  secondaryBody: { fontFamily: fontFamilies.regular, fontSize: 13, fontWeight: '400', lineHeight: 18 },
  label: { fontFamily: fontFamilies.semibold, fontSize: 12, fontWeight: '600', lineHeight: 16 },
  caption: { fontFamily: fontFamilies.regular, fontSize: 12, fontWeight: '400', lineHeight: 16 },
  button: { fontFamily: fontFamilies.semibold, fontSize: 16, fontWeight: '600', lineHeight: 20 },
  // Compatibility aliases for established screen and component imports.
  title: { fontFamily: fontFamilies.semibold, fontSize: 24, fontWeight: '600', lineHeight: 30 },
  sectionTitle: { fontFamily: fontFamilies.semibold, fontSize: 17, fontWeight: '600', lineHeight: 22 },
  bodySemibold: { fontFamily: fontFamilies.semibold, fontSize: 15, fontWeight: '600', lineHeight: 22 },
  subtitle: { fontFamily: fontFamilies.regular, fontSize: 13, fontWeight: '400', lineHeight: 18 },
  captionSemibold: { fontFamily: fontFamilies.semibold, fontSize: 12, fontWeight: '600', lineHeight: 16 },
} satisfies Record<string, TextStyle>;

export const shadows = {
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: colors.text,
      shadowOpacity: 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 4 },
    },
    android: { elevation: 3 },
    default: {
      shadowColor: colors.text,
      shadowOpacity: 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 4 },
    },
  }) ?? {},
  floating: Platform.select<ViewStyle>({
    ios: {
      shadowColor: colors.text,
      shadowOpacity: 0.12,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 8 },
    },
    android: { elevation: 5 },
    default: {
      shadowColor: colors.text,
      shadowOpacity: 0.12,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 8 },
    },
  }) ?? {},
} as const;

export type AppTheme = {
  colors: {
    background: string;
    surface: string;
    elevated: string;
    primary: string;
    secondary: string;
    primaryDark: string;
    tint: string;
    tintRow: string;
    text: string;
    textMuted: string;
    mutedText: string;
    onPrimary: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
  radius: { sm: number; md: number; lg: number };
};

export const lightTheme: AppTheme = {
  colors: {
    background: colors.background,
    surface: colors.surface,
    elevated: colors.tintRow,
    primary: colors.primary,
    secondary: colors.secondary,
    primaryDark: colors.primaryDark,
    tint: colors.tint,
    tintRow: colors.tintRow,
    text: colors.text,
    textMuted: colors.textMuted,
    mutedText: colors.textMuted,
    onPrimary: colors.onPrimary,
    border: colors.border,
    success: colors.primary,
    warning: colors.warning,
    danger: colors.danger,
    info: colors.info,
  },
  radius: { sm: radii.input, md: radii.button, lg: radii.card },
};

// Compatibility alias. TRIWAY intentionally ships no dark theme in this prototype.
export const darkTheme = lightTheme;
