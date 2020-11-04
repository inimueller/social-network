import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state in the callback: ", this.state)
        );
    }

    submit() {
        console.log("about to submit!!!");
        axios
            .post("/register", this.state)
            .then((response) => {
                console.log("response", response);
                if (response.data.success) {
                    // then we want to redirect the user to our social network
                    console.log("submit getting to success : true");
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => console.log("error in submit registration: ", err));
    }

    render() {
        console.log("this.state.error: ", this.state.error);
        return (
            <div>
                <h2>I am the Registration Component!</h2>
                {this.state.error && <div>Oops, something went wrong!</div>}
                <input
                    name="first"
                    placeholder="first name..."
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <input
                    name="last"
                    placeholder="last name..."
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <input
                    name="email"
                    placeholder="email..."
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <input
                    name="password"
                    placeholder="password"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <button onClick={() => this.submit()}>Register!</button>
                <p>
                    Do you already have an account?
                    <Link to="/"> Login</Link>
                </p>
            </div>
        );
    }
}
