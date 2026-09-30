import { AppUser, UserRole } from '@/types/common';

type AuthListener = (user: AppUser | null) => void;

let currentUser: AppUser | null = null;
const listeners = new Set<AuthListener>();

function emit() {
  listeners.forEach((listener) => listener(currentUser));
}

function makePrototypeUser(role: UserRole): AppUser {
  const isRider = role === 'rider';

  return {
    id: isRider ? 'demo-rider-001' : 'demo-driver-001',
    name: isRider ? 'TriWay Rider' : 'Kuya Jun Driver',
    email: isRider ? 'rider@triway.demo' : 'driver@triway.demo',
    role,
    createdAt: new Date().toISOString(),
  };
}

export const authService = {
  getCurrentUser() {
    return currentUser;
  },

  continueAs(role: UserRole) {
    currentUser = makePrototypeUser(role);
    emit();
    return currentUser;
  },

  signOut() {
    currentUser = null;
    emit();
  },

  subscribe(listener: AuthListener) {
    listeners.add(listener);
    listener(currentUser);

    return () => {
      listeners.delete(listener);
    };
  },
};
