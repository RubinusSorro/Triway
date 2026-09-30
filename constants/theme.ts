import { Platform, TextStyle, ViewStyle } from 'react-native';

export const colors = {
  primary: '#1F5C2E',
  primaryDark: '#164A24',
  tint: '#E9F1E7',
  tintRow: '#EEF2EC',
  surface: '#FFFFFF',
  text: '#111827',
  textMuted: '#6B7280',
  onPrimary: '#FFFFFF',
  border: '#E5E7EB',
  danger: '#B42318',
  warning: '#B54708',
  info: '#2563EB',
  transparent: 'transparent',
  overlay: 'rgba(8, 20, 11, 0.70)',
  overlayClear: 'rgba(8, 20, 11, 0)',
  primarySoft: 'rgba(31, 92, 46, 0.12)',
  skyline: 'rgba(22, 74, 36, 0.72)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radii = {
  card: 18,
  input: 12,
  button: 12,
  pill: 999,
} as const;

export const fontFamilies = {
  regular: 'Inter_400Regular',
  semibold: 'Inter_600SemiBold',
  extraBold: 'Inter_800ExtraBold',
} as const;

export const typography = {
  wordmark: { fontFamily: fontFamilies.extraBold, fontSize: 44, lineHeight: 52, letterSpacing: 1 },
  display: { fontFamily: fontFamilies.extraBold, fontSize: 38, lineHeight: 44 },
  title: { fontFamily: fontFamilies.semibold, fontSize: 24, lineHeight: 30 },
  sectionTitle: { fontFamily: fontFamilies.semibold, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: fontFamilies.regular, fontSize: 15, lineHeight: 22 },
  bodySemibold: { fontFamily: fontFamilies.semibold, fontSize: 15, lineHeight: 22 },
  subtitle: { fontFamily: fontFamilies.regular, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fontFamilies.regular, fontSize: 12, lineHeight: 16 },
  captionSemibold: { fontFamily: fontFamilies.semibold, fontSize: 12, lineHeight: 16 },
  button: { fontFamily: fontFamilies.semibold, fontSize: 16, lineHeight: 20 },
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
} as const;

export type AppTheme = {
  colors: {
    background: string;
    surface: string;
    elevated: string;
    primary: string;
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
    background: colors.tint,
    surface: colors.surface,
    elevated: colors.tintRow,
    primary: colors.primary,
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

// The visual system is intentionally light-only; this alias keeps legacy callers stable.
export const darkTheme = lightTheme;
