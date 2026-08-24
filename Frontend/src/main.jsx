import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./output.css";
import App from "./App.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { PlayerProvider } from "./Context/PlayerContext.jsx";
import { LoginPopupProvider } from "./Context/LoginPopupContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <LoginPopupProvider>
        <PlayerProvider>
          <App />
        </PlayerProvider>
      </LoginPopupProvider>
    </AuthProvider>
  </StrictMode>
);
