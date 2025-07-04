import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DirectoryView from "./Pages/DirectoryPage";
import LoginForm from "./components/Forms/LoginForm";
import RegistrationForm from "./components/Forms/RegisterForm";
import UsersTable from "./Pages/AdminViewPage/UsersTable";
import AuthError from "./components/AuthError";
import SettingsPage from "./Pages/SettingsPage";

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
    path: "/settings",
    element: <SettingsPage />,
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
