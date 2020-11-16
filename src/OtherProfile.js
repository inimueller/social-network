import React from "react";
import axios from "./axios";
import FriendButton from "./FriendButton";

export default class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        // console.log("this.props.match", this.props.match);
        // we'll want to use this.props.match.params.id to tell our server for which user
        // we want to get information for, our server should also check and see if we are
        // trying to access our own profile, or simply send back the id of our logged
        // in user alongside the information for the one we are currently viewing,
        // if we are viewing ourself, we should be send back to the slash route
        axios
            .get(`/api/user/${this.props.match.params.id}`)
            .then((response) => {
                // console.log("response in componentDidMount: ", response);

                if (response.data.editing) {
                    this.props.history.push("/");
                } else {
                    this.setState({
                        first: response.data.first,
                        last: response.data.last,
                        url: response.data.url,
                        bio: response.data.bio,
                    });
                    // console.log("hello thanks moni: ", this.state);
                }
            })
            .catch((err) => {
                console.log("error in axios componentDidMount : ", err);
            });
    }

    render() {
        return (
            <>
                <div id="other-profile">
                    <h1> Hi am the OtherProfile</h1>
                    <img
                        src={
                            this.state.url ||
                            "https://static.toiimg.com/photo/msid-67586673/67586673.jpg?3918697"
                        }
                    />

                    <h4>
                        {this.state.first} {this.state.last}
                    </h4>
                    <p>{this.state.bio}</p>
                    {/* <FriendButton otherUserId={this.state.id} /> */}
                    <FriendButton otherUserId={this.props.match.params.id} />
                </div>
            </>
        );
    }
}
