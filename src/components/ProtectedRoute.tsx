import { useAuthContext } from '@/contexts';
import Router from 'next/router';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuthContext();
  if (!currentUser) {
    if (typeof window !== 'undefined') {
      Router.push('/');
    }
  }
  return children;
};

export default ProtectedRoute;
