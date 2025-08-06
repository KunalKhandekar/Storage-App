import PublicOnlyRoute from "../components/PublicOnlyRoute";
import LoginForm from "../components/Forms/LoginForm";
import RegistrationForm from "../components/Forms/RegisterForm";

export const publicRoutes = [
  {
    path: "/login",
    element: <PublicOnlyRoute><LoginForm /></PublicOnlyRoute>,
  },
  {
    path: "/register",
    element: <PublicOnlyRoute><RegistrationForm /></PublicOnlyRoute>,
  },
];
