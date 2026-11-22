import * as React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import { runPrepaintScripts } from "@/app/layout";
import { routes } from "./routes";

// Theme, skin, scope and first-visit attributes on <html> before the first render.
runPrepaintScripts();

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
