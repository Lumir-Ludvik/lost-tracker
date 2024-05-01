import { Link } from "react-router-dom";
import "./not-found.scss";

export const NotFound = () => (
  <div className="not-found">
    <h1>This page does not exist. 🤔</h1>
    <Link to="/" className="link">
      Please take me home!
    </Link>
  </div>
);
