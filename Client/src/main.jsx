import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="53857639641-1se37lrtof61kmpu74g521k95erfpmkc.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
    ;
  </StrictMode>
);
