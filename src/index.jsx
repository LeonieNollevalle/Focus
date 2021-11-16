import React from "react";

import ReactDOM from "react-dom";
import "./styles/index.css";
import { BrowserRouter as Router } from "react-router-dom";
import BurgerProvider from "./components/BurgerProvider";
import App from "./App";
import "./assets/fonts/grotesk/Grotesk.css";
import "./assets/fonts/focus/focus.css";
import PlayerProvider from "./components/PlayerProvider";

/* Temporary */
import { SignInProvider } from "./contexts/SignInContext";
import { AuthProvider } from "./contexts/AuthContext";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <SignInProvider>
        <PlayerProvider>
          <BurgerProvider>
            <Router>
              <App />
            </Router>
          </BurgerProvider>
        </PlayerProvider>
      </SignInProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
