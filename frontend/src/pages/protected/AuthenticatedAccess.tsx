import useBoundStore from '@/store/store';
import { Navigate, useLocation } from 'react-router-dom';

const AuthenticatedAccess = ({ children }: AuthenticatedAccessProps) => {
  const location = useLocation();
  const userToken = useBoundStore.use.userToken?.();

  if (!userToken) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

type AuthenticatedAccessProps = {
  children: JSX.Element;
};

export default AuthenticatedAccess;
