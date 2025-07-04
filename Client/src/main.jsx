import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ModalProvider } from "./Contexts/ModalContext.jsx";
import Modals from "./Contexts/ModalContainer.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ModalProvider>
        <App />
        <Modals />
      </ModalProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
