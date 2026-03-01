import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./styles.css";

const basename = import.meta.env.PROD ? "/app" : "/";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
