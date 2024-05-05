import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import "./layout.scss";
import { GenericError } from "../../../pages/generic-error-page/generic-error";
import { Header } from "../header/header";

export const Layout = () => {
	return (
		<ErrorBoundary FallbackComponent={GenericError}>
			<div className="layout">
				<Header />
				<div className="router-outlet-container">
					<Outlet />
				</div>
			</div>
		</ErrorBoundary>
	);
};
