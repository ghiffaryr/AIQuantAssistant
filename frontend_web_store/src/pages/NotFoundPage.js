import React from "react";
import "../css/NotFoundPage.css";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <>
      <div className="main-notfound">
        <div className="notfound-content">
          <h3 className="notfound-header">
            The requested page not found on this server.
          </h3>
          <h4 className="notfound-link">
            Go back to <Link to="/">Home Page</Link>
          </h4>
        </div>
      </div>
    </>
  );
}
