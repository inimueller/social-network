import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor() {
        super();
        this.state = {
            display: 1,
        };
        //choosing to bind this, seems easier
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    getCurrentDisplay() {
        const step = this.state.display;
        if (step == 1) {
            console.log("first display modus");

            return (
                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                    }}
                >
                    <div>
                        <p>Please enter your email address</p>
                        <input
                            key="mail"
                            name="email"
                            placeholder="Email"
                            onChange={this.handleChange}
                            autoComplete="off"
                        ></input>
                        <button onClick={() => this.reset()}>Reset</button>
                    </div>
                </div>
            );
        } else if (step == 2) {
            console.log("second display modus");
            return (
                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                    }}
                >
                    <div>
                        <p>Enter your secret code here:</p>
                        <input
                            key="code"
                            name="code"
                            placeholder="Code"
                            onChange={this.handleChange}
                            autoComplete="off"
                        ></input>
                        <p>Please enter a new password:</p>
                        <input
                            name="password"
                            placeholder="Password"
                            type="password"
                            onChange={this.handleChange}
                            autoComplete="off"
                        ></input>
                        <button onClick={() => this.update()}>update</button>
                    </div>
                </div>
            );
        } else {
            console.log("third display modus");
            return (
                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                    }}
                >
                    <p>Password reset successfully reset.&nbsp;</p>
                    <p>
                        <Link to="/login">Log in</Link> with new password.
                    </p>
                </div>
            );
        }
    }

    reset() {
        console.log("Axios in reset()");
        axios
            .post("/reset/email", this.state)
            .then((response) => {
                console.log("response in reset() axios", response);
                if (response.data.success) {
                    console.log("successful response in reset/email axios");
                    this.setState({ display: this.state.display + 1 });
                } else {
                    console.log(
                        "error with email submission in Password reset"
                    );
                    //here setStake{display:X} which can be used to conditionally render an error
                }
            })
            .catch((err) => {
                console.log("err in reset/email axios axios", err);
            });
    }
    update() {
        console.log("axios in update failed");
        axios
            .post("/reset/verify", this.state)
            .then((response) => {
                console.log("axios response for update", response);
                if (response.data.success) {
                    console.log("successful response in reset/verify axios");
                    this.setState({ display: this.state.display + 1 });
                } else {
                    console.log(
                        "error with email submission in Password reset"
                    );
                }
            })
            .catch((err) => {
                console.log("err in reset/email axios axios", err);
            });
    }

    render() {
        return <div>{this.getCurrentDisplay()}</div>;
    }
}
