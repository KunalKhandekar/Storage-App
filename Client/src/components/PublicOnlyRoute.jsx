import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContent";
import AuthLoader from "./AuthLoader";

const PublicOnlyRoute = ({ children }) => {
  const { isAuth } = useAuth();

  if (isAuth === null) {
    return <AuthLoader />;
  }

  if (isAuth === true) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicOnlyRoute;
