import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { AppBootstrap } from "@/app/providers/AppBootstrap";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { router } from "@/app/router/index";
import "@/lib/i18n";
import "@/styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AppBootstrap>
          <RouterProvider router={router} />
        </AppBootstrap>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
