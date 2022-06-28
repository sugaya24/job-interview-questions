import { GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth';

import { auth } from './firebase';

const provider = new GoogleAuthProvider();

export function login(): void {
  signInWithRedirect(auth, provider);
}

export function logout(): Promise<void> {
  return new Promise((resolve, reject) => {
    signOut(auth)
      .then(() => resolve())
      .catch((error) => reject(error));
  });
}
