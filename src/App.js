import React from "react";
import Logo from "./logo";
import Xmpl from "./Xmpl";
import Uploader from "./Uploader";

export default class App extends React.Component {
    constructor() {
        super();
        //we are hardcoding info into state:
        //YOU WILL GET THIS INFORMATION FROM YOUR AXIOS REQUEST
        this.state = {
            first: "Merle",
            last: "Fischer",
            imgUrl: null,
            uploaderIsVisible: false,
        };
    }
    componentDidMount() {
        console.log("App just mounted");
        //here we will want to make an axios request
        //to get info about our logged in user
        //once we have the user data we will want to use
        //setState to store the info in our component state
    }
    toggleUploader() {
        console.log("you wanna make the uploadera appear");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }
    render() {
        return (
            <>
                <Logo />
                <h1>I am still your App :D</h1>
                <Xmpl
                    first={this.state.first}
                    last={this.state.last}
                    imgUrl={this.state.imgUrl}
                />
                <h2 onClick={() => this.toggleUploader()}>
                    Changing state with a method toggleUploader{" "}
                    {this.state.uploaderIsVisible && "🐷"}{" "}
                    {!this.state.uploaderIsVisible && "🦅"}
                </h2>
                {this.state.uploaderIsVisible && <Uploader />}
                {/* this uploaderIsVisible is set to false in line 15 */}
            </>
        );
    }
}
