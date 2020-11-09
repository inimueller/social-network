import React from "react";
import BioEditor from "./BioEditor";
import ProfilePic from "./ProfilePic";

export default function Profile(props) {
    return (
        <>
            <div id="profile-container">
                <div id="profile">
                    <h1>{props.first}'s Profile</h1>
                    <h3>Tell something about yourself:</h3>
                    <div id="bio-modal">
                        <div id="bio">
                            <BioEditor
                                bio={props.bio}
                                updateBio={(arg) => props.updateBio(arg)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
