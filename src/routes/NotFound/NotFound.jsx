import React from "react";
import "./notfound.scss";

export default function NotFound(){
return(
    <div className="notfound-wrapper">
        <h1 className="float">404</h1>
        <p>Opps! Page not found.</p>
        <a href="/">Go Home</a>
    </div>
    );
}