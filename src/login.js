import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {};
        // this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        console.log("e.target.value: ", e.target.value);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => {
                console.log("this.state: ", this.state);
            }
        );
    }

    submit() {
        console.log("about to submit!!!");
        axios
            .post("/login", this.state)
            .then((response) => {
                console.log(response);
                if (response.data.success) {
                    //then we want to redirect the user to our social network
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        console.log("this.state.error: ", this.state.error);
        return (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: "400px", fontFamily: "Open Sans" }}>
                    {this.state.error && (
                        <div>Oops, something went wrong 🤕</div>
                    )}

                    <input
                        style={{ width: "198px", marginLeft: "0px" }}
                        name="email"
                        placeholder="Email"
                        onChange={(e) => this.handleChange(e)}
                        // onChange={this.handleChange}
                    ></input>
                    <input
                        style={{ width: "198px", marginRight: "0px" }}
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                    <div style={{}}>
                        <div>
                            <button
                                style={{ width: "400px", marginTop: "2px" }}
                                onClick={() => this.submit()}
                            >
                                Login
                            </button>
                        </div>
                        <div>
                            <p>
                                If you don't have an account yet please go
                                to&nbsp;
                                <Link to="/">Register</Link>
                            </p>
                        </div>
                        <p>
                            Did you forget your password?&nbsp;
                            <Link to="/reset">Reset</Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
