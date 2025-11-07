import ProtectedRoute from "../components/ProtectedRoute";
import { AdminUserView } from "../Pages/AdminUserView";
import AdminView from "../Pages/AdminViewPage";
import DirectoryView from "../Pages/DirectoryPage";
import PlansPage from "../Pages/PlansPage";
import ChangePlan from "../Pages/PlansPage/changePlanPage";
import SettingsPage from "../Pages/SettingsPage";
import Dashboard from "../Pages/SharePage/Dashboard";
import FileViewer from "../Pages/SharePage/FileViewer";
import PermissionManager from "../Pages/SharePage/PermissionManager";
import SharedByMe from "../Pages/SharePage/SharedByMe";
import SharedWithMe from "../Pages/SharePage/SharedWithMe";

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
  },
  {
    path: "/plans",
    element: (
      <ProtectedRoute>
        <PlansPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/plans/change-plan",
    element: (
      <ProtectedRoute>
        <ChangePlan />
      </ProtectedRoute>
    ),
  },
];
