import NotFound from "../components/NotFound";
import { guestRoutes } from "./GuestRoutes";
import { protectedRoutes } from "./ProtectedRoutes";
import { publicRoutes } from "./PublicRoutes";

export const allRoutes = [
  ...protectedRoutes,
  ...publicRoutes,
  ...guestRoutes,
  {
    path: "*",
    element: <NotFound />,
  },
];
