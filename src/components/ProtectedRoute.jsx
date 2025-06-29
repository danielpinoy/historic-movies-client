// 4. Create a ProtectedRoute component - src/components/ProtectedRoute.jsx

import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { forceLogout } from "../slice/userSlice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    // Check if token exists and is valid
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      // No valid authentication, force logout
      dispatch(forceLogout());
      return;
    }

    // Optional: Check if token is expired (if you store expiry)
    try {
      // If you want to decode JWT to check expiry
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      if (payload.exp && payload.exp < currentTime) {
        // Token is expired
        dispatch(forceLogout());
        return;
      }
    } catch (error) {
      // Invalid token format
      dispatch(forceLogout());
      return;
    }
  }, [dispatch]);

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
