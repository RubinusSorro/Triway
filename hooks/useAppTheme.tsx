import { createContext, PropsWithChildren, useContext, useMemo } from 'react';

import { AppTheme, lightTheme } from '@/constants/theme';

type ThemeContextValue = {
  theme: AppTheme;
  colorScheme: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const value = useMemo(
    () => ({
      theme: lightTheme,
      colorScheme: 'light' as const,
    }),
    [],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error('useAppTheme must be used inside AppThemeProvider');
  }

  return value;
}
