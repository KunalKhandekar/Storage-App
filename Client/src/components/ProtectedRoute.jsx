import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContent";
import Layout from "./Layout";
import AuthLoader from "./AuthLoader";

const ProtectedRoute = ({ children }) => {
  const { isAuth } = useAuth();
  console.log({ isAuth, time: Date.now() });

  if (isAuth === null) {
    return <AuthLoader />;
  }

  if (isAuth === false) {
    return <Navigate to={"/login"} />;
  }

  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;
