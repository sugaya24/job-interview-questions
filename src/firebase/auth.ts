import { User } from '@/common';
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';

import firebaseApp from './firebase';

const provider = new GoogleAuthProvider();

export function login(): void {
  const auth = getAuth(firebaseApp);
  signInWithRedirect(auth, provider);
}

export function logout(): Promise<void> {
  return new Promise((resolve, reject) => {
    const auth = getAuth(firebaseApp);
    signOut(auth)
      .then(() => resolve())
      .catch((error) => reject(error));
  });
}

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  const auth = getAuth(firebaseApp);

  onFirebaseAuthStateChanged(auth, (user) => {
    const userInfo: User | null = user
      ? {
          displayName: user?.displayName,
          email: user?.email,
          photoURL: user?.photoURL,
        }
      : null;
    callback(userInfo);
  });
};
