import Role from '@/enums/RoleEnum';
import useBoundStore from '@/store/store';
import { Navigate, useLocation } from 'react-router-dom';

const UnauthenticatedAndCustomerAccess = ({
  children,
}: UnauthenticatedAndCustomerAccessProps) => {
  const location = useLocation();
  const userRole = useBoundStore.use.userRole?.();

  if (!userRole || userRole === Role.Customer) {
    return children;
  }

  return <Navigate to="/404" state={{ from: location }} />;
};

export default UnauthenticatedAndCustomerAccess;

type UnauthenticatedAndCustomerAccessProps = {
  children: JSX.Element;
};
