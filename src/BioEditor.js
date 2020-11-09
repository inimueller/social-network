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

    toggleBioEditor(e) {
        console.log("toggleBioEditor works");
        this.setState({
            editorIsVisible: !this.state.editorIsVisible,
            bioDraft: this.props.bio,
        });
        console.log(e);
        let textarea = document.getElementsByTagName("textarea");
        console.log(textarea);
    }

    handleChange(e) {
        console.log("bioDraft: ", this.state.bioDraft);
        this.setState(
            {
                bioDraft: e.target.value,
            },
            () => {
                console.log("this.state: ", this.state);
            }
        );
    }

    updateBio(arg) {
        console.log("console.log in updateBio", arg);
        this.props.updateBio(arg);
    }

    submitBio() {
        console.log("about to submit!!!", this.state);
        axios
            .post("/bio", { bio: this.state.bioDraft, id: this.props.id })
            .then((response) => {
                console.log(response.data);
                this.setState({
                    bioDraft: response.data.bio,
                });
                this.updateBio(response.data.bio);
                this.toggleBioEditor();
            })
            .catch((e) => {
                console.log(e);
            });
    }

    render() {
        return (
            <>
                <h1>Bio editor</h1>

                {this.state.editorIsVisible && (
                    <div>
                        <textarea
                            id="textarea"
                            name="bio"
                            onChange={(e) => this.handleChange(e)}
                            // need to work or prepopulation the textfield
                            value={this.state.bioDraft}
                        />
                    </div>
                )}
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
