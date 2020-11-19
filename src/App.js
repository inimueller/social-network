// main container component for the entire LOGGED IN experience of our users

import React from "react";
import Logo from "./logo";
import Uploader from "./Uploader";
import Profile from "./Profile";
import ProfilePic from "./ProfilePic";
import axios from "./axios";
import OtherProfile from "./OtherProfile";
import { BrowserRouter, Route } from "react-router-dom";
import FindPeople from "./FindPeople";
import Friends from "./Friends";
import Chat from "./Chat";

export default class App extends React.Component {
    constructor() {
        //YOU WILL GET THIS INFORMATION FROM YOUR AXIOS REQUEST
        super();
        this.state = {
            uploaderIsVisible: false, //should actually be false but then I don't see it so I set it to true to see it.
        };
        this.methodInApp = this.methodInApp.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }

    componentDidMount() {
        console.log("App just mounted");
        axios
            .get("/user")
            .then(({ data }) => {
                const { first, last, email, bio, url, id } = data;
                // console.log(data);
                this.setState({
                    id: id,
                    first: first,
                    last: last,
                    email: email,
                    bio: bio,
                    imgUrl: url,
                });
                // console.log(this.state);
                // console.log("data in componentDidMount: ", data);
            })
            .catch((e) => {
                console.log("error in axios: ", e);
            });
        // axios
        //     .get("/ini")
        //     .then(() => {
        //         console.log("lol");
        //     })
        //     .catch((e) => {
        //         console.log("ini error: ", e);
        //     });
    }

    toggleComponent() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    updateBio(arg) {
        this.setState({ bio: arg });
        () => {
            console.log("state in App after updateBio", this.state);
        };
    }

    methodInApp(arg) {
        this.toggleComponent();
        // this.setState();
        this.setState({ imgUrl: arg });
    }

    render() {
        return (
            <BrowserRouter>
                <header>
                    <Logo />
                    <div
                        className="navbar"
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            marginTop: "40px",
                        }}
                    >
                        <div>
                            <h4>
                                <a
                                    className="navbar-text"
                                    style={{
                                        padding: "20px",
                                        fontSize: "18px",
                                    }}
                                    href="/users"
                                >
                                    Search
                                </a>
                            </h4>
                        </div>
                        <div>
                            <h4>
                                <a
                                    className="navbar-text"
                                    style={{
                                        padding: "20px",
                                        fontSize: "18px",
                                    }}
                                    href="/friends"
                                >
                                    Friends
                                </a>
                            </h4>
                        </div>

                        <div>
                            <h4>
                                <a
                                    className="navbar-text"
                                    style={{
                                        padding: "20px",
                                        fontSize: "18px",
                                    }}
                                    href="/logout"
                                >
                                    Log out
                                </a>
                            </h4>
                        </div>
                    </div>
                    <div
                        style={{
                            zoom: "20%",
                            marginTop: "80px",
                            marginRight: "80px",
                            overflow: "hidden",
                            // position: "fixed",
                            zIndex: "20",
                        }}
                    >
                        <ProfilePic
                            first={this.state.first}
                            last={this.state.last}
                            imgUrl={this.state.imgUrl}
                            toggleComponent={() => this.toggleComponent()}
                        />
                    </div>
                </header>

                {/* <div>
                    <FindPeople />
                </div> */}
                <div>
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                imgUrl={this.state.imgUrl}
                                first={this.state.first}
                                last={this.state.last}
                                bio={this.state.bio}
                                id={this.state.id}
                                updateBio={(arg) => this.updateBio(arg)}
                            />
                        )}
                    />
                </div>
                <div>
                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                key={props.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                </div>

                <div>
                    <Route path="/friends" render={() => <Friends />} />
                </div>

                <div>
                    <Route path="/users" render={() => <FindPeople />} />
                </div>
                <div>
                    <Route path="/chat" render={() => <Chat />} />
                </div>

                <div>
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            methodInApp={this.methodInApp}
                            imgUrl={this.state.imgUrl}
                            // toggleComponent={() => this.toggleComponent()}
                        />
                    )}
                </div>
            </BrowserRouter>
        );
    }
}
