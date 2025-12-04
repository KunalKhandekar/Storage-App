import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import AuthLoader from "./AuthLoader";
import { useEffect } from "react";

const PublicOnlyRoute = ({ children }) => {
  const { isAuth, checkAuthentication } = useAuth();

  useEffect(() => {
    checkAuthentication();
  }, []);

  if (isAuth === null) {
    return <AuthLoader />;
  }

  if (isAuth === true) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicOnlyRoute;
