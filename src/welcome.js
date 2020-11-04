import React from "react";
import Registration from "./registration";
import { HashRouter, Route } from "react-router-dom";
import Login from "./login";

//This is the Welcome component rendering the Registration component:

export default function Welcome() {
    return (
        <div>
            <div>
                <img src="https://avatars3.githubusercontent.com/u/7605270?s=400&u=a0a7a76ff8e01b5c992cd5b44761a04540900b46&v=4" />
                <h1>
                    This is the WELCOME COMPONENT rendering the Registration
                    component
                </h1>
            </div>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
