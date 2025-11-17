import GuestFileAccess from "../components/GuestFileAccess";
import AuthError from "../components/AuthError";
import TermsOfService from "../components/TermsOfService";
import PrivacyPolicy from "../components/PrivacyPolicy";

export const guestRoutes = [
  {
    path: "/guest/access/:fileId",
    element: <GuestFileAccess />,
  },
  {
    path: "/auth/error",
    element: <AuthError />,
  },
  {
    path: "/terms-of-service",
    element: <TermsOfService />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
];
