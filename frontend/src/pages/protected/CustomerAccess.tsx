import Role from '@/enums/RoleEnum';
import useBoundStore from '@/store/store';
import { Navigate, useLocation } from 'react-router-dom';

export default function CustomerAccess({ children }: CustomerAccessProps) {
  const location = useLocation();
  const userRole = useBoundStore.use.userRole?.();

  if (userRole === Role.Customer) {
    return children;
  }

  return <Navigate to="/404" state={{ from: location }} />;
}

type CustomerAccessProps = {
  children: JSX.Element;
};
