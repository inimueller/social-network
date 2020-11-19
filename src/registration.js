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
            <>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    {this.state.error && <div>Oops, something went wrong!</div>}
                    <div
                        style={{
                            width: "163px",
                            marginTop: "5px",
                            marginBottom: "15px",
                        }}
                    >
                        <input
                            name="first"
                            placeholder="First name"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        <input
                            name="last"
                            placeholder="Last name"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        <input
                            name="email"
                            placeholder="Email"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        <input
                            name="password"
                            placeholder="Password"
                            type="password"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ width: "163px" }}>
                        <div
                            id="register-button"
                            style={{
                                // display: "flex",
                                // justifyContent: "center",
                                position: "relative",
                                width: "100%",
                            }}
                        >
                            <button
                                id="reg-button"
                                onClick={() => this.submit()}
                            >
                                Register
                            </button>
                        </div>
                        <div
                            id="login-text"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <p>
                                Already registered? <br />
                                <Link
                                    className="fake-button"
                                    style={{
                                        color: "darkgoldenrod",
                                        textDecoration: "none",
                                    }}
                                    to="/login"
                                >
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
