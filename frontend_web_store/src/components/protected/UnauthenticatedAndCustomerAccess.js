import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function UnauthenticatedAndCustomerAccess({ children }) {
  const location = useLocation();

  if (
    !localStorage.getItem("userRole") ||
    localStorage.getItem("userRole") === "ROLE_CUSTOMER"
  ) {
    return children;
  }

  return <Navigate to="/404" state={{ from: location }} />;
}
