import { createContext, useContext, useEffect, useState } from "react";
import { isAuthenticated } from "../Apis/authApi";
import { toast } from "sonner";
import axiosInstance from "../Apis/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [user, setUser] = useState({});

  const checkAuthentication = async () => {
    try {
      const res = await isAuthenticated();
      if (res.success) {
        setUser(res.data);
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    } catch (error) {
      console.log("Error while checking Authentication: ", error);
      setIsAuth(false);
    }
  };

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error?.response?.status === 401 &&
          error?.response?.data?.message === "No active session found"
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

  return (
    <AuthContext.Provider value={{ isAuth, user, setIsAuth, checkAuthentication }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
