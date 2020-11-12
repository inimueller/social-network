import React from "react";
import { Link } from "react-router-dom";
// import Registration from "./registration";

export default function Logo() {
    return (
        <div>
            <Link to="/">
                <img
                    id="logo"
                    src="https://avatars3.githubusercontent.com/u/7605270?s=400&u=a0a7a76ff8e01b5c992cd5b44761a04540900b46&v=4"
                />
            </Link>
        </div>
    );
}
