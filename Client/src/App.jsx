import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthError from "./components/AuthError";
import LoginForm from "./components/Forms/LoginForm";
import RegistrationForm from "./components/Forms/RegisterForm";
import AdminView from "./Pages/AdminViewPage";
import DirectoryView from "./Pages/DirectoryPage";
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
    element: <AdminView />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
