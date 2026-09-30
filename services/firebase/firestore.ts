import { getFirestore } from 'firebase/firestore';

import { getFirebaseApp } from '@/services/firebase/config';

export function getFirebaseFirestore() {
  const app = getFirebaseApp();
  return app ? getFirestore(app) : null;
}
