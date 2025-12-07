import React from "react";
import { Link } from "react-router-dom";
import "./notfound.scss";

export default function NotFound(){
return(
    <div className="notfound-wrapper">
        <h1 className="float">404</h1>
        <p>Opps! Page not found.</p>
        <Link to="/">Go Home</Link>
    </div>
    );
}