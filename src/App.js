// main container component for the entire LOGGED IN experience of our users

import React from "react";
import Logo from "./logo";
import Uploader from "./Uploader";
import ProfilePic from "./ProfilePic";
import axios from "./axios";

export default class App extends React.Component {
    constructor() {
        //YOU WILL GET THIS INFORMATION FROM YOUR AXIOS REQUEST
        super();
        this.state = {
            uploaderIsVisible: false, //should actually be false but then I don't see it so I set it to true to see it.
        };
        this.methodInApp = this.methodInApp.bind(this);
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
                console.log(data);
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

    methodInApp(arg) {
        this.toggleComponent();
        // this.setState();
        this.setState({ imgUrl: arg });
    }

    render() {
        return (
            <>
                <header>
                    <Logo />
                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        imgUrl={this.state.imgUrl}
                        toggleComponent={() => this.toggleComponent()}
                    />
                </header>
                <div>
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            methodInApp={this.methodInApp}
                            imgUrl={this.state.imgUrl}
                            // toggleComponent={() => this.toggleComponent()}
                        />
                    )}
                </div>
            </>
        );
    }
}
