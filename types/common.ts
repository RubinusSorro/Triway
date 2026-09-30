export type UserRole = 'rider' | 'driver';

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type PaymentMethod = 'cash' | 'gcash_coming_soon' | 'maya_coming_soon';
