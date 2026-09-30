import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { authService } from '@/features/auth/services/authService';
import { AppUser, UserRole } from '@/types/common';

type AuthContextValue = {
  user: AppUser | null;
  continueAs: (role: UserRole) => AppUser;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AppUser | null>(authService.getCurrentUser());

  useEffect(() => authService.subscribe(setUser), []);

  const value = useMemo(
    () => ({
      user,
      continueAs: authService.continueAs,
      signOut: authService.signOut,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return value;
}
