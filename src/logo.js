import React from "react";
import { Link } from "react-router-dom";
// import Registration from "./registration";

export default function Logo() {
    return (
        <div>
            <Link to="/">
                <img
                    id="logo"
                    src="https://img.icons8.com/color/452/illuminati-symbol.png"
                />
            </Link>
        </div>
    );
}
