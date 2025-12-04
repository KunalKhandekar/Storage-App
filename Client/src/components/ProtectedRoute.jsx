import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import Layout from "./Layout";
import AuthLoader from "./AuthLoader";
import { useEffect } from "react";
import { toast } from "sonner";
import axiosInstance from "../Apis/axios";

const ProtectedRoute = ({ children }) => {
  const { isAuth, setIsAuth, checkAuthentication } = useAuth();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const location = window.location.pathname;

        const noToastRoutes = ["/privacy-policy", "/terms-of-service"];

        if (
          error?.response?.status === 401 &&
          error?.response?.data?.message === "No active session found" &&
          !noToastRoutes.includes(location)
        ) {
          toast.error("No active session found", { toasterId: "error" });
          setIsAuth(false);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    checkAuthentication();
  }, []);

  if (isAuth === null) {
    return <AuthLoader />;
  }

  if (isAuth === false) {
    return <Navigate to={"/login"} />;
  }

  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;
