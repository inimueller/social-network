//has to be a class component

import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        console.log("uplader just mounted");
    }
    render() {
        return (
            <>
                <h2>I'm the uploader component </h2>
            </>
        );
    }
}
