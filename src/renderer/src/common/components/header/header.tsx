import { Link } from "react-router-dom";
import "./header.scss";

export const Header = () => {
  return (
    <div className="header">
      <h2 className="headline">Lost Tracker</h2>
      <div className="links">
        <Link to="/" className="link">
          Tables
        </Link>
        <Link to="/generator" className="link">
          Create table
        </Link>
      </div>
    </div>
  );
};
