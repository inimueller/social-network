import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super();
        this.state = {
            url: props.imgUrl,
        };
    }

    componentDidMount() {
        console.log("uploader mounted");
        console.log("this.props: ", this.props);
    }

    methodInUploader() {
        this.props.methodInApp(this.state.url);
    }

    // code written by Piotr to get a preview of the new profile picture:

    handleChange(e) {
        var reader = new FileReader();
        reader.onload = function () {
            var dataURL = reader.result;
            var card = document.getElementById("card");
            card.src = dataURL;
        };

        reader.readAsDataURL(e.target.files[0]);
        this.setState(
            {
                [e.target.name]: e.target.files[0],
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
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                }}
            >
                <div id="profile-container">
                    <div
                        id="modal"
                        style={{
                            backgroundColor: "whitesmoke",
                            position: "absolute",
                            zIndex: "2",
                            marginTop: "-442px",
                            marginLeft: "-146px",
                            // opacity: "50%",
                        }}
                    >
                        <div id="uploader" style={{ width: "232px" }}>
                            {/* <h1>Uploader</h1> */}
                            <img
                                style={{ width: "100%", marginBottom: "50px" }}
                                id="card"
                                src={
                                    this.state.url ||
                                    "https://static.toiimg.com/photo/msid-67586673/67586673.jpg?3918697"
                                }
                            />
                            <div style={{ backgroundColor: "whitesmoke" }}>
                                <input
                                    style={{
                                        fontFamily: "Open Sans",
                                        color: "darkgoldenrod",
                                    }}
                                    name="file"
                                    type="file"
                                    onChange={(e) => this.handleChange(e)}
                                ></input>
                                <button
                                    style={{ width: "100%" }}
                                    onClick={() => this.submit()}
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
