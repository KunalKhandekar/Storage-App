import { createContext, useContext, useState } from "react";
import { isAuthenticated } from "../Apis/authApi";

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


  return (
    <AuthContext.Provider
      value={{ isAuth, user, setIsAuth, checkAuthentication }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
