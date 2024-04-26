import { Link } from "react-router-dom";
import "./generic-error.scss";

export const GenericError = () => (
  <div className="generic-error-page">
    <h1>Something went wrong. 😭</h1>
    <p>
      Please refresh your browser and try again or try redirecting to the root
      of the app
    </p>
    <Link to="/" className="link">
      Please take me home!
    </Link>
  </div>
);
