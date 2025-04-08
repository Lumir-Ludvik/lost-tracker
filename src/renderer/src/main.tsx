import React from "react";
import ReactDOM from "react-dom/client";
import "../index.scss";
import { RouterProvider } from "react-router-dom";
import { GenericError } from "./pages/generic-error-page/generic-error";
import { Router } from "./router";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<HeroUIProvider className="flex-1 flex dark text-foreground ">
		<ThemeProvider attribute="class" defaultTheme="dark">
			<React.StrictMode>
				<RouterProvider router={Router} fallbackElement={<GenericError />} />
			</React.StrictMode>
		</ThemeProvider>
	</HeroUIProvider>
);
