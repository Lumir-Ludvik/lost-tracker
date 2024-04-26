import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { RouterProvider } from "react-router-dom";
import { Router } from "./router.tsx";
import { GenericError } from "./pages/generic-error-page/generic-error.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={Router} fallbackElement={<GenericError />} />
  </React.StrictMode>
);
