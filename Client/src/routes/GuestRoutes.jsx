import GuestFileAccess from "../components/GuestFileAccess";
import AuthError from "../components/AuthError";

export const guestRoutes = [
  {
    path: "/guest/access/:fileId",
    element: <GuestFileAccess />,
  },
  {
    path: "/auth/error",
    element: <AuthError />,
  },
];
