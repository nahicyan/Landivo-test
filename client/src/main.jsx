import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-7yhblg2pgxc2xf66.us.auth0.com"
      clientId="fjst2CBJnk7rxxnqHBSRoAaPPczIbtgJ"
      authorizationParams={{
        redirect_uri: window.location.origin + "/callback",
        audience: "https://dev-7yhblg2pgxc2xf66.us.auth0.com/api/v2/",
        scope: "openid profile email"
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);