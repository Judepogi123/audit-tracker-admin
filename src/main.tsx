import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter,ScrollRestoration, useLocation,} from "react-router-dom";

import AuthProvider from "react-auth-kit";
import createStore from "react-auth-kit/createStore";
import SystemDataProvider from "./provider/SystemDataProvider.tsx";
import NetworkStatus from "./provider/NetworkStatus.tsx";

import App from "./App.tsx";
import "./index.css";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const store = createStore({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(

  <React.StrictMode>
    <AuthProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
