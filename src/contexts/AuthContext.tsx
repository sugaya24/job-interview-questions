import { User } from '@/common/User';
import { onAuthStateChanged } from '@/firebase';
import { isServer } from '@/utils';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextProps = {
  currentUser: User | null | undefined;
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
    onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
