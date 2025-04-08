import { Link } from "react-router-dom";
import "./empty-tab.scss";

export const EmptyTab = () => {
	return (
		<div className="no-tabs">
			<h1>No games found! 😥 Try changing your search criteria or create some!</h1>
			<Link to="./tab-generator" className="link">
				Go to Game generator
			</Link>
		</div>
	);
};
