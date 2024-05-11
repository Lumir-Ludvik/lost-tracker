import { Link } from "react-router-dom";
import "./header.scss";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";

export const Header = () => {
	return (
		// <div className="header">
		// 	<h1 className="headline">Lost Tracker</h1>
		// 	<div className="links">
		// 		<Link to="/" className="link">
		// 			Tables
		// 		</Link>
		// 		<Link to="/generator" className="link">
		// 			Create table
		// 		</Link>
		// 	</div>
		// </div>

		<Navbar className="header" position="sticky">
			<NavbarBrand>
				<h1 className="headline">Lost Tracker</h1>
			</NavbarBrand>
			<NavbarContent>
				<NavbarItem>
					<Link to="/" className="link">
						Tables
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link to="/generator" className="link">
						Create table
					</Link>
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
};
