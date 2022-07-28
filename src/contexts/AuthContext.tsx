import { User } from '@/common/User';
import { auth } from '@/firebase';
import { isServer } from '@/utils';
import { getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type AuthContextProps = {
  currentUser: User | null | undefined;
  setCurrentUser: Dispatch<SetStateAction<User | null | undefined>>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
    undefined,
  );

  if (isServer()) {
    return (
      <AuthContext.Provider value={{} as any}>{children}</AuthContext.Provider>
    );
  }

  useEffect(() => {
    getRedirectResult(auth).then(async (credentials) => {
      if (!credentials) {
        return;
      }
      const res = await fetch(`/api/users/${credentials.user.uid}`);
      const data = await res.json();
      if (!data.user) {
        await fetch(`/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: credentials.user.uid,
            username: credentials.user.displayName,
            email: credentials.user.email,
            photoURL: credentials.user.photoURL,
          }),
        });
        const res = await fetch(`/api/users/${credentials.user.uid}`);
        const data = await res.json();
        setCurrentUser(data.user);
      }
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        return;
      }
      const res = await fetch(`/api/users/${user.uid}`);
      const data = await res.json();
      setCurrentUser(data.user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoading: currentUser === undefined,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
