import { createBrowserRouter } from "react-router-dom";
import { TableView } from "./pages/table-view/table-view.tsx";
import { TableGenerator } from "./pages/table-generator/table-generator.tsx";
import { Layout } from "./common/components/layout/layout.tsx";
import { GenericError } from "./pages/generic-error-page/generic-error.tsx";
import { NotFound } from "./pages/not-found/not-found.tsx";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    ErrorBoundary: GenericError,
    children: [
      {
        path: "/",
        element: <TableView />
      },
      {
        path: "/generator",
        element: <TableGenerator />
      },
      {
        path: "/error",
        element: <GenericError />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]);
