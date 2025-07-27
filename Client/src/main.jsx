import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ModalProvider } from "./Contexts/ModalContext.jsx";
import Modals from "./Contexts/ModalContainer.jsx";
import { AuthProvider } from "./Contexts/AuthContent.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ModalProvider>
          <App />
          <Modals />
        </ModalProvider>
      </GoogleOAuthProvider>
    </AuthProvider>
  </StrictMode>
);
