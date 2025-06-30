import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DirectoryView from "./DirectoryView/main";
import LoginForm from "./Forms/LoginForm";
import RegistrationForm from "./Forms/RegisterForm";
import UsersTable from "./AdminView/UsersTable";
import AuthError from "./components/AuthError";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DirectoryView />,
  },
  {
    path: "/auth/error",
    element: <AuthError />,
  },
  {
    path: "/directory/:dirId",
    element: <DirectoryView />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <RegistrationForm />,
  },
  {
    path: "/users",
    element: <UsersTable />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
