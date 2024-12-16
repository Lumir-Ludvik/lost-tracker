import { createHashRouter } from "react-router-dom";
import { Layout } from "./common/components/layout/layout";
import { GenericError } from "./pages/generic-error-page/generic-error";
import { TableView } from "./pages/table-view/table-view";
import { TableGenerator } from "./pages/table-generator/table-generator";
import { NotFound } from "./pages/not-found/not-found";
import { TabGenerator } from "./pages/tab-generator/tab-generator";

export const Router = createHashRouter([
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
				path: "/table-generator",
				element: <TableGenerator />
			},
			{
				path: "/error",
				element: <GenericError />
			},
			{
				path: "/tab-generator",
				element: <TabGenerator />
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
