import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function CustomerAccess({ children }) {
  const location = useLocation();

  if (
    localStorage.getItem("userRole") === "ROLE_EMPLOYEE" ||
    localStorage.getItem("userRole") === "ROLE_MANAGER"
  ) {
    return <Navigate to="/404" state={{ from: location }} />;
  } else if (localStorage.getItem("userRole") !== "ROLE_CUSTOMER") {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}
