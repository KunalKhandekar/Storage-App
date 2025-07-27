import { createContext, useContext, useEffect, useState } from "react";
import { isAuthenticated } from "../Apis/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [user, setUser] = useState({});

  const checkAuthentication = async () => {
    try {
      const res = await isAuthenticated();
      if (res.success) {
        console.log({ res, time: Date.now() });
        setIsAuth(true);
        setUser(res.data);
      } else {
        setIsAuth(false);
      }
    } catch (error) {
      console.log("Error while checking Authentication: ", error);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, user , setIsAuth  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
