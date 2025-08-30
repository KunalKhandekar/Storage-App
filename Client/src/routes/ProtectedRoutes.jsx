import ProtectedRoute from "../components/ProtectedRoute";
import DirectoryView from "../Pages/DirectoryPage";
import SettingsPage from "../Pages/SettingsPage";
import AdminView from "../Pages/AdminViewPage";
import { AdminUserView } from "../Pages/AdminUserView";
import Dashboard from "../Pages/SharePage/Dashboard";
import SharedWithMe from "../Pages/SharePage/SharedWithMe";
import SharedByMe from "../Pages/SharePage/SharedByMe";
import PermissionManager from "../Pages/SharePage/PermissionManager";
import FileViewer from "../Pages/SharePage/FileViewer";
import GooglePicker from "../components/GooglePicker";

export const protectedRoutes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DirectoryView />
      </ProtectedRoute>
    ),
  },
  {
    path: "/directory/:dirId",
    element: (
      <ProtectedRoute>
        <DirectoryView />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <AdminView />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users/:userId/:dirId?",
    element: (
      <ProtectedRoute>
        <AdminUserView />
      </ProtectedRoute>
    ),
  },
  {
    path: "/share",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/share/shared-with-me",
    element: (
      <ProtectedRoute>
        <SharedWithMe />
      </ProtectedRoute>
    ),
  },
  {
    path: "/share/shared-by-me",
    element: (
      <ProtectedRoute>
        <SharedByMe />
      </ProtectedRoute>
    ),
  },
  {
    path: "/share/manage/:fileId",
    element: (
      <ProtectedRoute>
        <PermissionManager />
      </ProtectedRoute>
    ),
  },
  {
    path: "/share/view/:fileId",
    element: (
      <ProtectedRoute>
        <FileViewer />
      </ProtectedRoute>
    ),
  },{
    path: "/google-picker",
    element: (
     <ProtectedRoute>
        <GooglePicker />
      </ProtectedRoute>
    )
  }
];
