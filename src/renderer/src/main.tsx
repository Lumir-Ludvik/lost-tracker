import React from "react";
import ReactDOM from "react-dom/client";
import "../index.scss";
import { RouterProvider } from "react-router-dom";
import { TableContextProvider } from "./contexts/table-context";
import { GenericError } from "./pages/generic-error-page/generic-error";
import { Router } from "./router";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<NextUIProvider className="flex-1 flex dark text-foreground ">
		<ThemeProvider attribute="class" defaultTheme="dark">
			<React.StrictMode>
				<TableContextProvider>
					<RouterProvider router={Router} fallbackElement={<GenericError />} />
				</TableContextProvider>
			</React.StrictMode>
		</ThemeProvider>
	</NextUIProvider>
);
