import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../layout/Loader";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) return <Loader />;

  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace state={{ from: location }} />;
  }
  return children;
};

export default ProtectedRoute;
