import React, { Component } from "react";
import axios from "./axios";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorIsVisible: false,
            textarea: "",
        };
    }

    toggleBioEditor() {
        console.log("toggleBioEditor works");
        this.setState({
            editorIsVisible: !this.state.editorIsVisible,
            bio: this.props.bio,
        });
        let textarea = document.getElementsByTagName("textarea");
        console.log("text area: ", textarea);
    }

    handleChange(e) {
        console.log("bio: ", this.state.bio);
        this.setState(
            {
                bio: e.target.value,
            },
            () => {
                console.log("this.state: ", this.state);
            }
        );
    }

    updateBioComponent(arg) {
        console.log("UpdateBio", arg);
        this.props.updateBio(arg);
    }

    submitBio() {
        console.log("about to submit!!!", this.state);
        axios
            .post("/bio", { bio: this.state.bio, id: this.props.id })
            .then((response) => {
                console.log("response data: ", response.data);
                this.setState({
                    bio: response.data.bio,
                });
                this.updateBioComponent(response.data);
                this.toggleBioEditor();
            })
            .catch((err) => {
                console.log("error: ", err);
            });
    }

    render() {
        return (
            <>
                {/* <h1>Bio editor</h1> */}

                {this.state.editorIsVisible && (
                    <div>
                        <textarea
                            id="textarea"
                            name="bio"
                            onChange={(e) => this.handleChange(e)}
                            value={this.state.bio}
                        />
                    </div>
                )}
                <div id="bio-itself">{this.props.bio}</div>
                {this.props.bio && !this.state.editorIsVisible && (
                    <button onClick={() => this.toggleBioEditor()}>Edit</button>
                )}
                {!this.props.bio && !this.state.editorIsVisible && (
                    <button onClick={() => this.toggleBioEditor()}>Edit</button>
                )}
                {this.state.editorIsVisible && (
                    <button onClick={() => this.submitBio()}>Submit</button>
                )}
            </>
        );
    }
}
