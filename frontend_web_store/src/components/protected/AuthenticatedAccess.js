import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function AuthenticatedAccess({ children }) {
  const location = useLocation();

  if (!localStorage.getItem("userToken")) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}
