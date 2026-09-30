import { getAuth } from 'firebase/auth';

import { getFirebaseApp } from '@/services/firebase/config';

export function getFirebaseAuth() {
  const app = getFirebaseApp();
  return app ? getAuth(app) : null;
}
