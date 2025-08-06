import { protectedRoutes } from "./ProtectedRoutes";
import { publicRoutes } from "./PublicRoutes";
import { guestRoutes } from "./GuestRoutes";
import NotFound from "../components/NotFound";

export const allRoutes = [
  ...protectedRoutes,
  ...publicRoutes,
  ...guestRoutes,
  {
    path: "*",
    element: <NotFound />,
  },
];
