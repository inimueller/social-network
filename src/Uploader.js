import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super();
        this.state = {
            url: props.url,
        };
    }

    componentDidMount() {
        console.log("uploader mounted");
        console.log("this.props: ", this.props);
    }

    methodInUploader() {
        this.props.methodInApp(this.state.url);
    }

    handleChange(e) {
        console.log("e.target.value: ", e.target.value);
        console.log("img path:", e);
        this.setState(
            {
                [e.target.name]: e.target.files[0],
                //think how to make temporarily file to be displayed after change
                url: e.target.files[0].name,
            },
            () => {
                console.log("this.state: ", this.state);
            }
        );
    }

    submit() {
        console.log("about to submit!!!", this.state);
        let formData = new FormData();
        formData.append("file", this.state.file);
        formData.append("id", this.props.id);
        console.log("formData: ", formData);

        axios
            .post("/images", formData)
            .then((response) => {
                // console.log(response);
                if (response.data) {
                    //then we want to redirect the user to our social network
                    console.log(response.data);
                    this.setState({
                        url: response.data,
                    });
                    this.methodInUploader();
                } else {
                    console.log("error in else in axios");
                }
            })
            .catch((e) => {
                console.log("catch in axios request: ", e);
            });
    }

    render() {
        return (
            <div id="uploader">
                <h1>Uploader</h1>
                <img
                    src={
                        this.state.url ||
                        "https://static.toiimg.com/photo/msid-67586673/67586673.jpg?3918697"
                    }
                />

                <input
                    name="file"
                    type="file"
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <button onClick={() => this.submit()}>Upload</button>
            </div>
        );
    }
}
