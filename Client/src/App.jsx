import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthError from "./components/AuthError";
import LoginForm from "./components/Forms/LoginForm";
import RegistrationForm from "./components/Forms/RegisterForm";
import AdminView from "./Pages/AdminViewPage";
import DirectoryView from "./Pages/DirectoryPage";
import SettingsPage from "./Pages/SettingsPage";
import { AdminUserView } from "./Pages/AdminUserView";
import Dashboard from "./Pages/SharePage/Dashboard";
import SharedWithMe from "./Pages/SharePage/SharedWithMe";
import SharedByMe from "./Pages/SharePage/SharedByMe";
import PermissionManager from "./Pages/SharePage/PermissionManager";
import FileViewer from "./Pages/SharePage/FileViewer";
import GuestFileAccess from "./components/GuestFileAccess";

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
  {
    path: "/users/:userId/:dirId?",
    element: <AdminUserView />,
  },
  {
    path: "/share",
    element: <Dashboard />,
  },
  {
    path: "/share/shared-with-me",
    element: <SharedWithMe />,
  },
  {
    path: "/share/shared-by-me",
    element: <SharedByMe />,
  },
  {
    path: "/share/manage/:fileId",
    element: <PermissionManager />,
  },
  {
    path: "/share/view/:fileId",
    element: <FileViewer />,
  },
  {
    path: "/guest/access/:fileId",
    element: <GuestFileAccess/>,
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
