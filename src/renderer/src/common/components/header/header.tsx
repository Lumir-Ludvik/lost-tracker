import { Link } from "react-router-dom";
import "./header.scss";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";

export const Header = () => {
	return (
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
					<Link to="/table-generator" className="link">
						Create table
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link to="/tab-generator" className="link">
						Add Game
					</Link>
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
};
