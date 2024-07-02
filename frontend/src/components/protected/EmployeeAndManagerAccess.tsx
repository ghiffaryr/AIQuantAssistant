import Role from '@/enums/RoleEnum';
import useBoundStore from '@/store/store';
import { Navigate, useLocation } from 'react-router-dom';

const EmployeeAndManagerAccess = ({
  children,
}: EmployeeAndManagerAccessProps) => {
  const location = useLocation();
  const userRole = useBoundStore.use.userRole?.();

  if (userRole === Role.Employee || userRole === Role.Manager) {
    return children;
  }
  return <Navigate to="/404" state={{ from: location }} />;
};

export default EmployeeAndManagerAccess;

type EmployeeAndManagerAccessProps = {
  children: JSX.Element;
};
