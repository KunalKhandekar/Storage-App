import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ModalProvider } from "./Contexts/ModalContext.jsx";
import Modals from "./Contexts/ModalContainer.jsx";
import { AuthProvider } from "./Contexts/AuthContext.jsx";
import { StorageProvider } from "./Contexts/StorageContext.jsx";
import { ProgressProvider } from "./Contexts/ProgressContext.jsx";
import { GlobalUploadProgress } from "./components/GlobalUploadProgess.jsx";
import { Toaster } from "sonner";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ModalProvider>
          <ProgressProvider>
            <StorageProvider>
              <App />
              <Toaster
                position="top-right"
                richColors
                closeButton
                expand={false}
                offset={{ bottom: '0px', right: "10px", left: "0px", top: "90px" }}
                mobileOffset={{ top: "60px" }}
              />
               <Toaster id="error" position="top-right" richColors />
              <Modals />
              <GlobalUploadProgress />
            </StorageProvider>
          </ProgressProvider>
        </ModalProvider>
      </GoogleOAuthProvider>
    </AuthProvider>
  </StrictMode>
);
