import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function EmployeeAndManagerAccess({ children }) {
  const location = useLocation();

  if (
    localStorage.getItem('userRole') === 'ROLE_EMPLOYEE' ||
    localStorage.getItem('userRole') === 'ROLE_MANAGER'
  ) {
    return children;
  }
  return <Navigate to="/404" state={{ from: location }} />;
}
