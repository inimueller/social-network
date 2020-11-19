import React from "react";
import Registration from "./registration";
import { HashRouter, Route } from "react-router-dom";
import Login from "./login";
import ResetPassword from "./ResetPassword";

//This is the Welcome component rendering the Registration component:

export default function Welcome() {
    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <div>
                <div
                    style={{
                        width: "800px",
                        display: "flex",
                        flexWrap: "wrap",
                    }}
                >
                    <img src="https://img.icons8.com/color/452/illuminati-symbol.png" />
                </div>
                <div>
                    <h1>Welcome to Amuleto</h1>
                </div>
                <HashRouter>
                    <div>
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                        <Route path="/reset" component={ResetPassword} />
                    </div>
                </HashRouter>
            </div>
        </div>
    );
}
